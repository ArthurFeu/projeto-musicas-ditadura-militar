import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { loadSongs } from "@/lib/songs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Músicas da Ditadura — Infográfico interativo" },
      {
        name: "description",
        content:
          "Um mergulho interativo na MPB que resistiu ao regime militar brasileiro (1964–1985).",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: songs = [] } = useQuery({ queryKey: ["songs"], queryFn: loadSongs });
  const covers = songs.filter((s) => s.imagem);
  const loop = [...covers, ...covers];

  return (
    <main className="relative">
      <section className="paper-grain relative mx-auto grid min-h-[calc(100vh-58px)] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative z-10">
          <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-crimson">
            1964 — 1985 / arquivo sonoro
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95]">
            Músicas <br />
            <span className="italic text-crimson" style={{ fontFamily: "var(--font-serif)" }}>
              da
            </span>{" "}
            Ditadura
          </h1>
          <p className="mt-6 max-w-md font-serif text-xl italic text-ink/80">
            Infográfico interativo sobre músicas relevantes na produção de memória social sobre a
            ditadura militar brasileira
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/visao-geral"
              className="group inline-flex items-center gap-3 border-2 border-ink bg-ink px-6 py-3 font-display text-paper transition hover:bg-crimson hover:border-crimson"
            >
              Começar
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <span className="stamp">arquivo aberto</span>
          </div>

          <div className="mt-10 max-w-xs border-l-2 border-ink/90 pl-4 font-mono text-[17px] uppercase leading-relaxed tracking-widest text-muted-foreground">
            Disciplina: Projetos B II
            <br />
            Professor: André Goes Mintz
            <br />
            <br />
            Alunas: Alice Carvalho, Ester Tadim, Flor Sette Câmara e Maria Clara Reis
          </div>
        </div>

        {/* Infinite scroll album covers */}
        <div className="relative hidden h-[600px] overflow-hidden border-2 border-ink/70 bg-ink/5 lg:block">
          <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-paper to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-paper to-transparent" />
          <div className="absolute left-2 top-2 z-20 stamp">censurado</div>
          <div className="scroll-marquee grid grid-cols-2 gap-3 p-4">
            {loop.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="aspect-square overflow-hidden border-2 border-ink/80 shadow-[4px_4px_0_0_var(--ink)]"
              >
                <img
                  src={s.imagem}
                  alt={s.album}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile preview strip */}
        <div className="lg:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {covers.slice(0, 8).map((s, i) => (
              <img
                key={i}
                src={s.imagem}
                alt={s.album}
                className="h-32 w-32 flex-shrink-0 border-2 border-ink object-cover shadow-[3px_3px_0_0_var(--ink)]"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
