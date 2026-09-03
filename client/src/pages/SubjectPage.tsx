import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Circle, Compass, FunctionSquare, Lightbulb, LockKeyhole, Sparkles, Triangle, X } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getAgeBand, getAgeRecommendation } from "@/lib/learning";

export type Subject = "algebra" | "geometriya" | "trig";
export type Exercise = {
  id: string;
  prompt: string;
  answer: number;
  hint: string;
  explanation: string[];
  unit?: string;
};

const algebraTopics = ["Ifodalarni soddalashtirish", "Tenglamalar", "Funksiyalar", "Tengsizliklar"];
const geometryTopics = ["Perimetr va yuza", "Burchaklar", "Pifagor teoremasi", "Aylana va doira"];
const trigTopics = ["Sinus", "Kosinus", "Tangens", "Kotangens"];

function getSubjectFormula(subject: Subject, topic: number) {
  if (subject === "geometriya") return ["P = 2(a + b)", "∑burchak = 180°", "a² + b² = c²", "S = πr²"][topic];
  if (subject === "trig") return ["sin θ = qarshi / gipotenuza", "cos θ = yondosh / gipotenuza", "tan θ = qarshi / yondosh", "cot θ = yondosh / qarshi"][topic];
  return ["Bir xil hadlarni birlashtirish", "ax + b = c", "f(x) = ax + b", "Noma’lumni ajratish"][topic];
}

function isAdult(age: number) {
  return age >= 18;
}

export function makeExercise(subject: Subject, topic: number, age: number, seed = 0): Exercise {
  const adult = isAdult(age);
  if (subject === "trig") {
    if (topic === 0) {
      const variant = seed % 3;
      const answer = variant === 0 ? 0.5 : variant === 1 ? 1 : 0;
      const prompt = variant === 0 ? (adult ? "sin 30° = ?" : "Qarshi katet 3, gipotenuza 6. sin θ = ?") : variant === 1 ? "sin 90° = ?" : "sin 0° = ?";
      return { id: `trig-sin-${seed}`, prompt, answer, hint: "sin θ = qarshi katet / gipotenuza.", explanation: ["Sinus qarshi katetning gipotenuzaga nisbatidir.", variant === 0 ? "3 ÷ 6 = 0.5." : `Maxsus burchak qiymati: sin ${variant === 1 ? "90° = 1" : "0° = 0"}.`] };
    }
    if (topic === 1) {
      const variant = seed % 3;
      const answer = variant === 0 ? 0.5 : variant === 1 ? 1 : 0;
      const prompt = variant === 0 ? (adult ? "cos 60° = ?" : "Yondosh katet 4, gipotenuza 8. cos θ = ?") : variant === 1 ? "cos 0° = ?" : "cos 90° = ?";
      return { id: `trig-cos-${seed}`, prompt, answer, hint: "cos θ = yondosh katet / gipotenuza.", explanation: ["Kosinus yondosh katetning gipotenuzaga nisbatidir.", variant === 0 ? "4 ÷ 8 = 0.5." : `Maxsus burchak qiymati: cos ${variant === 1 ? "0° = 1" : "90° = 0"}.`] };
    }
    if (topic === 2) {
      const answer = seed % 2 === 0 ? 1 : 0;
      return { id: `trig-tan-${seed}`, prompt: seed % 2 === 0 ? (adult ? "tan 45° = ?" : "Qarshi va yondosh katetlar 5 ga teng. tan θ = ?") : "tan 0° = ?", answer, hint: "tan θ = qarshi katet / yondosh katet.", explanation: ["Tangens qarshi katetning yondosh katetga nisbatidir.", answer === 1 ? "5 ÷ 5 = 1." : "0° burchakda qarshi katet 0 bo‘ladi, shuning uchun tan 0° = 0."] };
    }
    const answer = seed % 2 === 0 ? 1 : 0;
    return { id: `trig-cot-${seed}`, prompt: seed % 2 === 0 ? (adult ? "cot 45° = ?" : "Qarshi va yondosh katetlar teng. cot θ = ?") : "cot 90° = ?", answer, hint: "cot θ = yondosh katet / qarshi katet.", explanation: ["Kotangens yondosh katetning qarshi katetga nisbatidir.", answer === 1 ? "5 ÷ 5 = 1." : "cot 90° = 0."] };
  }

  if (subject === "geometriya") {
    if (topic === 1) {
      const first = adult ? 40 + (seed % 4) * 4 : 50 + (seed % 4) * 3;
      const second = adult ? 60 + (seed % 3) * 3 : 60 + (seed % 3) * 2;
      const answer = 180 - first - second;
      return { id: `geo-angle-${seed}`, prompt: `Uchburchak burchaklari: ${first}° + ${second}° + x = 180°. x = ?`, answer, unit: "°", hint: "Uchburchak ichki burchaklari yig‘indisi 180°.", explanation: ["Ma’lum burchaklarni qo‘shing.", `x = 180° − (${first}° + ${second}°) = ${answer}°.`] };
    }
    if (topic === 2) {
      const pair = seed % 2 === 0 ? (adult ? [9, 12, 15] : [6, 8, 10]) : (adult ? [8, 15, 17] : [5, 12, 13]);
      return { id: `geo-pythagoras-${seed}`, prompt: `Katetlar ${pair[0]} va ${pair[1]}. Gipotenuza = ?`, answer: pair[2], hint: "a² + b² = c² formulasidan foydalan.", explanation: [`c² = ${pair[0]}² + ${pair[1]}² = ${pair[0] * pair[0] + pair[1] * pair[1]}.`, `√${pair[0] * pair[0] + pair[1] * pair[1]} = ${pair[2]}.`] };
    }
    if (topic === 3) {
      const radius = adult ? (seed % 2 === 0 ? 7 : 14) : (seed % 2 === 0 ? 3 : 4);
      const pi = adult ? "22/7" : "3";
      const answer = adult ? (radius === 7 ? 154 : 616) : radius === 3 ? 27 : 48;
      return { id: `geo-circle-${seed}`, prompt: `Radiusi ${radius} bo‘lgan aylananing yuzi (π = ${pi}) = ?`, answer, hint: "Aylana yuzi: S = πr².", explanation: [`Formula: S = π × r².`, `S = ${pi} × ${radius}² = ${answer}.`] };
    }
    const a = adult ? 10 + (seed % 4) * 2 : 4 + (seed % 4);
    const b = adult ? 6 + (seed % 3) * 2 : 3 + (seed % 3);
    return { id: `geo-perimeter-${seed}`, prompt: `Tomonlari ${a} va ${b} bo‘lgan to‘g‘ri to‘rtburchak perimetri P = ?`, answer: 2 * (a + b), hint: "Perimetr P = 2(a+b). Yuza esa S = a × b.", explanation: ["To‘g‘ri to‘rtburchak perimetri barcha tomonlar yig‘indisidir.", `P = 2 × (${a} + ${b}) = ${2 * (a + b)}.`] };
  }

  if (topic === 0) {
    const coefficient = adult ? 3 + (seed % 3) : 2 + (seed % 3);
    const answer = adult ? 6 + (seed % 3) : 5 + (seed % 3);
    const total = coefficient * answer;
    return { id: `alg-simplify-${seed}`, prompt: `${coefficient}x + ${coefficient + 4}x − 4x = ${total}. x = ?`, answer, hint: "Bir xil hadlarni birlashtir.", explanation: [`x hadlari yig‘indisi: ${coefficient} + ${coefficient + 4} − 4 = ${coefficient + 0}.`, `x = ${total} ÷ ${coefficient} = ${answer}.`] };
  }
  if (topic === 1) {
    const answer = adult ? 9 + (seed % 3) : 5 + (seed % 3);
    const constant = adult ? 9 : 6;
    const multiplier = adult ? 4 : 3;
    return { id: `alg-equation-${seed}`, prompt: `${multiplier}x − ${constant} = ${multiplier * answer - constant}. x = ?`, answer, hint: "Avval doimiy sonni ajrat, keyin koeffitsientga bo‘l.", explanation: [`${multiplier}x = ${multiplier * answer - constant} + ${constant} = ${multiplier * answer}.`, `x = ${multiplier * answer} ÷ ${multiplier} = ${answer}.`] };
  }
  if (topic === 2) {
    const x = adult ? 8 + (seed % 3) : 4 + (seed % 3);
    const multiplier = adult ? 2 : 3;
    const constant = adult ? 5 : 1;
    return { id: `alg-function-${seed}`, prompt: `f(x)=${multiplier}x+${constant}. f(${x}) = ?`, answer: multiplier * x + constant, hint: "x o‘rniga berilgan sonni qo‘y.", explanation: [`f(${x}) = ${multiplier} × ${x} + ${constant}.`, `Natija = ${multiplier * x + constant}.`] };
  }
  const answer = adult ? 7 + (seed % 2) : 6 + (seed % 2);
  const constant = adult ? 5 : 4;
  const rhs = adult ? 17 : 10;
  return { id: `alg-inequality-${seed}`, prompt: `${adult ? "2x + 5 > 17" : "x + 4 ≥ 10"}. Eng kichik butun x = ?`, answer, hint: "Noma’lumni yolg‘iz qoldir va tengsizlik yo‘nalishini kuzat.", explanation: [`${adult ? "2x > 12" : "x ≥ 6"} holatiga keltiramiz.`, `Eng kichik mos butun son: ${answer}.`], unit: "" };
}

export function getUniqueExercise(subject: Subject, topic: number, age: number, usedIds: string[]): Exercise {
  for (let seed = 0; seed < 1000; seed += 1) {
    const candidate = makeExercise(subject, topic, age, seed);
    if (!usedIds.includes(candidate.id)) return candidate;
  }
  return makeExercise(subject, topic, age, Date.now());
}

function getInitialAge(userAge?: number) {
  if (userAge && userAge >= 6 && userAge <= 100) return userAge;
  if (typeof window !== "undefined") {
    const stored = Number(window.localStorage.getItem("mental-age"));
    if (stored >= 6 && stored <= 100) return stored;
  }
  return 16;
}

export default function SubjectPage({ subject }: { subject: Subject }) {
  const geometry = subject === "geometriya";
  const trigonometry = subject === "trig";
  const { user } = useAuth();
  const age = useMemo(() => getInitialAge(user?.age ?? undefined), [user?.age]);
  const topics = geometry ? geometryTopics : trigonometry ? trigTopics : algebraTopics;
  const initialExercise = useMemo(() => makeExercise(subject, 0, age, 0), [subject, age]);
  const [topic, setTopic] = useState(0);
  const [exercise, setExercise] = useState<Exercise>(initialExercise);
  const [usedIds, setUsedIds] = useState<string[]>([initialExercise.id]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [solved, setSolved] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState<Exercise[]>([]);
  const [xp, setXp] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const accuracy = attempts ? Math.round((solved / attempts) * 100) : 0;
  const trigUnlocked = solved >= 3 || age >= 18;

  useEffect(() => {
    setTopic(0);
    setExercise(initialExercise);
    setUsedIds([initialExercise.id]);
    setAnswer("");
    setFeedback(null);
    setSessionComplete(false);
  }, [initialExercise]);

  function selectTopic(nextTopic: number) {
    const next = getUniqueExercise(subject, nextTopic, age, usedIds);
    setTopic(nextTopic);
    setExercise(next);
    setUsedIds((ids) => [...ids, next.id]);
    setAnswer("");
    setFeedback(null);
    setSessionComplete(false);
  }

  function check() {
    if (!answer.trim() || feedback) return;
    const correct = Math.abs(Number(answer) - exercise.answer) < 0.0001;
    setAttempts((value) => value + 1);
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setSolved((value) => value + 1);
      setXp((value) => value + 25);
    } else {
      setMistakes((items) => [exercise, ...items].slice(0, 5));
    }
  }

  function next() {
    if (usedIds.length >= 12) {
      setSessionComplete(true);
      setFeedback(null);
      return;
    }
    selectTopic((topic + 1) % topics.length);
  }

  function startNewSession() {
    const fresh = makeExercise(subject, 0, age, usedIds.length + 13);
    setTopic(0);
    setExercise(fresh);
    setUsedIds([fresh.id]);
    setAnswer("");
    setFeedback(null);
    setMistakes([]);
    setSessionComplete(false);
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-ink/10 bg-cream/90 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold text-ink/65 transition hover:text-ink"><ArrowLeft size={18} /> Bosh sahifaga</Link>
          <div className="flex items-center gap-2 font-display text-lg font-bold"><span className="h-3 w-3 rounded-full bg-orange" /> MENTAL<span className="text-orange">.</span></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-10 lg:py-14">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-orange"><Sparkles size={15} /> Mastery path · {getAgeBand(age)}</div>
            <h1 className="max-w-full break-words font-display text-4xl font-black leading-none sm:text-7xl">{geometry ? "Geometriya" : trigonometry ? "Trigonometriya" : "Algebra"}<span className="text-orange">.</span></h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-ink/60">{geometry ? "Shakllar, burchaklar va fazoni ko‘z oldingda aniq ko‘rishni mashq qil." : trigonometry ? "Sinus, kosinus, tangens va kotangensni amaliy masalalarda ishonchli qo‘llashni o‘rgan." : "Formulalarni yodlash emas, ularni tez va ishonchli qo‘llashni o‘rgan."}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white/70 px-5 py-4 text-right"><div className="text-[10px] font-bold uppercase tracking-[.2em] text-ink/40">Progress</div><div className="mt-1 font-display text-3xl font-bold">{xp} <span className="text-sm text-orange">XP</span></div><div className="text-xs text-ink/45">{solved} ta to‘g‘ri · {accuracy}% aniqlik</div></div>
        </div>
        <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
          <section className="relative overflow-hidden rounded-[30px] bg-ink p-7 text-cream shadow-[8px_8px_0_#f47b4a] sm:p-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[38px] border-mint/15" />
            <div className="relative">
              <div className="mb-10 flex items-center justify-between"><span className="rounded-full bg-mint/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-mint">{geometry ? "Geo lab" : trigonometry ? "Trig lab" : "Algebra lab"} · savol {usedIds.length}</span>{geometry ? <Compass className="text-mint" size={25} /> : trigonometry ? <Triangle className="text-mint" size={25} /> : <FunctionSquare className="text-mint" size={25} />}</div>
              <div className="mb-8"><div className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-cream/45">{age >= 18 ? "Adult challenge" : "Senga mos misol"}</div><h2 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{exercise.prompt}</h2></div>
              {sessionComplete ? <div className="rounded-3xl border border-mint/25 bg-mint/10 p-6 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink"><Check size={24} /></div><h3 className="mt-5 font-display text-3xl font-bold">Session yakunlandi.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-cream/65">Bu sessiondagi savollar tugadi. Yangi session boshlang yoki shu mavzuni qayta mashq qiling.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={startNewSession} className="rounded-2xl bg-orange px-5 py-3 font-bold text-ink transition hover:brightness-105">Yangi session</button><button onClick={startNewSession} className="rounded-2xl border border-cream/20 px-5 py-3 font-bold text-cream transition hover:bg-white/10">Mavzuni yangilash</button></div></div> : <><div className="mb-4 rounded-2xl border border-cream/10 bg-white/10 px-4 py-3 text-sm text-cream/70"><span className="font-bold text-mint">Formula:</span> {getSubjectFormula(subject, topic)}</div>{feedback && <div className={`mb-6 rounded-2xl border p-5 ${feedback === "correct" ? "border-mint/30 bg-mint/10 text-mint" : "border-orange/35 bg-orange/10 text-cream"}`}><div className="flex items-center gap-2 text-sm font-bold">{feedback === "correct" ? <Check size={18} /> : <X size={18} />} {feedback === "correct" ? "To‘g‘ri! Keyingi savolga tayyormiz." : "Bu safar xato. Birga tahlil qilamiz."}</div>{feedback === "wrong" && <div className="mt-4 space-y-3 text-sm text-cream/75"><div><span className="font-bold text-orange">To‘g‘ri javob:</span> {exercise.answer}{exercise.unit || ""}</div>{exercise.explanation.map((step) => <div key={step} className="flex gap-2"><span className="mt-1 text-mint">•</span><span>{step}</span></div>)}</div>}</div>}<div className="flex flex-col gap-3 sm:flex-row"><input aria-label="Mavzu javobi" inputMode="decimal" autoFocus value={answer} onChange={(event) => setAnswer(event.target.value.replace(/[^0-9.-]/g, ""))} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); feedback ? next() : check(); } }} placeholder="Javobni yozing..." className="h-14 min-w-0 flex-1 rounded-2xl border border-cream/15 bg-white/10 px-5 font-display text-2xl text-cream outline-none placeholder:text-cream/25 focus:border-mint" /><button onClick={feedback ? next : check} className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange px-6 font-bold text-ink transition hover:brightness-105">{feedback ? "Keyingi savol" : "Tekshirish"}<ChevronRight size={18} /></button></div><div className="mt-8 flex items-start gap-3 rounded-2xl border border-cream/10 bg-white/10 p-4 text-sm text-cream/65"><Lightbulb className="mt-0.5 shrink-0 text-mint" size={18} /><span><strong className="text-cream">Ishora:</strong> {exercise.hint}</span></div></>}
            </div>
          </section>
          <aside className="space-y-4">
            <div className="rounded-3xl border border-ink/10 bg-white/70 p-6"><div className="mb-6 flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[.2em] text-ink/40">Mavzular</div><div className="mt-1 font-display text-2xl font-bold">Bugungi yo‘l</div></div><div className="font-display text-2xl font-bold">{Math.min(solved, topics.length)}<span className="text-ink/25">/{topics.length}</span></div></div><div className="mb-5 rounded-2xl bg-mint/60 p-4"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-ink/55">Tavsiya</div><div className="mt-1 text-sm font-bold">{getAgeRecommendation(age, subject)}</div></div><div className="space-y-3">{topics.map((item, index) => <button key={item} onClick={() => selectTopic(index)} className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${topic === index ? "border-ink bg-white shadow-sm" : "border-ink/10 bg-cream/60 hover:bg-white"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full ${index <= solved ? "bg-orange text-ink" : "bg-ink/5 text-ink/30"}`}>{index <= solved ? <Circle size={13} /> : <LockKeyhole size={14} />}</span><span className="flex-1 text-sm font-bold">{item}</span><ChevronRight size={15} className="text-ink/25 group-hover:text-orange" /></button>)}</div></div>
            <Link href="/geometriya-lugati" className="block rounded-3xl bg-mint p-6 text-ink transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#10233d]"><div className="mb-4 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[.18em] text-ink/55">Formula library</div><Compass size={20} /></div><div className="font-display text-3xl font-bold">Geometriya lug‘ati<span className="text-orange">.</span></div><p className="mt-2 text-sm font-bold text-ink/60">Atamalar, formulalar va sodda misollar</p><div className="mt-5 inline-flex rounded-xl bg-ink px-4 py-3 text-sm font-bold text-cream">Lug‘atni ochish <ChevronRight size={16} /></div></Link>
            <div className={`rounded-3xl p-6 ${trigUnlocked ? "bg-orange text-ink" : "bg-ink text-cream"}`}><div className="mb-5 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[.18em] opacity-65">Keyingi bosqich</div><Triangle size={20} /></div><div className="font-display text-3xl font-bold">Trigonometriya<span className="text-orange">.</span></div><p className="mt-2 text-sm font-bold opacity-65">Sinus · Kosinus · Tangens · Kotangens</p>{trigUnlocked ? <Link href="/trigonometriya" className="mt-5 inline-flex rounded-xl bg-ink px-4 py-3 text-sm font-bold text-cream">Katalog ochiq →</Link> : <div className="mt-5 flex items-center gap-2 text-xs font-bold opacity-60"><LockKeyhole size={15} /> {Math.max(0, 3 - solved)} ta to‘g‘ri javobdan keyin ochiladi</div>}</div>
            {mistakes.length > 0 && <div className="rounded-3xl border border-orange/20 bg-orange/10 p-6"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-orange"><X size={15} /> Xatolar daftari</div><p className="mt-2 text-sm font-bold">{mistakes.length} ta misolni keyin yana ko‘rib chiqing.</p><div className="mt-4 space-y-2">{mistakes.slice(0, 3).map((item) => <div key={item.id} className="rounded-xl bg-white/70 p-3 text-xs font-bold">{item.prompt} <span className="text-orange">→ {item.answer}{item.unit || ""}</span></div>)}</div></div>}
          </aside>
        </div>
      </main>
    </div>
  );
}
