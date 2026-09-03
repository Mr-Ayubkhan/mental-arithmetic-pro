import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Search, Sparkles, Triangle } from "lucide-react";
import { Link } from "wouter";

type GeometryTerm = {
  term: string;
  category: "Asosiy" | "Shakllar" | "O‘lchov" | "Teorema" | "Trigonometrik";
  definition: string;
  formula?: string;
  example: string;
};

const terms: GeometryTerm[] = [
  { term: "Nuqta", category: "Asosiy", definition: "Fazodagi joyni bildiradi; uning uzunligi, eni yoki balandligi bo‘lmaydi.", example: "A nuqta — shaklning boshlanish yoki belgilash joyi." },
  { term: "Kesma", category: "Asosiy", definition: "Ikki nuqtani tutashtirgan to‘g‘ri chiziqning chegaralangan qismi.", formula: "AB = masofa", example: "AB kesma uzunligi 7 sm bo‘lishi mumkin." },
  { term: "Burchak", category: "Asosiy", definition: "Bir nuqtadan chiqqan ikki nur orasidagi ochilish.", formula: "To‘g‘ri burchak = 90°", example: "Uchburchak ichki burchaklari yig‘indisi 180°." },
  { term: "Perimetr", category: "O‘lchov", definition: "Yopiq shaklning barcha tomonlari uzunliklari yig‘indisi.", formula: "To‘g‘ri to‘rtburchak: P = 2(a + b)", example: "a = 7, b = 4 bo‘lsa, P = 22." },
  { term: "Yuza", category: "O‘lchov", definition: "Shakl egallagan tekislik maydoni.", formula: "To‘g‘ri to‘rtburchak: S = a × b", example: "7 × 4 = 28 kvadrat birlik." },
  { term: "Radius", category: "Shakllar", definition: "Aylana markazidan uning istalgan nuqtasigacha bo‘lgan kesma.", formula: "d = 2r", example: "r = 5 sm bo‘lsa, diametr 10 sm." },
  { term: "Diametr", category: "Shakllar", definition: "Aylana markazidan o‘tib, ikki nuqtasini tutashtiruvchi kesma.", formula: "d = 2r", example: "Diametr har doim radiusdan ikki baravar katta." },
  { term: "Uchburchak", category: "Shakllar", definition: "Uchta tomon va uchta burchakdan tashkil topgan ko‘pburchak.", formula: "Burchaklar yig‘indisi = 180°", example: "45° + 55° + 80° = 180°." },
  { term: "Parallel chiziqlar", category: "Asosiy", definition: "Bir tekislikda kesishmaydigan va oraliq masofasi o‘zgarmaydigan chiziqlar.", example: "Daftar chiziqlari parallel chiziqlarga misol bo‘la oladi." },
  { term: "Pifagor teoremasi", category: "Teorema", definition: "To‘g‘ri burchakli uchburchakda gipotenuza kvadrati katetlar kvadratlari yig‘indisiga teng.", formula: "a² + b² = c²", example: "6² + 8² = 10², demak gipotenuza 10." },
  { term: "Sinus", category: "Trigonometrik", definition: "To‘g‘ri burchakli uchburchakda qarshi katetning gipotenuzaga nisbati.", formula: "sin θ = qarshi katet / gipotenuza", example: "3 / 6 = 0.5." },
  { term: "Kosinus", category: "Trigonometrik", definition: "Yondosh katetning gipotenuzaga nisbati.", formula: "cos θ = yondosh katet / gipotenuza", example: "4 / 8 = 0.5." },
  { term: "Tangens", category: "Trigonometrik", definition: "Qarshi katetning yondosh katetga nisbati.", formula: "tan θ = qarshi katet / yondosh katet", example: "5 / 5 = 1." },
  { term: "Kotangens", category: "Trigonometrik", definition: "Yondosh katetning qarshi katetga nisbati.", formula: "cot θ = yondosh katet / qarshi katet", example: "5 / 5 = 1." },
];

export const categories = ["Barchasi", "Asosiy", "Shakllar", "O‘lchov", "Teorema", "Trigonometrik"] as const;
export type GlossaryCategory = (typeof categories)[number];

export function filterGeometryTerms(query: string, category: GlossaryCategory) {
  return terms.filter((item) => {
    const matchesCategory = category === "Barchasi" || item.category === category;
    const haystack = `${item.term} ${item.definition} ${item.formula || ""}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase().trim());
  });
}

export default function GeometryGlossary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory>("Barchasi");
  const filtered = useMemo(() => filterGeometryTerms(query, category), [category, query]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-ink/10 bg-cream/90 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="flex items-center gap-3 text-sm font-bold text-ink/65 transition hover:text-ink"><ArrowLeft size={18} /> Bosh sahifaga</Link><div className="flex items-center gap-2 font-display text-lg font-bold"><span className="h-3 w-3 rounded-full bg-orange" /> MENTAL<span className="text-orange">.</span></div></div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-10 lg:py-14">
        <section className="relative overflow-hidden rounded-[32px] bg-ink p-7 text-cream shadow-[8px_8px_0_#f47b4a] sm:p-11"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[42px] border-mint/15" /><div className="relative max-w-3xl"><div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-mint"><BookOpen size={16} /> Formula library · 15 atama</div><h1 className="font-display text-5xl font-black leading-[.95] sm:text-7xl">Geometriya<br /><span className="text-orange">lug‘ati.</span></h1><p className="mt-6 max-w-2xl text-base leading-7 text-cream/65 sm:text-lg">Qiyin atamani ko‘rdingizmi? Shu yerda uning ma’nosi, formulasi va kichik misolini bir qarashda toping.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/geometriya" className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-bold text-ink transition hover:brightness-105">Mashqda sinash <Triangle size={16} /></Link><div className="inline-flex items-center gap-2 rounded-xl border border-cream/15 px-5 py-3 text-sm font-bold text-cream/75"><Sparkles size={16} className="text-mint" /> Bosqichma-bosqich o‘rgan</div></div></div></section>
        <section className="mt-10"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[.2em] text-orange">Bilim bazasi</div><h2 className="mt-1 font-display text-3xl font-bold">Nimani izlayapsiz?</h2></div><label className="relative block w-full lg:max-w-sm"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} /><input aria-label="Atama qidirish" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Masalan: radius" className="h-13 w-full rounded-2xl border border-ink/10 bg-white/75 pl-11 pr-4 text-sm font-bold outline-none transition focus:border-orange" /></label></div><div className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${category === item ? "bg-ink text-cream" : "border border-ink/10 bg-white/70 text-ink/55 hover:bg-white"}`}>{item}</button>)}</div><div className="mt-7 grid gap-4 md:grid-cols-2">{filtered.map((item, index) => <article key={item.term} className="group rounded-3xl border border-ink/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#b6e3d0]" style={{ animationDelay: `${index * 35}ms` }}><div className="flex items-start justify-between gap-4"><div><div className="mb-3 inline-flex rounded-full bg-mint px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-ink/65">{item.category}</div><h3 className="font-display text-3xl font-bold">{item.term}<span className="text-orange">.</span></h3></div><CheckCircle2 className="mt-1 text-mint transition group-hover:text-orange" size={21} /></div><p className="mt-4 text-sm leading-6 text-ink/65">{item.definition}</p>{item.formula && <div className="mt-4 rounded-2xl bg-ink px-4 py-3 font-display text-base font-bold text-cream">{item.formula}</div>}<div className="mt-4 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/55"><strong className="text-ink">Misol:</strong> {item.example}</div></article>)}</div>{filtered.length === 0 && <div className="rounded-3xl border border-dashed border-ink/20 bg-white/50 p-12 text-center"><div className="font-display text-2xl font-bold">Atama topilmadi.</div><p className="mt-2 text-sm text-ink/55">Boshqa kalit so‘z bilan qidirib ko‘ring.</p></div>}</section>
      </main>
    </div>
  );
}
