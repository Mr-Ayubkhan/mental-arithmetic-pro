// Design: Paper Sprint — editorial learning studio with ink navy, cream paper, Sprint Tangerine, and tactile asymmetric cards.
import { useMemo, useState } from "react";
import { BarChart3, Brain, Check, ChevronRight, Flame, Gauge, House, Play, RotateCcw, Settings2, Sparkles, Trophy, X } from "lucide-react";

const levels = [
  { label: "Boshlang‘ich", detail: "+ va − · 1 xonali", color: "bg-mint" },
  { label: "Tezlik", detail: "× va ÷ · 2 xonali", color: "bg-orange" },
  { label: "Pro", detail: "Aralash · 60 soniya", color: "bg-navy" },
];

type Question = { text: string; answer: number };

function makeQuestion(level: number): Question {
  const a = level === 0 ? Math.floor(Math.random() * 30) + 1 : Math.floor(Math.random() * 80) + 10;
  const b = level === 0 ? Math.floor(Math.random() * 20) + 1 : Math.floor(Math.random() * 40) + 5;
  if (level === 0) return { text: `${a} + ${b}`, answer: a + b };
  if (level === 1) return { text: `${a} − ${b}`, answer: a - b };
  return { text: `${Math.floor(a / 5)} × ${Math.floor(b / 5)}`, answer: Math.floor(a / 5) * Math.floor(b / 5) };
}

export default function Home() {
  const [active, setActive] = useState("Bugun");
  const [level, setLevel] = useState(0);
  const [question, setQuestion] = useState<Question>(() => makeQuestion(0));
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(1280);
  const [solved, setSolved] = useState(8);
  const [streak, setStreak] = useState(6);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const accuracy = useMemo(() => Math.min(98, Math.round((solved / Math.max(1, solved + 1)) * 100)), [solved]);

  function nextQuestion() {
    setAnswer("");
    setFeedback(null);
    setQuestion(makeQuestion(level));
  }

  function submit() {
    if (!answer.trim()) return;
    const correct = Number(answer) === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) { setScore((s) => s + 40); setSolved((s) => s + 1); setStreak((s) => s + 1); }
    else setStreak(0);
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-ink/10 bg-cream/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3"><div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-orange shadow-[3px_3px_0_#10233d]"><span className="absolute h-5 w-5 rounded-full border-2 border-ink/70" /><Brain size={18} strokeWidth={2.5} /></div><div><div className="font-display text-[19px] font-black leading-none tracking-tight">MENTAL<span className="text-orange">.</span></div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/50">Arithmetic Pro · studio</div></div></div>
          <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white/60 p-1 md:flex">{["Bugun", "Mashqlar", "Rekordlar"].map((item) => <button key={item} onClick={() => setActive(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${active === item ? "bg-ink text-cream shadow-sm" : "text-ink/60 hover:text-ink"}`}>{item}</button>)}</div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><div className="text-xs font-bold text-ink/45">Salom, Aziza</div><div className="text-sm font-bold">Bugun ham zo‘r!</div></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint font-display font-bold text-ink">A</div></div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1450px] grid-cols-1 gap-7 px-5 py-8 lg:grid-cols-[210px_minmax(0,1fr)_285px] lg:px-10 lg:py-12">
        <aside className="hidden lg:block"><div className="mb-7 text-[11px] font-bold uppercase tracking-[0.22em] text-ink/40">Studio</div><nav className="space-y-2">{[[House, "Bugun"], [Brain, "Mashq qilish"], [BarChart3, "Progress"]].map(([Icon, label]) => <button key={label as string} onClick={() => setActive(label as string)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${active === label ? "bg-white shadow-sm" : "text-ink/50 hover:bg-white/60 hover:text-ink"}`}><Icon size={18} />{label as string}{label === "Progress" && <ChevronRight className="ml-auto" size={15} />}</button>)}</nav><div className="mt-16 rounded-2xl bg-ink p-4 text-cream"><Sparkles className="mb-6 text-orange" size={20} /><p className="font-display text-xl leading-tight">Har kuni 10 daqiqa. Katta farq.</p><p className="mt-3 text-xs leading-5 text-cream/60">Muntazam mashq tezlikni emas, fikrlash aniqligini ham oshiradi.</p></div></aside>

        <section className="min-w-0"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-orange"><span className="h-2 w-2 rounded-full bg-orange" /> 03 sentyabr, chorshanba</div><h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">Bugun miyangni<br /><span className="text-orange">tezlashtir.</span></h1></div><div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3"><Flame className="text-orange" size={20} fill="currentColor" /><div><div className="font-display text-2xl font-bold leading-none">{streak}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/45">kunlik streak</div></div></div></div>

          <div className="relative overflow-hidden rounded-[28px] bg-ink p-5 text-cream shadow-[7px_7px_0_#f47b4a] sm:p-8"><div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[34px] border-mint/20" /><div className="absolute right-8 top-8 flex items-center gap-2 text-xs font-bold text-cream/60"><Gauge size={16} className="text-mint" /> O‘rtacha: 3.2s</div><div className="relative"><div className="mb-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mint"><span className="rounded-full bg-mint/15 px-3 py-1.5">Mashq #09</span><span className="text-cream/35">/ 15</span></div><div className="mb-10 font-display text-6xl font-bold tracking-tight sm:text-8xl">{question.text} <span className="text-orange">=</span> <span className="text-cream/25">?</span></div>{feedback && <div className={`mb-5 flex items-center gap-2 text-sm font-bold ${feedback === "correct" ? "text-mint" : "text-orange"}`}>{feedback === "correct" ? <Check size={18} /> : <X size={18} />} {feedback === "correct" ? "To‘g‘ri! Zo‘r tezlik." : `Javob ${question.answer} edi. Keyingisiga o‘tamiz.`}</div>}<div className="flex flex-col gap-3 sm:flex-row"><input autoFocus value={answer} onChange={(e) => setAnswer(e.target.value.replace(/[^0-9-]/g, ""))} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Javobni yozing..." className="h-14 min-w-0 flex-1 rounded-2xl border border-cream/10 bg-white/10 px-5 font-display text-2xl text-cream outline-none placeholder:text-cream/25 focus:border-mint" /><button onClick={feedback ? nextQuestion : submit} className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange px-6 font-bold text-ink transition hover:brightness-105 active:scale-[.98]">{feedback ? "Keyingi misol" : "Tekshirish"}<ChevronRight size={18} /></button></div></div></div>

          <div className="mt-10"><div className="mb-4 flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40">Mashq rejimi</div><h2 className="mt-1 font-display text-2xl font-bold">O‘zingga mosini tanla</h2></div><Settings2 className="text-ink/35" size={20} /></div><div className="grid gap-3 sm:grid-cols-3">{levels.map((item, index) => <button key={item.label} onClick={() => { setLevel(index); setQuestion(makeQuestion(index)); setFeedback(null); setAnswer(""); }} className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${level === index ? "border-ink bg-white shadow-[3px_3px_0_#10233d]" : "border-ink/10 bg-white/45 hover:bg-white"}`}><div className={`mb-8 h-2 w-12 rounded-full ${item.color}`} /><div className="font-bold">{item.label}</div><div className="mt-1 text-xs text-ink/50">{item.detail}</div><ChevronRight className="absolute bottom-4 right-4 text-ink/25 transition group-hover:translate-x-1" size={17} /></button>)}</div></div></section>

        <aside className="space-y-4"><div className="rounded-3xl border border-ink/10 bg-white/65 p-5"><div className="mb-6 flex items-center justify-between"><div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">Bugungi natija</div><BarChart3 size={18} className="text-orange" /></div><div className="mb-6 flex items-end gap-2"><span className="font-display text-5xl font-bold">{score.toLocaleString()}</span><span className="mb-2 text-xs font-bold text-orange">+240</span></div><div className="flex items-center gap-1.5">{Array.from({ length: 10 }).map((_, i) => <span key={i} className={`h-3 w-3 rounded-full border border-orange ${i < 7 ? "bg-orange" : "bg-transparent"}`} />)}</div><div className="mt-2 flex justify-between text-[11px] font-bold text-ink/40"><span>Kunlik maqsad</span><span>72%</span></div></div><div className="rounded-3xl bg-orange p-5 text-ink"><div className="mb-7 flex items-center justify-between"><div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/55">Shaxsiy rekord</div><Trophy size={20} /></div><div className="font-display text-4xl font-bold">1,840</div><p className="mt-2 text-xs font-bold text-ink/60">Yana 560 ochko qoldi</p><div className="mt-5 flex items-center gap-1.5">{Array.from({ length: 10 }).map((_, i) => <span key={i} className={`h-3 w-3 rounded-full border-2 border-ink/70 ${i < 7 ? "bg-ink" : "bg-transparent"}`} />)}</div></div><div className="rounded-3xl border border-ink/10 bg-white/65 p-5"><div className="mb-4 flex items-center gap-2"><div className="flex -space-x-1"><span className="h-3 w-3 rounded-full bg-mint border-2 border-white" /><span className="h-3 w-3 rounded-full bg-orange border-2 border-white" /><span className="h-3 w-3 rounded-full bg-ink border-2 border-white" /></div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">Haftalik ritm</div></div><div className="flex h-20 items-end gap-2">{[42, 58, 48, 76, 62, 88, 70].map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full rounded-t-md ${i === 5 ? "bg-orange" : "bg-mint"}`} style={{ height: `${height}%` }} /><span className="text-[9px] font-bold text-ink/35">{["D", "S", "C", "P", "J", "S", "Y"][i]}</span></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4"><span className="text-xs font-bold text-ink/50">Aniqlik · yaxshi ketmoqda</span><span className="font-display text-lg font-bold">{accuracy}%</span></div></div><button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ink/15 bg-transparent py-3 text-sm font-bold text-ink/60 transition hover:bg-white"><Play size={16} fill="currentColor" /> Tezkor testni boshlash</button></aside>
      </main>
    </div>
  );
}
