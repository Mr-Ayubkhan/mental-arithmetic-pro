import { describe, expect, it, vi } from "vitest";

const updateUserAge = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock("./db", () => ({ updateUserAge }));

import { appRouter } from "./routers";

describe("profile.setAge", () => {
  it("persists a valid age for the authenticated user", async () => {
    const caller = appRouter.createCaller({
      user: { id: 42, openId: "profile-user", role: "user" } as any,
      req: {} as any,
      res: {} as any,
    });
    const result = await caller.profile.setAge({ age: 30 });
    expect(result).toEqual({ success: true, age: 30 });
    expect(updateUserAge).toHaveBeenCalledWith(42, 30);
  });
});
