import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from "convex/values";

import { generateCode } from '../src/lib/utils';
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return []
    }

    // 获取用户所在的所有 workspace
    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect()

    const workspaceIds = members.map((member) => member.workspaceId)
    const workspaces = []

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId)

      if (workspace) {
        workspaces.push(workspace)
      }
    }

    return workspaces
  }
})

export const getById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    // 检测用户是否在 workspace 中
    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', args.id).eq('userId', userId))
      .unique()

    if (!member) {
      return null
    }

    return await ctx.db.get(args.id)
  }
})

export const getInfoById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', args.id).eq('userId', userId))
      .unique()

    const workspace = await ctx.db.get(args.id)

    if (!workspace) {
      throw new Error("Workspace not found")
    }

    return {
      name: workspace.name,
      isMember: !!member,
    }
  }
})

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const joinCode = generateCode()

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    })

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    })

    await ctx.db.insert("channels", {
      name: "General",
      workspaceId,
    })

    return workspaceId
  }
})

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', args.id).eq('userId', userId))
      .unique()

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized")
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    })

    return args.id
  }
})

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', args.id).eq('userId', userId))
      .unique()

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized")
    }

    // 删除 workspace 中的所有成员; TODO: remove channels
    const [members] = await Promise.all([
      ctx.db.query('members').withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id)).collect(),
    ])

    for (const member of members) {
      await ctx.db.delete(member._id)
    }

    await ctx.db.delete(args.id)

    return args.id
  }
})

export const updateJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', args.workspaceId).eq('userId', userId))
      .unique()

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized")
    }

    const joinCode = generateCode()

    await ctx.db.patch(args.workspaceId, { joinCode })

    return args.workspaceId
  }
})

export const join = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const existingMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', args.workspaceId).eq('userId', userId))
      .unique()

    if (existingMember) {
      throw new Error("Already a member of this workspace")
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error("Workspace not found")
    }

    if (workspace.joinCode !== args.joinCode) {
      throw new Error("Invalid join code")
    }

    await ctx.db.insert("members", {
      userId,
      workspaceId: args.workspaceId,
      role: "member",
    })

    return args.workspaceId
  }
})
