import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Mail, Phone, Download, Calendar, Navigation } from "lucide-react";
import heroImage from "@/assets/hero-musallah.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dixon Musallah — Prayer Times & Jummah | 340 Dixon Road, Toronto" },
      { name: "description", content: "Dixon Musallah Prayer Room at 340 Dixon Road, Basement Level. View daily Adhan & Iqamah times, Jummah Khutbah schedule, and directions." },
      { property: "og:title", content: "Dixon Musallah — A Place of Prayer on Dixon Road" },
      { property: "og:description", content: "Daily prayer times, Jummah schedule, and location for the Dixon Road Muslim community in Toronto." },
    ],
  }),
  component: Home,
});

type Prayer = { name: string; arabic: string; adhan: string; iqamah: string };

const PRAYERS: Prayer[] = [
  { name: "Fajr",    arabic: "الفجر",   adhan: "4:10 AM", iqamah: "4:30 AM" },
  { name: "Dhuhr",   arabic: "الظهر",   adhan: "1:25 PM", iqamah: "1:45 PM" },
  { name: "Asr",     arabic: "العصر",   adhan: "5:30 PM", iqamah: "5:45 PM" },
  { name: "Maghrib", arabic: "المغرب",  adhan: "Sunset",  iqamah: "Sunset" },
  { name: "Isha",    arabic: "العشاء",  adhan: "10:35 PM",iqamah: "11:00 PM" },
];

function parseTimeToday(t: string): Date | null {
  if (!/\d/.test(t)) return null;
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3]?.toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d;
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

function NextPrayerBar() {
  const now = useNow();
  const next = useMemo(() => {
    for (const p of PRAYERS) {
      const t = parseTimeToday(p.iqamah);
      if (t && t.getTime() > now.getTime()) return { p, t };
    }
    const t = parseTimeToday(PRAYERS[0].iqamah);
    if (t) { t.setDate(t.getDate() + 1); return { p: PRAYERS[0], t }; }
    return null;
  }, [now]);

  const diff = next ? Math.max(0, next.t.getTime() - now.getTime()) : 0;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div className="rounded-2xl bg-[var(--gradient-deep)] text-primary-foreground p-6 md:p-8 shadow-[var(--shadow-elegant)] relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-soft)]">Next Prayer</p>
          <h3 className="font-display text-4xl md:text-5xl mt-1">
            {next?.p.name}
            <span className="text-[var(--gold)] font-normal text-2xl md:text-3xl ml-3">{next?.p.arabic}</span>
          </h3>
          <p className="text-sm opacity-80 mt-1">Iqamah at {next?.p.iqamah}</p>
        </div>
        <div className="flex items-end gap-3 font-display">
          {[["Hours", h], ["Minutes", m], ["Seconds", s]].map(([label, val]) => (
            <div key={label as string} className="text-center min-w-[68px]">
              <div className="text-4xl md:text-5xl text-[var(--gold)] tabular-nums">{String(val as number).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-widest opacity-70 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#prayer-times", label: "Prayer Times" },
    { href: "#jummah", label: "Jummah" },
    { href: "#location", label: "Location" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-background/85 border-b border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-[var(--gradient-deep)] grid place-items-center text-[var(--gold)] font-display text-xl">د</span>
          <span className="font-display text-xl md:text-2xl text-primary">Dixon Musallah</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-foreground/80">
          {links.map(l => <a key={l.href} href={l.href} className="hover:text-primary transition">{l.label}</a>)}
        </nav>
        <a href="#prayer-times" className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
          <Clock className="w-4 h-4" /> Prayer Times
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
          <div className="space-y-1.5"><span className="block w-6 h-px bg-foreground"/><span className="block w-6 h-px bg-foreground"/><span className="block w-6 h-px bg-foreground"/></div>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-5 py-4 flex flex-col gap-3">
            {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-foreground/80">{l.label}</a>)}
            <a href="#prayer-times" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium"><Clock className="w-4 h-4" /> View Prayer Times</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[88vh] flex items-center overflow-hidden">
      <img src={heroImage} alt="Mosque prayer hall" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.05_160/0.85)] via-[oklch(0.20_0.05_160/0.65)] to-[oklch(0.15_0.05_160/0.92)]" />
      <div className="absolute inset-0 bg-pattern opacity-[0.08]" />
      <div className="relative max-w-5xl mx-auto px-6 md:px-10 py-24 text-center text-primary-foreground">
        <p className="font-display text-2xl text-[var(--gold)] mb-4">بِسْمِ ٱللَّٰهِ</p>
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[var(--gold-soft)] mb-6">Welcome to Dixon Musallah</p>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6">
          A Place of Prayer<br />
          <span className="text-[var(--gold)] italic">on Dixon Road</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-primary-foreground/85 mb-10">
          Serving the Dixon Road Muslim community with daily Salah, Jummah, and a quiet space for reflection — open to all.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#prayer-times" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-gold)] text-[var(--deep)] font-medium px-7 py-3.5 hover:scale-[1.02] transition shadow-[var(--shadow-elegant)]">
            <Clock className="w-4 h-4" /> View Today's Prayer Times
          </a>
          <a href="#location" className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-soft)]/40 text-primary-foreground px-7 py-3.5 hover:bg-white/5 transition">
            <Navigation className="w-4 h-4" /> Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}

function PrayerTimes() {
  const now = useNow();
  const greg = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).format(now);
  } catch { hijri = ""; }

  return (
    <section id="prayer-times" className="relative py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Salah Schedule</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-3">Today's Prayer Times</h2>
          <p className="text-muted-foreground text-sm md:text-base">{greg}{hijri && ` · ${hijri}`}</p>
        </div>

        <NextPrayerBar />

        <div className="mt-8 rounded-2xl bg-card shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 bg-secondary text-xs md:text-sm uppercase tracking-wider text-secondary-foreground/80 font-medium">
            <div>Prayer</div>
            <div className="hidden md:block text-center">Arabic</div>
            <div className="text-center">Adhan</div>
            <div className="text-center">Iqamah</div>
          </div>
          {PRAYERS.map((p, i) => {
            const t = parseTimeToday(p.iqamah);
            const prev = i > 0 ? parseTimeToday(PRAYERS[i-1].iqamah) : null;
            const isCurrent = t && now < t && (!prev || now >= prev);
            return (
              <div key={p.name} className={`grid grid-cols-[1.4fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] px-6 py-5 items-center border-t border-border transition ${isCurrent ? "bg-[var(--gold-soft)]/20" : ""}`}>
                <div className="font-display text-xl md:text-2xl text-primary flex items-center gap-3">
                  {p.name}
                  {isCurrent && <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Next</span>}
                </div>
                <div className="hidden md:block text-center font-display text-2xl text-[var(--gold)]">{p.arabic}</div>
                <div className="text-center text-foreground/80 tabular-nums">{p.adhan}</div>
                <div className="text-center font-semibold text-primary tabular-nums">{p.iqamah}</div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">Iqamah times change weekly. Please refer to the monthly calendar below.</p>
      </div>
    </section>
  );
}

function Jummah() {
  return (
    <section id="jummah" className="relative py-20 md:py-24 bg-secondary/40">
      <div className="absolute inset-0 bg-pattern opacity-[0.06]" />
      <div className="relative max-w-5xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Friday Prayer</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Jummah Khutbah</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { addr: "320 Dixon Road", time: "1:30 PM" },
            { addr: "340 Dixon Road", time: "1:45 PM" },
          ].map(j => (
            <div key={j.addr} className="rounded-2xl bg-card border border-border p-8 shadow-[var(--shadow-card)] relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[var(--gradient-gold)] opacity-10 group-hover:opacity-20 transition" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Friday</p>
              <h3 className="font-display text-3xl text-primary mb-1">{j.addr}</h3>
              <p className="font-display text-5xl text-[var(--gold)] mt-4">{j.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalendarSection() {
  return (
    <section id="calendar" className="py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Monthly Schedule</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Prayer Timetable</h2>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 md:p-10 shadow-[var(--shadow-card)] text-center">
          <div className="aspect-[4/3] md:aspect-[16/10] rounded-xl border-2 border-dashed border-border grid place-items-center bg-secondary/30">
            <div className="text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-[var(--gold)]" />
              <p className="font-display text-2xl text-primary mb-1">Monthly Calendar</p>
              <p className="text-sm">Upload the current month's prayer timetable image here.</p>
            </div>
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition">
            <Download className="w-4 h-4" /> Download Calendar (PDF)
          </button>
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="py-20 md:py-24 bg-secondary/40">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Visit Us</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Location & Directions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)] aspect-[4/3] md:aspect-auto md:min-h-[400px]">
            <iframe
              title="Dixon Musallah Map"
              src="https://www.google.com/maps?q=340+Dixon+Road,+Toronto&output=embed"
              width="100%" height="100%" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full h-full"
            />
          </div>
          <div className="rounded-2xl bg-card border border-border p-8 md:p-10 shadow-[var(--shadow-card)] flex flex-col">
            <MapPin className="w-8 h-8 text-[var(--gold)] mb-4" />
            <h3 className="font-display text-3xl text-primary mb-3">340 Dixon Road</h3>
            <p className="text-foreground/80 mb-6">Basement Level<br />Toronto, ON</p>
            <div className="space-y-4 text-sm text-foreground/75 border-t border-border pt-6">
              <div>
                <p className="font-semibold text-primary mb-1">Parking</p>
                <p>Free visitor parking is available on-site. Please use the rear entrance for basement access.</p>
              </div>
              <div>
                <p className="font-semibold text-primary mb-1">Transit</p>
                <p>Accessible via TTC bus routes serving Dixon Road & Kipling.</p>
              </div>
            </div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=340+Dixon+Road,+Toronto" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90">
              <Navigation className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Announcements() {
  return (
    <section id="announcements" className="py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Community</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary">Announcements</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <article className="rounded-2xl bg-card border border-border p-7 shadow-[var(--shadow-card)]">
            <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-2">Notice</p>
            <h3 className="font-display text-2xl text-primary mb-2">Daily Iqamah Reminder</h3>
            <p className="text-sm text-foreground/75">Iqamah times change every Sunday. Please check the weekly schedule before arriving.</p>
          </article>
          <article className="rounded-2xl bg-[var(--gradient-deep)] text-primary-foreground p-7 shadow-[var(--shadow-card)] relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-10" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-2">Bulletin</p>
              <h3 className="font-display text-2xl mb-2">Post a Community Notice</h3>
              <p className="text-sm opacity-85">Flyers and community announcements can be shared here — upload an image to display on this bulletin board.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[var(--deep)] text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-[0.06]" />
      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-full bg-[var(--gradient-gold)] grid place-items-center text-[var(--deep)] font-display text-xl">د</span>
            <span className="font-display text-2xl">Dixon Musallah</span>
          </div>
          <p className="text-sm opacity-75 max-w-xs">A quiet place of prayer serving the Dixon Road Muslim community in Toronto.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-3">Location</p>
          <p className="text-sm opacity-85 leading-relaxed">340 Dixon Road<br />Basement Level<br />Toronto, ON</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-3">Contact</p>
          <a href="mailto:info@dixonmusallah.org" className="flex items-center gap-2 text-sm opacity-85 hover:opacity-100 mb-2"><Mail className="w-4 h-4" /> info@dixonmusallah.org</a>
          <a href="tel:+14160000000" className="flex items-center gap-2 text-sm opacity-85 hover:opacity-100"><Phone className="w-4 h-4" /> (416) 000-0000</a>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 text-xs opacity-60 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Dixon Musallah. All rights reserved.</p>
          <p className="italic font-display">"Indeed, prayer prohibits immorality and wrongdoing." — Qur'an 29:45</p>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main>
        <Hero />
        <PrayerTimes />
        <Jummah />
        <CalendarSection />
        <Location />
        <Announcements />
      </main>
      <Footer />
    </div>
  );
}
