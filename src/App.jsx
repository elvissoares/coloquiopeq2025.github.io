import React, { useMemo, useState, useEffect } from "react";
import { Calendar, Clock, Info, MapPin, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";
import logo from "./logo.png"; // imported logo

/**
 * How to customize
 * 1) Edit the WORKSHOP object (name, dates, venue, blurb).
 * 2) Edit the SESSIONS array (day, time, title, speaker, affiliation, room, duration, abstract?).
 * 3) Use the language toggle (🇧🇷 / 🇬🇧) in the header. Strings are in the I18N object.
 */

const PRIMARY_COLOR = "#8a2733"; // main color

const WORKSHOP = {
  name: "XXII Colóquio Anual de Engenharia Química",
  shortName: "XXII Colóquo PEQ",
  dates: { start: "2025-11-05", end: "2025-11-07" },
  venue: {
    name: "Centro de Tecnologia, UFRJ — Bloco G - 1° andar",
    city: "Rio de Janeiro, Brasil",
    mapUrl: "https://maps.google.com",
  },
  blurb:
    "O Colóquio Anual de Engenharia Química é realizado pelo Programa de Engenharia Química (PEQ) da COPPE/UFRJ. Desde a sua primeira edição, em 2001, o evento tem como objetivo promover discussões a respeito de assuntos relevantes na área de Engenharia Química e em áreas correlatas. Minicursos, mesas- redondas, conferências e apresentação de trabalhos constituem o universo das atividades que se desenrolam ao longo do evento.",
  contactEmail: "coloquio@peq.coppe.ufrj.br",
  timezone: "America/Sao_Paulo",
};

// i18n strings
const I18N = {
  "pt-BR": {
    nav: { welcome: "Boas-vindas", program: "Programação" },
    sections: { motivation: "Motivação", dates: "Datas" },
    actions: { viewMap: "Ver mapa", addToGoogle: "Adicionar ao Google Agenda" },
    contact: "Contato",
    welcomeTitle: (short) => `Bem-vindo ao ${short}`,
    legend: { plenary: "Plenária/Keynote", talk: "Palestra", poster: "Pôster", break: "Intervalo" },
    typeLabel: { plenary: "plenária", keynote: "keynote", talk: "palestra", poster: "pôster", break: "intervalo" },
  },
  en: {
    nav: { welcome: "Welcome", program: "Program" },
    sections: { motivation: "Motivation", dates: "Dates" },
    actions: { viewMap: "View map", addToGoogle: "Add to Google Calendar" },
    contact: "Contact",
    welcomeTitle: (short) => `Welcome to ${short}`,
    legend: { plenary: "Plenary/Keynote", talk: "Talk", poster: "Poster", break: "Break" },
    typeLabel: { plenary: "plenary", keynote: "keynote", talk: "talk", poster: "poster", break: "break" },
  },
};

// Example schedule (edit freely)
const SESSIONS = [
  {
    day: "2025-11-05",
    time: "08:00",
    durationMin: 30,
    title: "Credenciamento",
    speaker: "-",
    affiliation: "",
    room: "Auditório da COPPE",
    type: "break",
  },
  {
    day: "2025-11-05",
    time: "08:30",
    durationMin: 30,
    title: "Abertura & Boas-vindas",
    speaker: "Comissão Organizadora",
    affiliation: "",
    room: "Auditório da COPPE",
    type: "plenary",
  },
  {
    day: "2025-11-05",
    time: "09:00",
    durationMin: 90,
    title: "Palestra Magna",
    speaker: "Prof. ...",
    affiliation: "...",
    room: "Auditório da COPPE",
    type: "keynote",
  },
  {
    day: "2025-11-05",
    time: "10:30",
    durationMin: 90,
    title: "Apresentações PEQ I",
    speaker: "Prof. ...",
    affiliation: "UFRJ",
    room: "Auditório da COPPE",
    type: "talk",
  },
  {
    day: "2025-11-05",
    time: "12:00",
    durationMin: 90,
    title: "Almoço + Visita aos Labs",
    speaker: "—",
    affiliation: "",
    room: "",
    type: "break",
  },
  {
    day: "2025-11-05",
    time: "13:30",
    durationMin: 90,
    title: "Palestra",
    speaker: "Prof. ...",
    affiliation: "UFRJ",
    room: "Auditório da COPPE",
    type: "talk",
  },
  {
    day: "2025-11-05",
    time: "15:00",
    durationMin: 60,
    title: "Café + Pôster",
    speaker: "—",
    affiliation: "",
    room: "Tenda",
    type: "poster",
  },
  {
    day: "2025-11-06",
    time: "09:00",
    durationMin: 45,
    title: "Avanços em simulação molecular para adsorção em sólidos nanoporosos",
    speaker: "Palestra Magna: S. K. Bhatia",
    affiliation: "UQ",
    room: "Auditorium A",
    type: "keynote",
  },
  {
    day: "2025-11-06",
    time: "10:00",
    durationMin: 30,
    title: "Intervalo para café",
    speaker: "—",
    affiliation: "",
    room: "Foyer",
    type: "break",
  },
  {
    day: "2025-11-07",
    time: "14:00",
    durationMin: 120,
    title: "Sessão de Pôsteres",
    speaker: "Todos os apresentadores",
    affiliation: "",
    room: "Hall B",
    type: "poster",
  },
];

function formatDate(dateStr, locale) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "short", day: "numeric" });
}

function formatTime(t, locale) {
  // expects "HH:MM" 24h
  const [h, m] = t.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function byDay(sessions) {
  const map = new Map();
  sessions
    .slice()
    .sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time))
    .forEach((s) => {
      if (!map.has(s.day)) map.set(s.day, []);
      map.get(s.day).push(s);
    });
  return map;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateTimeToBasic(dt) {
  // format Date -> YYYYMMDDTHHMMSS (no Z)
  const Y = dt.getFullYear();
  const M = pad2(dt.getMonth() + 1);
  const D = pad2(dt.getDate());
  const h = pad2(dt.getHours());
  const m = pad2(dt.getMinutes());
  const s = pad2(dt.getSeconds());
  return `${Y}${M}${D}T${h}${m}${s}`;
}

function buildGCalUrl(session, locale) {
  const { day, time, durationMin = 60, title, speaker, affiliation, room } = session;
  // Interpret day/time in the workshop's timezone using the browser local time fallback
  const [H, Min] = time.split(":").map(Number);
  const start = new Date(`${day}T${pad2(H)}:${pad2(Min)}:00`);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  const dates = `${dateTimeToBasic(start)}/${dateTimeToBasic(end)}`;
  const text = encodeURIComponent(title);
  const detailsText = [speaker, affiliation].filter(Boolean).join(" · ");
  const details = encodeURIComponent(`${detailsText}\n${WORKSHOP.shortName}`);
  const location = encodeURIComponent(`${room ? room + ", " : ""}${WORKSHOP.venue.name}, ${WORKSHOP.venue.city}`);
  const ctz = encodeURIComponent(WORKSHOP.timezone || "America/Sao_Paulo");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}&details=${details}&ctz=${ctz}`;
}

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium border-gray-300 text-gray-700">
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-sm border p-6 bg-white ${className}`}>{children}</div>
);

export default function WorkshopSite() {
  const [tab, setTab] = useState("welcome");
  const [lang, setLang] = useState("pt-BR");
  const locale = lang === "en" ? "en-GB" : "pt-BR";

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("caeq_lang") : null;
    if (stored) setLang(stored);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("caeq_lang", lang);
  }, [lang]);

  const t = I18N[lang];
  const days = useMemo(() => byDay(SESSIONS), []);
  const dateRange = `${formatDate(WORKSHOP.dates.start, locale)} → ${formatDate(WORKSHOP.dates.end, locale)}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center font-bold text-white" style={{ backgroundColor: PRIMARY_COLOR }}>CA</div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">{WORKSHOP.shortName}</h1>
              <p className="text-sm text-gray-500">{WORKSHOP.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* language toggle */}
            <div className="flex rounded-xl border overflow-hidden">
              <button
                aria-label="Português do Brasil"
                onClick={() => setLang("pt-BR")}
                className={`px-3 py-2 text-sm font-medium ${lang === "pt-BR" ? "text-white" : "hover:bg-gray-100"}`}
                style={lang === "pt-BR" ? { backgroundColor: PRIMARY_COLOR } : {}}
              >
                🇧🇷
              </button>
              <button
                aria-label="English"
                onClick={() => setLang("en")}
                className={`px-3 py-2 text-sm font-medium ${lang === "en" ? "text-white" : "hover:bg-gray-100"}`}
                style={lang === "en" ? { backgroundColor: PRIMARY_COLOR } : {}}
              >
                🇬🇧
              </button>
            </div>
            <nav className="flex gap-2 ml-2">
              <button
                onClick={() => setTab("welcome")}
                className={`px-3 py-2 rounded-xl text-sm font-medium ${tab === "welcome" ? "text-white" : "hover:bg-gray-100"}`}
                style={tab === "welcome" ? { backgroundColor: PRIMARY_COLOR } : {}}
              >
                {t.nav.welcome}
              </button>
              <button
                onClick={() => setTab("program")}
                className={`px-3 py-2 rounded-xl text-sm font-medium ${tab === "program" ? "text-white" : "hover:bg-gray-100"}`}
                style={tab === "program" ? { backgroundColor: PRIMARY_COLOR } : {}}
              >
                {t.nav.program}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === "welcome" ? (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <Info className="h-5 w-5" />
                  <span className="uppercase tracking-wider text-xs">{t.sections.motivation}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3" style={{ color: PRIMARY_COLOR }}>{t.welcomeTitle(WORKSHOP.shortName)}</h2>
                <p className="leading-relaxed text-gray-700">
                  {WORKSHOP.blurb}
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span className="uppercase tracking-wider text-xs">{t.sections.dates}</span>
                </div>
                <p className="font-medium" style={{ color: PRIMARY_COLOR }}>{dateRange}</p>
                <div className="mt-4 flex items-start gap-3 text-sm text-gray-700">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-medium">{WORKSHOP.venue.name}</div>
                    <div>{WORKSHOP.venue.city}</div>
                    <a href={WORKSHOP.venue.mapUrl} target="_blank" rel="noreferrer" className="underline mt-1 inline-block">{t.actions.viewMap}</a>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3 text-sm text-gray-700">
                  <Users className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-medium">{t.contact}</div>
                    <a className="underline" href={`mailto:${WORKSHOP.contactEmail}`}>{WORKSHOP.contactEmail}</a>
                  </div>
                </div>
              </Card>
            </div>
          </motion.section>
        ) : (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {/* Legend */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge>{t.legend.plenary}</Badge>
              <Badge>{t.legend.talk}</Badge>
              <Badge>{t.legend.poster}</Badge>
              <Badge>{t.legend.break}</Badge>
            </div>

            {/* Program grouped by day */}
            <div className="space-y-8">
              {Array.from(byDay(SESSIONS).entries()).map(([day, items]) => (
                <Card key={day}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5" />
                    <h3 className="text-xl font-semibold" style={{ color: PRIMARY_COLOR }}>{formatDate(day, locale)}</h3>
                  </div>

                  <ul className="divide-y">
                    {items.map((s, idx) => (
                      <li key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-[12rem]">
                          <Clock className="h-4 w-4" />
                          <div className="text-sm">
                            <div className="font-medium">{formatTime(s.time, locale)}{s.durationMin ? ` — ${s.durationMin} min` : ""}</div>
                            <div className="text-gray-500">{s.room}</div>
                          </div>
                        </div>
                        <div className="md:flex-1">
                          <div className="font-medium">{s.title}</div>
                          <div className="text-sm text-gray-600">{s.speaker}{s.affiliation ? ` · ${s.affiliation}` : ""}</div>
                        </div>
                        <div className="md:ml-4 flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}>{I18N[lang].typeLabel[s.type] || s.type}</span>
                          <a
                            href={buildGCalUrl(s, locale)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-1 hover:opacity-90"
                            style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                            aria-label={I18N[lang].actions.addToGoogle}
                            title={I18N[lang].actions.addToGoogle}
                          >
                            <Plus className="h-3.5 w-3.5" /> {I18N[lang].actions.addToGoogle}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 pb-10 pt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} {WORKSHOP.shortName}. All rights reserved.
      </footer>
    </div>
  );
}
