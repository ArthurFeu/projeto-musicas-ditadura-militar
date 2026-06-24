import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { groupByMovimento, loadSongs, type Song } from "@/lib/songs";
import { SongModal } from "@/components/SongModal";

// Dicionário com os textos expandidos dos movimentos
const textosMovimentos: Record<string, string> = {
  "bossa-nova":
    "Maior movimento musical brasileiro da segunda metade do século XX, surgiu em 1958 entre jovens músicos da classe média carioca. Combinando elementos do samba e influências do jazz, é marcada por melodias suaves, harmonias sofisticadas e uma forma de cantar mais intimista.",
  "jovem-guarda":
    "Movimento musical e cultural que ganhou força na década de 1960. Inspiradas no rock and roll e na música pop internacional, suas canções eram voltadas ao público jovem e influenciaram a moda, o comportamento e o consumo da juventude da época.",
  "musicas-de-protesto":
    "Marcadas por letras de crítica social e política, ganharam destaque principalmente durante o período da ditadura militar no Brasil. As canções abordam temas como censura, repressão, desigualdade e defesa da democracia, recorrendo frequentemente a metáforas para driblar a censura.",
  "musica-de-protesto":
    "Marcadas por letras de crítica social e política, ganharam destaque principalmente durante o período da ditadura militar no Brasil. As canções abordam temas como censura, repressão, desigualdade e defesa da democracia, recorrendo frequentemente a metáforas para driblar a censura.",
  tropicalia:
    "Movimento cultural e musical que surgiu no fim da década de 1960 propondo uma renovação da música popular brasileira. Misturava ritmos nacionais, como samba e baião, com influências do rock, da música psicodélica e de outros estilos internacionais. Defendia a liberdade criativa, valorizava a diversidade cultural e também representava uma forma de contestação política e cultural.",
};

export const Route = createFileRoute("/movimento/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Músicas da Ditadura` },
      {
        name: "description",
        content: `Canções do movimento ${params.slug} durante a Ditadura Militar brasileira.`,
      },
    ],
  }),
  component: MovimentoPage,
});

function MovimentoPage() {
  const { slug } = Route.useParams();
  const { data: songs = [], isLoading } = useQuery({ queryKey: ["songs"], queryFn: loadSongs });
  const movimentos = groupByMovimento(songs);
  const movimento = movimentos.find((m) => m.slug === slug);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Previne o scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (selectedSong) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedSong]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 font-typewriter text-sm uppercase tracking-widest">
        Carregando arquivo…
      </main>
    );
  }
  if (!movimento) throw notFound();

  const idx = movimentos.findIndex((m) => m.slug === slug);
  const prev = movimentos[(idx - 1 + movimentos.length) % movimentos.length];
  const next = movimentos[(idx + 1) % movimentos.length];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 relative">
      <Link
        to="/visao-geral"
        className="font-typewriter text-[11px] uppercase tracking-widest text-crimson hover:underline"
      >
        ← Voltar à visão geral
      </Link>

      <header className="mt-6 border-b-2 border-ink pb-8">
        <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-crimson">
          Movimento 0{idx + 1} de {movimentos.length}
        </p>
        <h1 className="mt-2 font-display text-5xl md:text-7xl">{movimento.nome}</h1>
        <p className="mt-4 max-w-2xl font-serif text-xl italic text-ink/80">{movimento.resumo}</p>

        {/* TEXTO EXCLUSIVO PARA MOBILE (Escondido em Telas Médias ou Maiores) */}
        {textosMovimentos[slug] && (
          <div className="mt-6 block md:hidden border-t-2 border-dashed border-ink/20 pt-6">
            <p className="font-typewriter text-xs uppercase tracking-widest text-crimson mb-3">
              Sobre o movimento
            </p>
            <p className="font-mono text-base leading-relaxed text-ink/90">
              {textosMovimentos[slug]}
            </p>
          </div>
        )}
      </header>

      <section className="grid gap-6 py-12 sm:grid-cols-2 md:grid-cols-3">
        {movimento.songs.map((song) => (
          <SongCard key={song.nome} song={song} onClick={() => setSelectedSong(song)} />
        ))}
      </section>

      <nav className="mt-8 flex items-center justify-between border-t-2 border-ink/40 pt-6 font-typewriter text-xs uppercase tracking-widest">
        <Link to="/movimento/$slug" params={{ slug: prev.slug }} className="hover:text-crimson">
          ← {prev.nome}
        </Link>
        <Link to="/movimento/$slug" params={{ slug: next.slug }} className="hover:text-crimson">
          {next.nome} →
        </Link>
      </nav>

      {/* Modal Render */}
      <AnimatePresence>
        {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
      </AnimatePresence>
    </main>
  );
}

function SongCard({ song, onClick }: { song: Song; onClick: () => void }) {
  return (
    <article className="relative border-2 border-ink bg-card shadow-[5px_5px_0_0_var(--ink)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--ink)]">
      <button
        onClick={onClick}
        className="block w-full text-left h-full flex flex-col cursor-pointer"
      >
        <div className="relative aspect-square w-full overflow-hidden border-b-2 border-ink">
          {song.imagem ? (
            <img
              src={song.imagem}
              alt={song.album}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-ochre/30 font-display text-3xl">
              ♪
            </div>
          )}
          {song.censurada && (
            <span className="absolute right-3 top-3 stamp bg-paper text-sm border-crimson text-crimson">
              Censurada
            </span>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <p className="font-typewriter text-[11px] uppercase tracking-widest text-muted-foreground">
              {song.ano} · {song.album}
            </p>
            <h3 className="mt-1 font-display text-2xl leading-tight">{song.nome}</h3>
            <p className="mt-1 font-serif italic text-ink/80">{song.cantor}</p>
          </div>
          <p className="mt-4 font-typewriter text-[11px] uppercase tracking-widest text-crimson">
            Ver detalhes
          </p>
        </div>
      </button>
    </article>
  );
}
