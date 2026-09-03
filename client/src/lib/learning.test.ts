import { describe, expect, it } from "vitest";
import { makeExercise } from "../pages/SubjectPage";
import { calculateAccuracy, getAgeBand, getAgeRecommendation, getUnlockedLevel } from "./learning";

describe("learning paths", () => {
  it("generates working geometry perimeter and adult geometry prompts", () => {
    const junior = makeExercise("geometriya", 0, 12);
    const adult = makeExercise("geometriya", 0, 30);
    expect(junior.prompt).toContain("perimetri");
    expect(junior.answer).toBe(22);
    expect(adult.answer).toBe(42);
  });

  it("generates all trigonometry fundamentals", () => {
    expect(makeExercise("trig", 0, 30).answer).toBe(0.5);
    expect(makeExercise("trig", 1, 30).answer).toBe(0.5);
    expect(makeExercise("trig", 2, 30).answer).toBe(1);
    expect(makeExercise("trig", 3, 30).answer).toBe(1);
  });

  it("maps age to content and only unlocks with accuracy plus streak", () => {
    expect(getAgeBand(10)).toBe("Junior");
    expect(getAgeBand(16)).toBe("Student");
    expect(getAgeBand(30)).toBe("Adult");
    expect(getAgeRecommendation(30, "trig")).toContain("Sinus");
    expect(calculateAccuracy(7, 10)).toBe(70);
    expect(getUnlockedLevel(6, 10, 2)).toBe(0);
    expect(getUnlockedLevel(6, 8, 3)).toBe(2);
  });
});
