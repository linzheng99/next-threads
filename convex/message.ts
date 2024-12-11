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

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      workspaceId: args.workspaceId,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    })

    return messageId
  }
})