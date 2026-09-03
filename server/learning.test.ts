import { describe, expect, it } from "vitest";
import { makeExercise } from "../client/src/pages/SubjectPage";
import { calculateAccuracy, getAgeBand, getAgeRecommendation, getUnlockedLevel } from "../client/src/lib/learning";
import { getErrorAnalysis, getNextUniqueQuestion, makeQuestion } from "../client/src/lib/arithmeticPractice";
import { filterGeometryTerms } from "../client/src/pages/GeometryGlossary";

describe("learning progression", () => {
  it("has a working geometry perimeter exercise", () => {
    const junior = makeExercise("geometriya", 0, 12);
    const adult = makeExercise("geometriya", 0, 30);
    expect(junior.prompt).toContain("perimetri");
    expect(junior.answer).toBe(14);
    expect(adult.answer).toBe(32);
  });

  it("has working sinus, cosinus, tangens and kotangens exercises", () => {
    expect(makeExercise("trig", 0, 30).answer).toBe(0.5);
    expect(makeExercise("trig", 1, 30).answer).toBe(0.5);
    expect(makeExercise("trig", 2, 30).answer).toBe(1);
    expect(makeExercise("trig", 3, 30).answer).toBe(1);
  });

  it("never repeats a question id in the same session and includes an explanation", () => {
    const first = makeQuestion(0, 16, 0);
    const next = getNextUniqueQuestion(0, 16, 1, [first.id]);
    expect(next.question.id).not.toBe(first.id);
    expect(next.question.explanation.length).toBeGreaterThan(0);
    expect(next.question.hint).toBeTruthy();
  });

  it("shows a formula and step-by-step explanation for wrong answers", () => {
    const question = makeQuestion(0, 16, 0);
    const analysis = getErrorAnalysis(question);
    expect(analysis[0]).toContain("Formula:");
    expect(analysis.length).toBeGreaterThan(2);
    expect(analysis.at(-1)).toContain("Javob:");
  });

  it("filters the geometry glossary by query and category", () => {
    expect(filterGeometryTerms("radius", "Barchasi").some((item) => item.term === "Radius")).toBe(true);
    expect(filterGeometryTerms("sinus", "Trigonometrik")).toHaveLength(2);
    expect(filterGeometryTerms("radius", "Teorema")).toHaveLength(0);
  });

  it("uses age and quality signals for recommendations and unlocks", () => {
    expect(getAgeBand(10)).toBe("Junior");
    expect(getAgeBand(16)).toBe("Student");
    expect(getAgeBand(30)).toBe("Adult");
    expect(getAgeRecommendation(30, "trig")).toContain("Sinus");
    expect(calculateAccuracy(7, 10)).toBe(70);
    expect(getUnlockedLevel(6, 10, 2)).toBe(0);
    expect(getUnlockedLevel(6, 8, 6)).toBe(2);
  });
});
