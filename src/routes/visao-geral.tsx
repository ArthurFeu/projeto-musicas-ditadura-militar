import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { groupByMovimento, loadSongs, type Movimento } from "@/lib/songs";

// Dicionário com os textos fornecidos.
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

export const Route = createFileRoute("/visao-geral")({
  head: () => ({
    meta: [
      { title: "Visão geral — Músicas da Ditadura" },
      {
        name: "description",
        content:
          "Panorama da MPB durante a Ditadura Militar brasileira (1964–1985) e seus quatro movimentos de resistência.",
      },
    ],
  }),
  component: VisaoGeral,
});

// Extraímos o texto original para não duplicar o código nas versões Mobile e Desktop
const TextoPadrao = () => (
  <>
    <p className="font-serif text-xl italic text-ink/80">
      Acesse a playlist completa{" "}
      <a
        href="https://open.spotify.com/playlist/7nJNDDIocnrV5EpVvNO0rz?si=b468a06aecd84a43"
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-600 hover:text-red-700 underline"
      >
        aqui
      </a>
    </p>
    <p className="text-2xl first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.85] first-letter:text-crimson">
      Durante o período da Ditadura Militar no Brasil, a expressão musical foi uma poderosa
      ferramenta de resistência e denúncia social.
    </p>
    <p>
      Em um cenário de forte opressão, artistas de diferentes movimentos musicais usaram de
      metáforas, poesia e ritmos para driblar a censura, questionar a violência do regime e manter
      vivo o debate político.
    </p>
    <p>
      Neste infográfico, buscamos explorar alguns movimentos e canções que foram relevantes para o
      cenário político e cultural do período, ressaltando a importância das criações musicais na
      elaboração e permanência de memória social.
    </p>
    <div className="border-l-4 border-crimson pl-6 font-typewriter text-sm uppercase tracking-widest text-ink/70">
      "Podem me prender, podem me bater, mas eu não mudo de opinião." — Zé Keti, 1964
    </div>
  </>
);

function VisaoGeral() {
  const { data: songs = [] } = useQuery({ queryKey: ["songs"], queryFn: loadSongs });
  const movimentos = groupByMovimento(songs);
  const [hover, setHover] = useState<Movimento | null>(null);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="grid gap-6 border-b-2 border-ink pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-crimson"></p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Visão geral</h1>
        </div>
        <p className="font-serif text-lg italic text-ink/70">
          Ditadura Militar brasileira <span className="text-crimson">(1964–1985)</span>
        </p>
      </header>

      <section className="grid gap-12 py-12 lg:grid-cols-2">
        {/* Coluna de Texto */}
        <article className="font-mono text-lg leading-relaxed text-ink/95 lg:min-h-[420px]">
          {/* MOBILE: Exibe apenas o texto fixo, escondido no desktop */}
          <div className="block lg:hidden space-y-6">
            <TextoPadrao />
          </div>

          {/* DESKTOP: Exibe a animação com hover, escondido no mobile */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              {!hover ? (
                <motion.div
                  key="default-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <TextoPadrao />
                </motion.div>
              ) : (
                <motion.div
                  key={hover.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-crimson">
                    Sobre o movimento
                  </p>
                  <h2 className="font-display text-5xl md:text-6xl text-ink">{hover.nome}</h2>
                  <p className="text-2xl first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.85] first-letter:text-crimson">
                    {textosMovimentos[hover.slug] || hover.resumo}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </article>

        {/* Coluna Interativa (Navegação) */}
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 mt-6 lg:mt-0">
          {/* MOBILE: Lista de botões simples empilhados */}
          <div className="flex flex-col gap-4 lg:hidden">
            <p className="font-typewriter text-sm uppercase tracking-widest text-muted-foreground text-center mb-2">
              Selecione um movimento
            </p>
            {movimentos.map((m, i) => (
              <Link
                key={m.slug}
                to="/movimento/$slug"
                params={{ slug: m.slug }}
                className="group flex flex-col items-center justify-center border-2 border-ink bg-paper p-5 text-center shadow-[4px_4px_0_0_var(--ink)] active:translate-y-1 active:shadow-none transition-all"
              >
                <span className="font-typewriter text-[11px] uppercase tracking-widest text-crimson">
                  Movimento 0{i + 1}
                </span>
                <h3 className="mt-1 font-display text-2xl">{m.nome}</h3>
              </Link>
            ))}
          </div>

          {/* DESKTOP: Leque de Cartões Animados */}
          <div className="hidden lg:flex flex-col items-center w-full">
            <p className="font-typewriter text-[20px] uppercase tracking-widest text-muted-foreground text-center">
              Navegue pelos movimentos musicais.
            </p>

            <div className="relative mt-0 md:h-[250px] w-full flex items-end justify-center px-4 overflow-visible">
              {movimentos.map((m, i) => {
                const total = movimentos.length;
                const spanAngle = 114;
                const startAngle = -(spanAngle / 2);
                const angle = startAngle + (spanAngle / (total - 1)) * i;

                return (
                  <Link
                    key={m.slug}
                    to="/movimento/$slug"
                    params={{ slug: m.slug }}
                    onMouseEnter={() => setHover(m)}
                    onMouseLeave={() => setHover(null)}
                    className="group absolute bottom-0 left-1/2 origin-[50%_120%] z-10 transition-transform duration-300"
                    style={{
                      transform: `translateX(-50%) rotate(${angle}deg)`,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -15, zIndex: 30 }}
                      className={`flex flex-col items-center justify-between border-2 border-ink transition-all duration-300 shadow-[4px_4px_0_0_var(--ink)] overflow-hidden p-4
                      ${hover?.slug === m.slug ? "bg-crimson text-paper" : "bg-paper text-ink"}
                      w-[150px] h-[220px]`}
                    >
                      <div className="w-full flex items-center justify-start">
                        <span className="font-typewriter text-xs opacity-80 group-hover:text-ochre">
                          0{i + 1}
                        </span>
                      </div>

                      <div className="flex-1 w-full flex items-center justify-center">
                        <h3 className="w-full text-center font-display leading-tight text-[20px] line-clamp-4">
                          {m.nome}
                        </h3>
                      </div>

                      <div className="w-full text-center border-t border-current pt-1 mt-1 opacity-70">
                        <p className="font-typewriter text-[10px]">EXPLORAR →</p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            <motion.div
              key={hover?.slug ?? "empty"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-30 min-h-[120px] w-full border-2 border-dashed border-ink/40 bg-card p-5 flex flex-col justify-center items-center"
            >
              {hover ? (
                <>
                  <p className="stamp text-xl">{hover.songs.length} músicas arquivadas</p>
                  <p className="mt-3 font-typewriter text-xs uppercase tracking-widest text-crimson">
                    Clique no card para abrir o acervo
                  </p>
                </>
              ) : (
                <p className="font-typewriter text-xs uppercase tracking-widest text-muted-foreground text-center">
                  Selecione um movimento acima para ver os detalhes
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
