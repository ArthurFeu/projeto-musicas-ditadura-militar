import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { loadSongs, type Song } from "@/lib/songs";
import { motion, AnimatePresence } from "framer-motion";
import { SongModal } from "@/components/SongModal";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Linha do Tempo: Músicas da Ditadura" },
      { name: "description", content: "Análise visual e cronológica do arquivo." },
    ],
  }),
  component: TimelinePage,
});

const timelineContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function TimelinePage() {
  const { data: songs = [], isLoading } = useQuery({
    queryKey: ["songs"],
    queryFn: loadSongs,
  });

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const songsByYear = useMemo(() => {
    const grouped = songs.reduce(
      (acc, song) => {
        const year = song.ano || "Desconhecido";
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(song);
        return acc;
      },
      {} as Record<string, Song[]>,
    );

    return Object.keys(grouped)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = grouped[key];
          return acc;
        },
        {} as Record<string, Song[]>,
      );
  }, [songs]);

  const years = Object.keys(songsByYear);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 font-typewriter text-sm uppercase tracking-widest text-ink">
        Processando dados do arquivo...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-16 border-b-4 border-double border-ink pb-8">
        <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-crimson">
          Ditadura Militar brasileira (1964–1985)
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl text-ink">Linha do Tempo</h1>
      </header>

      <section className="mb-12">
        <motion.div
          variants={timelineContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative ml-4 border-l-2 border-ink pl-8 md:ml-8 md:pl-12"
        >
          {years.map((year) => (
            <motion.div variants={itemVariants} key={year} className="relative mb-16">
              <div className="absolute -left-[41px] top-2 h-5 w-5 rounded-full border-2 border-ink bg-ink md:-left-[57px]" />

              <h2 className="mb-6 inline-block border-2 border-ink bg-ink px-6 py-2 font-display text-2xl text-paper shadow-[4px_4px_0_0_var(--ink)] translate-x-[-2px] translate-y-[-2px]">
                {year}
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {songsByYear[year].map((song) => (
                  <div
                    key={song.id || song.nome}
                    onClick={() => setSelectedSong(song)}
                    className="group cursor-pointer flex flex-col border-2 border-ink bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)]"
                  >
                    <div className="mb-4 flex items-start justify-between border-b-2 border-dashed border-ink/30 pb-4">
                      <div className="min-w-0 flex-1 pr-4">
                        <h3 className="font-display text-2xl leading-tight text-ink whitespace-normal break-words">
                          {song.nome}
                        </h3>
                        <p className="mt-1 font-typewriter text-sm italic text-ink/80">
                          {song.cantor}
                        </p>
                        <span className="shrink-0 bg-ink px-2 py-1 font-typewriter text-[10px] uppercase text-paper">
                          {song.movimento}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex-1">
                      <span className="font-typewriter text-xs uppercase tracking-widest text-ink/80">
                        Status
                      </span>
                      <div
                        className={`mt-2 h-auto border-l-2 pl-4 ${
                          song.censurada ? "border-crimson" : "border-ink"
                        }`}
                      >
                        <p
                          className={`mb-1 font-typewriter text-sm font-bold uppercase ${
                            song.censurada ? "text-crimson" : "text-ink"
                          }`}
                        >
                          {song.censurada ? "CENSURADA" : "LIBERADA"}
                        </p>
                        <p className="hidden md:block font-typewriter text-sm leading-relaxed text-ink/70">
                          {song.justificativaCensura}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
      </AnimatePresence>
    </main>
  );
}
