import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInvokeLLM = vi.hoisted(() => vi.fn());
vi.mock("./_core/llm", () => ({ invokeLLM: mockInvokeLLM }));

import { appRouter } from "./routers";

const context = { user: undefined, req: {} as any, res: {} as any };
const input = { lesson: "Tez qo‘shish usuli", answers: [
  { question: "8 + 5", expected: 13, answer: 13, seconds: 2 },
  { question: "17 − 9", expected: 8, answer: 8, seconds: 3 },
] };

describe("diagnostics.assess", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a useful deterministic level when AI is unavailable", async () => {
    mockInvokeLLM.mockRejectedValueOnce(new Error("test fallback"));
    const result = await appRouter.createCaller(context).diagnostics.assess(input);
    expect(result.level).toBe("Imkonsiz");
    expect(result.accuracy).toBe(100);
    expect(result.focus.length).toBeGreaterThan(0);
    expect(result.dailyPlan).toContain("10 daqiqa");
  });

  it("parses and returns a valid AI assessment", async () => {
    mockInvokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({ level: "Tezlik", score: 82, summary: "Yaxshi start.", strengths: ["Aniqlik"], focus: ["Tezlik"], dailyPlan: "Har kuni 10 daqiqa." }) } }] });
    const result = await appRouter.createCaller(context).diagnostics.assess(input);
    expect(result.level).toBe("Tezlik");
    expect(result.score).toBe(82);
    expect(result.strengths).toContain("Aniqlik");
    expect(result.avgSeconds).toBe(2.5);
  });
});
