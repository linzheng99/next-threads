import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { type Id } from "./_generated/dataModel"
import { mutation, type QueryCtx } from "./_generated/server"

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return await ctx.db.query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique()
}

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
      updatedAt: Date.now(),
    })

    return messageId
  }
})
