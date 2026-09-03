import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const diagnosticResultSchema = {
  type: "object",
  properties: {
    level: { type: "string", enum: ["Boshlang‘ich", "Tezlik", "Pro", "Qiyin", "Imkonsiz"] },
    score: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    focus: { type: "array", items: { type: "string" } },
    dailyPlan: { type: "string" },
  },
  required: ["level", "score", "summary", "strengths", "focus", "dailyPlan"],
  additionalProperties: false,
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  diagnostics: router({
    assess: publicProcedure
      .input(z.object({
        answers: z.array(z.object({ question: z.string(), expected: z.number(), answer: z.number().nullable(), seconds: z.number().min(0).max(120) })).min(1).max(20),
        lesson: z.string().min(1).max(120),
      }))
      .mutation(async ({ input }) => {
        const correct = input.answers.filter(item => item.answer === item.expected).length;
        const accuracy = Math.round((correct / input.answers.length) * 100);
        const avgSeconds = input.answers.reduce((sum, item) => sum + item.seconds, 0) / input.answers.length;
        const fallbackLevel = accuracy >= 90 && avgSeconds <= 4 ? "Imkonsiz" : accuracy >= 78 ? "Pro" : accuracy >= 60 ? "Tezlik" : "Boshlang‘ich";
        try {
          const response = await invokeLLM({
            model: "gpt-5-mini",
            messages: [
              { role: "system", content: "You are a supportive Uzbek mental arithmetic coach. Analyze diagnostic results conservatively. Return JSON only. Never shame the learner. Recommend a level based on accuracy and speed, and give specific useful next steps." },
              { role: "user", content: JSON.stringify({ lesson: input.lesson, answers: input.answers, accuracy, avgSeconds }) },
            ],
            response_format: { type: "json_schema", json_schema: { name: "diagnostic_result", strict: true, schema: diagnosticResultSchema } },
            maxTokens: 700,
          });
          const content = response.choices[0]?.message.content;
          if (typeof content === "string") return { ...JSON.parse(content), accuracy, avgSeconds: Number(avgSeconds.toFixed(1)) };
        } catch (error) {
          console.warn("[Diagnostics] AI assessment unavailable, using deterministic fallback", error);
        }
        return { level: fallbackLevel, score: accuracy, summary: accuracy >= 78 ? "Asosiy usullar yaxshi shakllangan." : "Asosiy usullarni yana bir necha marta mustahkamlash foydali.", strengths: ["Darsni oxirigacha bajarding", `${correct}/${input.answers.length} ta to‘g‘ri javob`], focus: [accuracy < 78 ? "Aniqlikni oshirish" : "Tezlikni barqarorlashtirish", "Har kuni qisqa mashq"], dailyPlan: "Har kuni 10 daqiqa: 5 daqiqa dars, 3 daqiqa test, 2 daqiqa xatolarni ko‘rib chiqish.", accuracy, avgSeconds: Number(avgSeconds.toFixed(1)) };
      }),
  }),
});

export type AppRouter = typeof appRouter;
