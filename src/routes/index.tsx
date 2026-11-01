import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import games from "@/data/games.json";

type Game = (typeof games)[number];

const MAIN = ["Arcade", "Puzzle", "Shooter", "Sports", "Racing", "Simulation", "Strategy", "Sandbox"];
const EXTRA = Array.from(new Set(games.map((g) => g.category))).filter((c) => !MAIN.includes(c)).sort();
const CATEGORIES = ["All", ...MAIN, ...EXTRA];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arcadia — Free Browser Game Directory" },
      { name: "description", content: "Search and play 80+ free browser games across arcade, puzzle, shooter, sports, racing and more." },
      { property: "og:title", content: "Arcadia — Free Browser Game Directory" },
      { property: "og:description", content: "Search and play 80+ free browser games by category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function Thumb({ game }: { game: Game }) {
  if (game.thumbnail)
    return <img src={game.thumbnail} alt={game.title} loading="lazy" className="h-full w-full object-cover" />;
  const h = hue(game.title);
  const initials = game.title.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div
      className="thumb-art flex h-full w-full items-center justify-center"
      style={{ ["--h" as string]: h }}
      aria-label={game.title}
    >
      <span className="font-display text-5xl text-foreground/90 drop-shadow">{initials}</span>
    </div>
  );
}

function Index() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return games.filter(
      (g) =>
        (cat === "All" || g.category === cat) &&
        (!s || g.title.toLowerCase().includes(s) || g.description.toLowerCase().includes(s) || g.creator.toLowerCase().includes(s)),
    );
  }, [q, cat]);

  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Insert coin</p>
        <h1 className="font-display mt-2 text-5xl sm:text-7xl">ARCADIA</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">{games.length} free browser games. Pick one and play.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search games, creators…"
          className="mt-6 w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
      </header>

      <nav className="sticky top-0 z-10 border-y border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-4 text-sm text-muted-foreground">{list.length} games</p>
        {list.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No games match your search.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((g) => (
              <article key={g.title} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
                <div className="aspect-video overflow-hidden">
                  <Thumb game={g} />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground">{g.category}</span>
                    {g.multiplayer === "Yes" && <span className="rounded-md bg-accent px-2 py-0.5 text-accent-foreground">Multiplayer</span>}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold">{g.title}</h2>
                  {g.creator && <p className="text-xs text-muted-foreground">by {g.creator}</p>}
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.description}</p>
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition group-hover:shadow-glow"
                  >
                    ▶ Play
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
