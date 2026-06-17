import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ComposedChart, CartesianGrid, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";

// ─── ALL DATA EMBEDDED (no CSV file needed) ───────────────────────────────

const LANG_NAMES = { en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese" };
const LANG_FLAGS = { en: "🇬🇧", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", pt: "🇧🇷" };

const COLORS = {
  en: "#199cc8", es: "#E2725B", fr: "#dda3ff", de: "#4090c2", it: "#80c206", pt: "#02fba8",
  accent: "#3eebf1", green: "#08f61c", orange: "#f86802", red: "#f91105", purple: "#f668e8"
};

const langData = [
  { language: "en", sessions: 5014791, users: 43805, lexemes: 2983, avg_accuracy: 86.9 },
  { language: "es", sessions: 3407689, users: 31155, lexemes: 3302, avg_accuracy: 89.7 },
  { language: "fr", sessions: 1873734, users: 19947, lexemes: 4184, avg_accuracy: 89.1 },
  { language: "de", sessions: 1452597, users: 14383, lexemes: 3809, avg_accuracy: 90.4 },
  { language: "it", sessions: 793935, users: 6498, lexemes: 2186, avg_accuracy: 90.5 },
  { language: "pt", sessions: 311480, users: 2709, lexemes: 2815, avg_accuracy: 91.1 }
];

const pairData = [
  { pair: "es → en", sessions: 3641179, users: 31735, avg_accuracy: 86.2 },
  { pair: "en → es", sessions: 3407689, users: 31155, avg_accuracy: 89.7 },
  { pair: "en → fr", sessions: 1873734, users: 19947, avg_accuracy: 89.1 },
  { pair: "en → de", sessions: 1452597, users: 14383, avg_accuracy: 90.4 },
  { pair: "pt → en", sessions: 949460, users: 8637, avg_accuracy: 91.2 },
  { pair: "en → it", sessions: 793935, users: 6498, avg_accuracy: 90.5 },
  { pair: "it → en", sessions: 424152, users: 3436, avg_accuracy: 89.8 },
  { pair: "en → pt", sessions: 311480, users: 2709, avg_accuracy: 91.1 }
];

const grammarData = [
  { part: "Noun", count: 5509632, perfection_rate: 85.4 },
  { part: "Verb", count: 2895366, perfection_rate: 83.3 },
  { part: "Determiner", count: 1398807, perfection_rate: 80.4 },
  { part: "Pronoun", count: 1047259, perfection_rate: 81.8 },
  { part: "Adjective", count: 711633, perfection_rate: 86.2 },
  { part: "Adverb", count: 512452, perfection_rate: 83.1 },
  { part: "Preposition", count: 348097, perfection_rate: 81.7 },
  { part: "Conjunction", count: 156310, perfection_rate: 77.5 },
  { part: "Interjection", count: 130300, perfection_rate: 91.0 },
  { part: "Numeral", count: 35643, perfection_rate: 86.2 }
];

const hourData = [
  { hour: 0, sessions: 648474 }, { hour: 1, sessions: 645126 }, { hour: 2, sessions: 648778 },
  { hour: 3, sessions: 593897 }, { hour: 4, sessions: 491686 }, { hour: 5, sessions: 372407 },
  { hour: 6, sessions: 271508 }, { hour: 7, sessions: 248170 }, { hour: 8, sessions: 239078 },
  { hour: 9, sessions: 263644 }, { hour: 10, sessions: 309416 }, { hour: 11, sessions: 345404 },
  { hour: 12, sessions: 398588 }, { hour: 13, sessions: 472098 }, { hour: 14, sessions: 540899 },
  { hour: 15, sessions: 618964 }, { hour: 16, sessions: 643573 }, { hour: 17, sessions: 659675 },
  { hour: 18, sessions: 695279 }, { hour: 19, sessions: 699876 }, { hour: 20, sessions: 773710 },
  { hour: 21, sessions: 811004 }, { hour: 22, sessions: 767021 }, { hour: 23, sessions: 695951 }
].map(d => ({
  ...d,
  label: `${d.hour}:00`,
  period: d.hour < 6 ? "Dawn" : d.hour < 12 ? "Morning" : d.hour < 18 ? "Afternoon" : "Night"
}));

const weekdayData = [
  { day: "Mon", full: "Monday", count: 2189938, isWeekend: false },
  { day: "Tue", full: "Tuesday", count: 1792356, isWeekend: false },
  { day: "Wed", full: "Wednesday", count: 1185491, isWeekend: false },
  { day: "Thu", full: "Thursday", count: 1437741, isWeekend: false },
  { day: "Fri", full: "Friday", count: 2171264, isWeekend: false },
  { day: "Sat", full: "Saturday", count: 1970509, isWeekend: true },
  { day: "Sun", full: "Sunday", count: 2106927, isWeekend: true }
];

const dailyData = [
  { date: "02/28", users: 6414 }, { date: "03/01", users: 21738 }, { date: "03/02", users: 19444 },
  { date: "03/03", users: 19946 }, { date: "03/04", users: 21951 }, { date: "03/05", users: 23290 },
  { date: "03/06", users: 24040 }, { date: "03/07", users: 23798 }, { date: "03/08", users: 22110 },
  { date: "03/09", users: 19414 }, { date: "03/10", users: 20236 }, { date: "03/11", users: 22671 },
  { date: "03/12", users: 14950 }
];

const difficultyEN = [
  { language: "fr", perfection_rate: 81.6 }, { language: "de", perfection_rate: 84.1 },
  { language: "es", perfection_rate: 84.4 }, { language: "pt", perfection_rate: 85.9 },
  { language: "it", perfection_rate: 85.9 }
];

const langGrammar = {
  de: [
    { part: "Noun", count: 666453, perfection_rate: 85.6 }, { part: "Verb", count: 271169, perfection_rate: 84.5 },
    { part: "Determiner", count: 222041, perfection_rate: 80.0 }, { part: "Pronoun", count: 122442, perfection_rate: 82.2 },
    { part: "Adjective", count: 69582, perfection_rate: 85.7 }, { part: "Adverb", count: 39705, perfection_rate: 82.9 },
    { part: "Preposition", count: 29386, perfection_rate: 78.9 }, { part: "Interjection", count: 12344, perfection_rate: 93.3 },
    { part: "Numeral", count: 9484, perfection_rate: 89.1 }, { part: "Conjunction", count: 2749, perfection_rate: 77.5 }
  ],
  en: [
    { part: "Noun", count: 2354832, perfection_rate: 85.8 }, { part: "Verb", count: 1078378, perfection_rate: 82.3 },
    { part: "Pronoun", count: 426871, perfection_rate: 83.4 }, { part: "Determiner", count: 411572, perfection_rate: 78.2 },
    { part: "Adverb", count: 225367, perfection_rate: 83.2 }, { part: "Adjective", count: 190014, perfection_rate: 85.7 },
    { part: "Preposition", count: 148829, perfection_rate: 82.1 }, { part: "Conjunction", count: 78030, perfection_rate: 78.5 },
    { part: "Interjection", count: 47352, perfection_rate: 94.0 }, { part: "Numeral", count: 12943, perfection_rate: 85.4 }
  ],
  es: [
    { part: "Noun", count: 1448001, perfection_rate: 85.3 }, { part: "Verb", count: 918608, perfection_rate: 83.9 },
    { part: "Determiner", count: 250937, perfection_rate: 82.9 }, { part: "Adjective", count: 245155, perfection_rate: 86.9 },
    { part: "Pronoun", count: 193617, perfection_rate: 80.1 }, { part: "Adverb", count: 146053, perfection_rate: 83.4 },
    { part: "Preposition", count: 111642, perfection_rate: 82.7 }, { part: "Conjunction", count: 33443, perfection_rate: 80.2 },
    { part: "Interjection", count: 26374, perfection_rate: 90.6 }, { part: "Numeral", count: 9210, perfection_rate: 84.9 }
  ],
  fr: [
    { part: "Noun", count: 561008, perfection_rate: 82.6 }, { part: "Verb", count: 385775, perfection_rate: 82.5 },
    { part: "Determiner", count: 367318, perfection_rate: 79.9 }, { part: "Pronoun", count: 209244, perfection_rate: 79.0 },
    { part: "Adjective", count: 163607, perfection_rate: 85.2 }, { part: "Adverb", count: 61594, perfection_rate: 81.4 },
    { part: "Preposition", count: 35642, perfection_rate: 78.7 }, { part: "Conjunction", count: 32622, perfection_rate: 71.3 },
    { part: "Interjection", count: 20845, perfection_rate: 86.0 }, { part: "Numeral", count: 1479, perfection_rate: 85.6 }
  ],
  it: [
    { part: "Noun", count: 343172, perfection_rate: 87.1 }, { part: "Verb", count: 164993, perfection_rate: 85.8 },
    { part: "Determiner", count: 117311, perfection_rate: 83.6 }, { part: "Pronoun", count: 73872, perfection_rate: 83.3 },
    { part: "Adverb", count: 32091, perfection_rate: 84.4 }, { part: "Adjective", count: 30438, perfection_rate: 89.5 },
    { part: "Interjection", count: 14335, perfection_rate: 88.3 }, { part: "Preposition", count: 9091, perfection_rate: 85.1 },
    { part: "Conjunction", count: 5201, perfection_rate: 84.5 }, { part: "Numeral", count: 2072, perfection_rate: 83.5 }
  ],
  pt: [
    { part: "Noun", count: 136166, perfection_rate: 86.8 }, { part: "Verb", count: 76443, perfection_rate: 86.3 },
    { part: "Determiner", count: 29628, perfection_rate: 83.7 }, { part: "Pronoun", count: 21213, perfection_rate: 84.7 },
    { part: "Preposition", count: 13507, perfection_rate: 80.6 }, { part: "Adjective", count: 12837, perfection_rate: 88.5 },
    { part: "Interjection", count: 9050, perfection_rate: 90.0 }, { part: "Adverb", count: 7642, perfection_rate: 83.4 },
    { part: "Conjunction", count: 4265, perfection_rate: 77.5 }, { part: "Numeral", count: 455, perfection_rate: 85.1 }
  ]
};

const topWords = {
  de: [
    { word: "die", n: 45252, acc: 90.4 }, { word: "das", n: 36858, acc: 91.7 },
    { word: "eine", n: 32791, acc: 90.8 }, { word: "ein", n: 29955, acc: 90.3 },
    { word: "wasser", n: 26335, acc: 92.1 }, { word: "kind", n: 25415, acc: 91.8 },
    { word: "frau", n: 24794, acc: 92.4 }, { word: "lehrer", n: 22901, acc: 86.2 },
    { word: "isst", n: 22511, acc: 92.3 }, { word: "mädchen", n: 20110, acc: 89.5 }
  ],
  en: [
    { word: "a", n: 123099, acc: 88.3 }, { word: "is", n: 97738, acc: 90.0 },
    { word: "eats", n: 91640, acc: 90.2 }, { word: "we", n: 74614, acc: 85.4 },
    { word: "eat", n: 69605, acc: 90.0 }, { word: "are", n: 69063, acc: 88.3 },
    { word: "they", n: 64371, acc: 85.5 }, { word: "drink", n: 62365, acc: 92.3 },
    { word: "man", n: 60331, acc: 91.9 }, { word: "and", n: 59933, acc: 87.7 }
  ],
  es: [
    { word: "come", n: 58069, acc: 92.0 }, { word: "es", n: 50212, acc: 91.2 },
    { word: "bebe", n: 40709, acc: 90.7 }, { word: "son", n: 39629, acc: 89.8 },
    { word: "no", n: 37234, acc: 89.3 }, { word: "soy", n: 37212, acc: 91.4 },
    { word: "mujer", n: 31084, acc: 90.7 }, { word: "hombre", n: 31078, acc: 92.0 },
    { word: "agua", n: 30080, acc: 91.0 }, { word: "leche", n: 29666, acc: 91.0 }
  ],
  fr: [
    { word: "une", n: 45599, acc: 90.9 }, { word: "la", n: 44682, acc: 90.2 },
    { word: "un", n: 42774, acc: 90.5 }, { word: "le", n: 40331, acc: 89.9 },
    { word: "l'", n: 39941, acc: 89.2 }, { word: "tu", n: 37785, acc: 87.0 },
    { word: "mange", n: 35501, acc: 87.1 }, { word: "c'", n: 34096, acc: 92.2 },
    { word: "mon", n: 31761, acc: 92.1 }, { word: "les", n: 31444, acc: 88.4 }
  ],
  it: [
    { word: "sono", n: 12692, acc: 87.1 }, { word: "la", n: 12624, acc: 90.7 },
    { word: "lei", n: 11023, acc: 92.3 }, { word: "una", n: 10770, acc: 89.2 },
    { word: "ragazza", n: 10755, acc: 89.8 }, { word: "il", n: 10669, acc: 88.6 },
    { word: "lui", n: 10420, acc: 91.2 }, { word: "un", n: 10272, acc: 89.9 },
    { word: "loro", n: 10224, acc: 91.1 }, { word: "donna", n: 9843, acc: 90.1 }
  ],
  pt: [
    { word: "é", n: 5937, acc: 87.1 }, { word: "a", n: 5722, acc: 93.2 },
    { word: "um", n: 5496, acc: 88.5 }, { word: "come", n: 4824, acc: 93.6 },
    { word: "como", n: 3991, acc: 93.9 }, { word: "de", n: 3844, acc: 88.9 },
    { word: "uma", n: 3709, acc: 90.3 }, { word: "mulher", n: 3516, acc: 91.6 },
    { word: "sou", n: 3262, acc: 91.7 }, { word: "com", n: 3207, acc: 90.0 }
  ]
};

// ─── HELPERS ──────────────────────────────────────────────────────────────

const fmt = (n) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "K" : String(n);

const HOUR_COLORS = { Dawn: "#9f3be7", Morning: "#87CEEB", Afternoon: "#f6d21e", Night: "#191970" };

// ─── COMPONENTS ───────────────────────────────────────────────────────────

function AccuracyPill({ value, size = "md" }) {
  const color = value >= 90 ? COLORS.green : value >= 85 ? COLORS.orange : COLORS.red;
  const sz = size === "sm" ? { fontSize: 11, padding: "2px 8px" } : { fontSize: 13, padding: "4px 12px" };
  return (
    <span style={{
      ...sz, background: `${color}18`, color, borderRadius: 20,
      fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", display: "inline-block"
    }}>{value}%</span>
  );
}

function BarMeter({ value, max = 100, color = COLORS.accent, height = 6 }) {
  return (
    <div style={{ width: "100%", height, background: "var(--track)", borderRadius: height / 2, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: height / 2, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)",
      padding: "20px 22px", ...style
    }}>{children}</div>
  );
}

function Stat({ label, value, sub, icon }) {
  return (
    <Card style={{ flex: "1 1 180px", minWidth: 155 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--dim)", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1, color: "var(--fg)" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "var(--fg)", fontFamily: "'Space Grotesk', sans-serif" }}>{children}</h2>
      {sub && <p style={{ fontSize: 13, color: "var(--dim)", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Chip({ active, onClick, children, color }) {
  const bg = active ? (color ? `${color}20` : "rgba(88,166,255,0.12)") : "transparent";
  const fg = active ? (color || COLORS.accent) : "var(--dim)";
  const brd = active ? (color || COLORS.accent) : "var(--border)";
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", border: `1px solid ${brd}`, borderRadius: 8, background: bg, color: fg,
      cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
      transition: "all 0.15s", whiteSpace: "nowrap"
    }}>{children}</button>
  );
}

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontSize: 13
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--fg)" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--dim)" }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── TAB DEFINITIONS ──────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "languages", label: "Languages"},
  { id: "difficulty", label: "Difficulty"},
  { id: "grammar", label: "Grammar" },
  { id: "schedule", label: "Usage Schedule"}
];

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [gramLang, setGramLang] = useState("all");
  const [pairSort, setPairSort] = useState("sessions");

  const currentGrammar = gramLang === "all" ? grammarData : (langGrammar[gramLang] || grammarData);
  const sortedPairs = useMemo(() => [...pairData].sort((a, b) => b[pairSort] - a[pairSort]), [pairSort]);

  const radarGrammar = useMemo(() => {
    const parts = ["Noun", "Verb", "Adjective", "Adverb", "Pronoun", "Preposition", "Conjunction"];
    return parts.map(p => {
      const row = { part: p };
      Object.keys(langGrammar).forEach(lang => {
        const found = langGrammar[lang].find(g => g.part === p);
        row[lang] = found ? found.perfection_rate : 0;
      });
      return row;
    });
  }, []);

  return (
    <div style={{
      "--bg": "#020b15", "--card": "#091a2d", "--border": "#6389b0", "--fg": "#ffffff",
      "--dim": "#ffffff", "--track": "#1A2332",
      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      background: "var(--bg)", color: "var(--fg)", minHeight: "100vh", padding: "20px 16px 40px"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 58, display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 20, textTransform: "uppercase", letterSpacing: 2, color: COLORS.accent, fontWeight: 700, marginBottom: 4 }}>
            Duolingo Dataset Analysis
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
            Learning Traces Explorer
          </h1>
        </div>
        <span style={{ fontSize: 12, color: "var(--dim)", paddingBottom: 2 }}>
          12.8M records · 6 languages · ~118K users · Feb–Mar 2013
        </span>
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: "flex", gap: 2, marginBottom: 26, overflowX: "auto",
        background: "var(--card)", borderRadius: 12, padding: 4, border: "1px solid var(--border)"
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", border: "none", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
            whiteSpace: "nowrap", transition: "all 0.15s",
            background: tab === t.id ? COLORS.accent : "transparent",
            color: tab === t.id ? "#15263b" : "var(--dim)"
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════ OVERVIEW ═══════════════════ */}
      {tab === "overview" && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
            <Stat icon="" label="Total Records" value="12.8M" sub="learning_traces.13m.csv" />
            <Stat icon="" label="Unique Users" value="~118K" sub="across 6 languages" />
            <Stat icon="" label="Unique Lexemes" value="~19K" sub="total vocabulary" />
            <Stat icon="" label="Avg Accuracy" value="89.6%" sub="correct answers" />
          </div>

          <SectionTitle sub="Total practice sessions per target language">Sessions by Language</SectionTitle>
          <Card style={{ marginBottom: 28 }}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData.map(d => ({ name: `${LANG_FLAGS[d.language]} ${LANG_NAMES[d.language]}`, lang: d.language, Sessions: d.sessions }))} layout="vertical" margin={{ left: 110, right: 40, top: 5, bottom: 5 }}>
                  <XAxis type="number" tickFormatter={fmt} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#E2E8F0", fontSize: 13 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<TT />} />
                  <Bar dataKey="Sessions" radius={[0, 6, 6, 0]} barSize={26}>
                    {langData.map((d, i) => <Cell key={i} fill={COLORS[d.language]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════ LANGUAGES ═══════════════════ */}
      {tab === "languages" && (
        <div>
          <SectionTitle sub="Sessions, users and accuracy for each target language">Language Statistics</SectionTitle>
          <Card>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={langData.map(d => ({ name: `${LANG_FLAGS[d.language]} ${LANG_NAMES[d.language]}`, lang: d.language, Sessions: d.sessions, Users: d.users, Lexemes: d.lexemes, Accuracy: d.avg_accuracy }))} margin={{ left: 10, right: 50, top: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#455f78" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tickFormatter={fmt} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 95]} tickFormatter={v => `${v}%`} tick={{ fill: COLORS.green, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--dim)" }} />
                  <Bar yAxisId="left" dataKey="Sessions" radius={[4, 4, 0, 0]} barSize={26}>
                    {langData.map((d, i) => <Cell key={i} fill={COLORS[d.language]} />)}
                  </Bar>
                  <Line yAxisId="right" dataKey="Accuracy" name="Accuracy %" stroke={COLORS.green} strokeWidth={2.5} dot={{ fill: "#0B0F14", stroke: COLORS.green, strokeWidth: 2, r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div style={{ height: 24 }} />
          <SectionTitle sub="Sessions and users for each source → target language combination">Language Pairs</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["Pair", "Sessions", "Users", "Perfection Rate"].map(h => {
  const sortMap = { "Sessions": "sessions", "Users": "users", "Perfection Rate": "avg_accuracy" };
  const isActive = sortMap[h] === pairSort;
  return (
    <th key={h} style={{ textAlign: h === "Pair" ? "left" : "right", padding: "8px 14px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: isActive ? COLORS.accent : "var(--dim)", fontWeight: 600 }}>{h}{isActive ? " ▼" : ""}</th>
  );
})}
            {[["sessions", "Sessions"], ["users", "Users"], ["avg_accuracy", "Accuracy"]].map(([k, l]) => (
             <Chip key={k} active={pairSort === k} onClick={() => setPairSort(k)}>Sort: {l}</Chip>
              ))}
          </div>
          <Card>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
                <thead>
                  <tr>
                    {["Pair", "Sessions", "Users", "Perfection Rate"].map(h => (
                      <th key={h} style={{ textAlign: h === "Pair" ? "left" : "right", padding: "8px 14px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--dim)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPairs.map(d => (
                    <tr key={d.pair} style={{ background: "var(--bg)" }}>
                      <td style={{ padding: "13px 14px", borderRadius: "8px 0 0 8px", fontWeight: 700, fontSize: 15 }}>{d.pair}</td>
                      <td style={{ padding: "13px 14px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: pairSort === "sessions" ? COLORS.accent : "var(--fg)" }}>{d.sessions.toLocaleString()}</td>
                      <td style={{ padding: "13px 14px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: pairSort === "users" ? COLORS.accent : "var(--fg)" }}>{d.users.toLocaleString()}</td>
                      <td style={{ padding: "13px 14px", textAlign: "right", borderRadius: "0 8px 8px 0" }}><AccuracyPill value={d.avg_accuracy} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════ DIFFICULTY ═══════════════════ */}
      {tab === "difficulty" && (
        <div>
          <SectionTitle sub="Perfection rate for English speakers learning each language — lower means harder">Language Difficulty (English Speakers)</SectionTitle>
          <Card style={{ marginBottom: 28 }}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyEN.map(d => ({ name: `${LANG_FLAGS[d.language]} ${LANG_NAMES[d.language]}`, rate: d.perfection_rate, lang: d.language }))} layout="vertical" margin={{ left: 120, right: 60, top: 5, bottom: 5 }}>
                  <XAxis type="number" domain={[75, 90]} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#ffffff", fontSize: 14 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<TT />} />
                  <Bar dataKey="rate" name="Perfection Rate" radius={[0, 6, 6, 0]} barSize={28}>
                    {difficultyEN.map((d, i) => <Cell key={i} fill={COLORS[d.language]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(246, 23, 11, 0.08)", borderRadius: 10, border: `1px solid ${COLORS.red}30` }}>
              <p style={{ fontSize: 13, color: "var(--dim)", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: COLORS.red }}>Key Insight:</strong> French is the hardest language for English speakers (81.6% perfection rate), while Italian and Portuguese are the easiest (85.9%). Interestingly, the most popular languages are not necessarily the easiest.
              </p>
            </div>
          </Card>

          <SectionTitle sub="Perfection rate (%) by grammar class across languages — further out is easier">Grammar Difficulty Radar</SectionTitle>
          <Card>
            <div style={{ height: 440 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarGrammar} cx="50%" cy="50%" outerRadius="68%">
                  <PolarGrid stroke="#455f78" />
                  <PolarAngleAxis dataKey="part" tick={{ fill: "#ffffff", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[70, 95]} tickCount={6} tickFormatter={v => `${v}%`} tick={{ fill: "#9fb6cc", fontSize: 10 }} axisLine={false} />
                  {["en", "es", "fr", "de"].map(lang => (
                    <Radar key={lang} name={LANG_NAMES[lang]} dataKey={lang} stroke={COLORS[lang]} fill={COLORS[lang]} fillOpacity={0.12} strokeWidth={2.5} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 13, color: "var(--dim)" }} iconType="circle" />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (<div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontSize: 13 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--fg)" }}>{label}</div>
                      {[...payload].sort((a, b) => b.value - a.value).map((p, i) => (
                        <div key={i} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 16 }}>
                          <span>{p.name}</span><strong>{p.value}%</strong>
                        </div>
                      ))}
                    </div>);
                  }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════ GRAMMAR ═══════════════════ */}
      {tab === "grammar" && (
        <div>
          <SectionTitle sub="Frequency and perfection rate by grammatical class">Grammar Parts of Speech</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Chip active={gramLang === "all"} onClick={() => setGramLang("all")}>All Languages</Chip>
            {Object.keys(langGrammar).map(l => (
              <Chip key={l} active={gramLang === l} onClick={() => setGramLang(l)} color={COLORS[l]}>
                {LANG_FLAGS[l]} {LANG_NAMES[l]}
              </Chip>
            ))}
          </div>
          <Card style={{ marginBottom: 24 }}>
            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={currentGrammar} margin={{ left: 10, right: 50, top: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#455f78" />
                  <XAxis dataKey="part" tick={{ fill: "#ffffff", fontSize: 11 }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" tickFormatter={fmt} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[65, 100]} tickFormatter={v => `${v}%`} tick={{ fill: COLORS.green, fontSize: 12 }} axisLine={false} tickLine={false} />                  <Tooltip content={<TT />} />
                  <Bar yAxisId="left" dataKey="count" name="Frequency" fill={COLORS.accent} radius={[4, 4, 0, 0]} barSize={24} fillOpacity={0.7} />
                  <Line yAxisId="right" dataKey="perfection_rate" name="Perfection %" stroke={COLORS.green} strokeWidth={2.5} dot={{ fill: "#0B0F14", stroke: COLORS.green, strokeWidth: 2, r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <SectionTitle sub="Perfection rate by grammar class — sorted from hardest to easiest">Perfection Rate Ranking</SectionTitle>
            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...currentGrammar].sort((a, b) => a.perfection_rate - b.perfection_rate)} layout="vertical" margin={{ left: 30, right: 50, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#455f78" horizontal={false} />
                  <XAxis type="number" domain={[70, 95]} tickFormatter={v => `${v}%`} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="part" tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (<div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", fontSize: 13 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--fg)" }}>{label}</div>
                      <div style={{ color: "var(--dim)" }}>Perfection rate: <strong>{d.perfection_rate}%</strong></div>
                      <div style={{ color: "var(--dim)" }}>Frequency: <strong>{d.count.toLocaleString()}</strong></div>
                    </div>);
                  }} />
                  <Bar dataKey="perfection_rate" name="Perfection %" radius={[0, 6, 6, 0]} barSize={20}>
                    {[...currentGrammar].sort((a, b) => a.perfection_rate - b.perfection_rate).map((d, i) => (
                      <Cell key={i} fill={d.perfection_rate >= 90 ? COLORS.green : d.perfection_rate >= 85 ? COLORS.orange : COLORS.red} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(188,140,255,0.08)", borderRadius: 10, border: `1px solid ${COLORS.purple}30` }}>
              <p style={{ fontSize: 13, color: "var(--dim)", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: COLORS.purple }}>Key Insight:</strong> Conjunctions are the hardest grammar class (77.5% perfection), while Interjections are the easiest (91.0%). Nouns dominate in frequency but have moderate difficulty.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════ SCHEDULE ═══════════════════ */}
      {tab === "schedule" && (
        <div>
          <SectionTitle sub="When users practice most — sessions by hour of the day">Hourly Usage Pattern</SectionTitle>
          <Card style={{ marginBottom: 28 }}>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#35485c" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#ffffff", fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tickFormatter={fmt} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT />} />
                  <Bar dataKey="sessions" name="Sessions" radius={[3, 3, 0, 0]} barSize={18}>
                    {hourData.map((d, i) => <Cell key={i} fill={HOUR_COLORS[d.period]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
              {Object.entries(HOUR_COLORS).map(([p, c]) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--dim)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{p}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(255, 25, 0, 0.08)", borderRadius: 10, border: `1px solid ${COLORS.orange}30` }}>
              <p style={{ fontSize: 13, color: "var(--dim)", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: COLORS.orange }}>Key Insight:</strong> Peak usage at 9 PM (811K sessions). Usage drops sharply from midnight to 8 AM (lowest at 239K), then climbs through the afternoon and evening.
              </p>
            </div>
          </Card>

          <SectionTitle sub="Activity distribution across days of the week">Weekly Pattern</SectionTitle>
          <Card style={{ marginBottom: 28 }}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#35485c" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#ffffff", fontSize: 13 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmt} tick={{ fill: "#ffffff", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TT />} />
                  <Bar dataKey="count" name="Sessions" radius={[4, 4, 0, 0]} barSize={36}>
                    {weekdayData.map((d, i) => <Cell key={i} fill={d.isWeekend ? COLORS.green : COLORS.accent} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--dim)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.accent }} />Weekday
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--dim)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.green }} />Weekend
              </div>
            </div>
          </Card>

          <SectionTitle sub="Unique active users per day (Feb 28 – Mar 12, 2013)">Daily Active Users</SectionTitle>
          <Card>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" stroke="#1E2A36" />
               <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
               <YAxis tickFormatter={fmt} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 28000]} />
               <Tooltip content={<TT />} />
               <Line dataKey="users" name="Unique Users" stroke={COLORS.purple} strokeWidth={2.5} dot={{ fill: "#0B0F14", stroke: COLORS.purple, strokeWidth: 2, r: 5 }} />
              </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(88,166,255,0.08)", borderRadius: 10, border: `1px solid ${COLORS.accent}30` }}>
              <p style={{ fontSize: 13, color: "var(--dim)", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: COLORS.accent }}>Key Insight:</strong> March 6 (Wednesday) had the peak with 24,040 active users. Weekends show consistent dips. Usage tends to peak mid-week.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ marginTop: 40, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <p style={{ color: "var(--dim)", fontSize: 11, margin: 0 }}>
          Data: learning_traces.13m.csv · 12,854,226 records · Duolingo Spaced Repetition Dataset · All data pre-aggregated — no CSV file needed
        </p>
      </div>
    </div>
  );
}