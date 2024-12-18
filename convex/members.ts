import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { type Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";

const populateMembers = async (ctx: QueryCtx, id: Id<"users">) => {
  return await ctx.db.get(id)
}

export const getById = query({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return null
    }

    const member = await ctx.db.get(args.id)

    if (!member) {
      return null
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", member.workspaceId).eq("userId", userId))
      .unique()

    if (!currentMember) {
      return null
    }

    const user = await populateMembers(ctx, member.userId)

    if (!user) {
      return null
    }

    return {
      ...member,
      user,
    }
  },
})

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect()

    const members = []
    for (const member of data) {
      const user = await populateMembers(ctx, member.userId)
      if (user) {
        members.push({
          ...member,
          user,
        })
      }
    }

    return members
  },
})

export const current = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique()

    if (!member) {
      return null
    }

    return member
  },
});

export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db.get(args.id)

    if (!member) {
      throw new Error("Member not found")
    }

    // Check if the user is an admin
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", member.workspaceId).eq("userId", userId))
      .unique()

    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorized")
    }

    await ctx.db.patch(args.id, {
      role: args.role,
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")

    }

    const member = await ctx.db.get(args.id)

    if (!member) {
      throw new Error("Member not found")
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", member.workspaceId).eq("userId", userId))
      .unique()

    if (!currentMember) {
      throw new Error("Unauthorized")
    }

    // member is admin
    if (member.role === "admin") {
      throw new Error("You cannot remove an admin")
    }

    // current user is admin
    if (currentMember._id === member._id && currentMember.role === "admin") {
      throw new Error("You cannot remove yourself as an admin")
    }

    // delete messages, reactions, and conversations to this member
    const [messages, reactions, conversations] = await Promise.all([
      ctx.db.query("messages").withIndex("by_member_id", (q) => q.eq("memberId", args.id)).collect(),
      ctx.db.query("reactions").withIndex("by_member_id", (q) => q.eq("memberId", args.id)).collect(),
      ctx.db.query("conversations").filter((q) =>
        q.or(
          q.eq(q.field("memberOneId"), args.id),
          q.eq(q.field("memberTwoId"), args.id),
        )
      ).collect(),
    ])


    if (messages.length > 0) {
      for (const message of messages) {
        await ctx.db.delete(message._id)
      }
    }

    if (reactions.length > 0) {
      for (const reaction of reactions) {
        await ctx.db.delete(reaction._id)
      }
    }

    if (conversations.length > 0) {
      for (const conversation of conversations) {
        await ctx.db.delete(conversation._id)
      }
    }

    await ctx.db.delete(args.id)

    return args.id
  },
})
