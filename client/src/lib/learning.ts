export type AgeBand = "Junior" | "Student" | "Adult";

export function getAgeBand(age: number): AgeBand {
  return age < 13 ? "Junior" : age < 18 ? "Student" : "Adult";
}

export function calculateAccuracy(correctAnswers: number, attempts: number): number {
  return attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;
}

export function getUnlockedLevel(correctAnswers: number, attempts: number, bestStreak: number): number {
  const accuracy = calculateAccuracy(correctAnswers, attempts);
  if (accuracy < 70 || bestStreak < 3) return 0;
  return Math.min(4, Math.floor(correctAnswers / 3), Math.floor(bestStreak / 3));
}

export function getAgeRecommendation(age: number, subject: "algebra" | "geometriya" | "trig"): string {
  if (age < 13) return subject === "geometriya" ? "Shakllarni ko‘rish, perimetr va burchaklardan boshlang." : "Qisqa misollar va ko‘paytirish asoslarini mustahkamlang.";
  if (age < 18) return subject === "trig" ? "Sinus va kosinusni uchburchak rasmi bilan bog‘lang." : "Burchaklar, Pifagor va tenglamalarni navbat bilan mashq qiling.";
  return subject === "trig" ? "Sinus, kosinus, tangens va kotangensni real masalalarda qo‘llang." : "Tezlikdan keyin real hayotdagi algebra va geometriya masalalariga o‘ting.";
}
