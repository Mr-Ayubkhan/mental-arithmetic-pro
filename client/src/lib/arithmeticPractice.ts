export type ArithmeticQuestion = {
  id: string;
  text: string;
  answer: number;
  hint: string;
  explanation: string[];
  formula: string;
};

export function makeQuestion(level: number, age = 16, seed = 0): ArithmeticQuestion {
  const junior = age < 13;
  const adult = age >= 18;
  const n = Math.abs(seed * 37 + level * 101 + Math.round(age) * 13) % 997;
  const a = level === 0 ? (n % (junior ? 15 : adult ? 90 : 30)) + 1 : (n % (level > 2 ? (adult ? 1200 : 900) : 80)) + 10;
  const b = level === 0 ? ((n * 7) % (junior ? 10 : adult ? 60 : 20)) + 1 : ((n * 11) % (level > 2 ? (adult ? 180 : 100) : 40)) + 5;

  if (level === 0) return { id: `starter-${a}-${b}`, text: `${a} + ${b}`, answer: a + b, formula: "a + b", hint: "Birliklar va o‘nliklarni alohida qo‘shing.", explanation: [`${a} + ${b} ni qismlarga ajrating.`, `Javob: ${a + b}.`] };
  if (level === 1) {
    const top = Math.max(a, b);
    const bottom = Math.min(a, b);
    return { id: `speed-${top}-${bottom}`, text: `${top} − ${bottom}`, answer: top - bottom, formula: "a − b", hint: "Katta sondan kichik sonni ayiring.", explanation: [`${top} − ${bottom} ni hisoblang.`, `Javob: ${top - bottom}.`] };
  }
  if (level === 2) {
    const left = Math.floor(a / 5);
    const right = Math.floor(b / 5);
    return { id: `pro-${left}-${right}`, text: `${left} × ${right}`, answer: left * right, formula: "a × b", hint: "Ko‘paytirishni qulay qismlarga ajrating.", explanation: [`${left} × ${right} ni hisoblang.`, `Javob: ${left * right}.`] };
  }
  if (level === 3) {
    const percent = [10, 20, 25, 50][n % 4];
    const whole = [40, 60, 80, 120][(n + (adult ? 1 : 0)) % 4];
    return { id: `hard-${percent}-${whole}`, text: `${percent}% of ${whole}`, answer: (percent * whole) / 100, formula: "foiz × butun son ÷ 100", hint: `${percent}% = ${percent / 100}.`, explanation: [`${whole} × ${percent / 100} ni hisoblang.`, `Javob: ${(percent * whole) / 100}.`] };
  }
  const left = Math.floor(a / 10);
  const right = Math.floor(b / 10);
  return { id: `impossible-${left}-${right}`, text: `${left}² + ${right}²`, answer: left ** 2 + right ** 2, formula: "a² + b²", hint: "Har bir kvadratni topib, keyin qo‘shing.", explanation: [`${left}² = ${left ** 2}, ${right}² = ${right ** 2}.`, `Javob: ${left ** 2 + right ** 2}.`] };
}

export function getErrorAnalysis(question: ArithmeticQuestion) {
  return [`Formula: ${question.formula}`, ...question.explanation];
}

export function getNextUniqueQuestion(level: number, age: number, seed: number, usedIds: string[]) {
  let nextSeed = seed;
  for (let attempts = 0; attempts < 2000; attempts += 1) {
    const candidate = makeQuestion(level, age, nextSeed);
    if (!usedIds.includes(candidate.id)) return { question: candidate, seed: nextSeed };
    nextSeed += 1;
  }
  const fallback = makeQuestion(level, age, seed + usedIds.length + 2001);
  return { question: fallback, seed: seed + usedIds.length + 2001 };
}
