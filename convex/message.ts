import { getAuthUserId } from "@convex-dev/auth/server"
import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"

import { type Doc, type Id } from "./_generated/dataModel"
import { mutation, query, type QueryCtx } from "./_generated/server"

/**
 * 收集消息回复线程
 * 提供线程的预览信息
 * 不需要加载所有回复内容就能显示基本信息
 * 让用户快速了解线程的活跃程度和最新状态
 */
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  // 获取所有回复指定消息的消息列表
  const messages = await ctx.db.query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
    .collect()

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    }
  }

  const lastMessage = messages[messages.length - 1]
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId)

  // 如果最后一条消息的成员不存在，则返回最后一条消息的图片和时间
  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: lastMessage.image,
      timestamp: lastMessage.updatedAt,
    }
  }

  // 如果存在最后一条消息的成员，则获取最后一条消息的用户的头像
  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)

  return {
    count: messages.length, // 回复线程中的消息数量
    image: lastMessageUser?.image, // 回复线程的用户的头像
    timestamp: lastMessageUser?._creationTime, // 回复线程中最后一条消息的时间
  }
}

// 收集消息的 reactions
const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return await ctx.db.query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect()
}

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId)
}

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId)
}

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return await ctx.db.query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique()
}

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    let _conversationId = args.conversationId

    // 如果不在频道中，也没有对话 id，则返回所有回复指定消息的消息列表
    if (!args.channelId && !args.conversationId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId)

      if (!parentMessage) {
        throw new Error("Parent message not found")
      }

      _conversationId = parentMessage.conversationId
    }

    // 按时间降序排序
    const results = await ctx.db.query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: (
        await Promise.all(results.page.map(async (message) => {
          const member = await populateMember(ctx, message.memberId)
          const user = member ? await populateUser(ctx, member.userId) : null

          if (!member || !user) {
            return null
          }

          const reactions = await populateReactions(ctx, message._id)
          const thread = await populateThread(ctx, message._id)
          const image = message.image ? await ctx.storage.getUrl(message.image) : undefined

          // 转换数据结构，计算每个reaction的count
          const reactionsWithCount = reactions.map((reaction) => ({
            ...reaction,
            count: reactions.filter((r) => r.value === reaction.value).length,
          }))

          // 去重，合并用户ID
          const dedupedReactions = reactionsWithCount.reduce((acc, reaction) => {
            const existingReaction = acc.find((r) => r.value === reaction.value)

            // 如果已存在该表情，合并用户ID
            // 如果是新表情，创建新记录
            if (existingReaction) {
              existingReaction.memberIds = Array.from(
                new Set([...existingReaction.memberIds, reaction.memberId])
              )
            } else {
              acc.push({
                ...reaction,
                memberIds: [reaction.memberId],
              })
            }

            return acc
          },
            [] as (Doc<'reactions'> & {
              count: number,
              memberIds: Id<'members'>[],
            })[]
          )

          // 移除memberId属性
          const reactionsWithoutMemberIdProperty = dedupedReactions.map(
            ({ memberId: _memberId, ...rest }) => rest
          )

          return {
            ...message,
            image,
            user,
            member,
            reactions: reactionsWithoutMemberIdProperty,
            threadCount: thread.count,
            threadImage: thread.image,
            threadTimestamp: thread.timestamp,
          }
        }))
      ).filter((message): message is NonNullable<typeof message> => message !== null)
    }
  }
})

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await getMember(ctx, args.workspaceId, userId)

    if (!member) {
      throw new Error("Unauthorized")
    }

    let _conversationId = args.conversationId

    // only possible if we are replying in a thread in 1:1 conversation
    // 1:1 回复
    // 1. 不在频道中
    // 2. 没有对话 id
    // 3. 有父消息 id
    if (!args.channelId && !args.conversationId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId)

      if (!parentMessage) {
        throw new Error("Parent message not found")
      }

      _conversationId = parentMessage.conversationId
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      workspaceId: args.workspaceId,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
    })

    return messageId
  }
})

export const update = mutation({
  args: {
    id: v.id('messages'),
    body: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const message = await ctx.db.get(args.id)

    if (!message) {
      throw new Error("Message not found")
    }

    const member = await getMember(ctx, message.workspaceId, userId)

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized")
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    })

    return args.id
  }
})

export const remove = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const message = await ctx.db.get(args.id)

    if (!message) {
      throw new Error("Message not found")
    }

    const member = await getMember(ctx, message.workspaceId, userId)

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized")
    }

    await ctx.db.delete(args.id)

    return args.id
  }
})
