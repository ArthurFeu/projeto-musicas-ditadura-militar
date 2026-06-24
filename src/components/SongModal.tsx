import { motion } from "framer-motion";
import { type Song } from "@/lib/songs"; // Ajuste este caminho se necessário

interface SongModalProps {
  song: Song;
  onClose: () => void;
}

export function SongModal({ song, onClose }: SongModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Overlay Escurecido */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-paper/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Conteúdo do Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-ink bg-card shadow-[8px_8px_0_0_var(--ink)]"
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center font-typewriter text-xl text-ink transition-colors hover:bg-crimson hover:text-paper cursor-pointer"
          aria-label="Fechar modal"
        >
          ×
        </button>

        <div className="grid md:grid-cols-[280px_1fr] md:min-h-[500px]">
          {/* Coluna da Imagem */}
          <div className="relative aspect-square w-full border-b-2 border-ink md:border-b-0 md:border-r-2 md:aspect-auto">
            {song.imagem ? (
              <img
                src={song.imagem}
                alt={song.album || song.nome}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-ochre/30 font-display text-5xl">
                ♪
              </div>
            )}

            {/* Carimbo sobre a imagem (Apenas se for censurada) */}
            {song.censurada && (
              <span className="absolute left-4 top-4 stamp bg-paper text-sm border-crimson text-crimson">
                Censurada
              </span>
            )}
          </div>

          {/* Coluna das Informações */}
          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-col gap-6 flex-1">
              {/* Título e Cantor (Opcional, mas bom ter no modal já que a imagem pode não ter o nome) */}
              <div>
                <h2 className="font-display text-3xl sm:text-4xl leading-none text-ink">
                  {song.nome}
                </h2>
                <p className="font-serif text-lg italic text-ink/80 mt-2">{song.cantor}</p>
              </div>

              {/* 1. Spotify Player */}
              <div className="w-full">
                <p className="mb-3 font-typewriter text-[11px] uppercase tracking-widest text-crimson flex items-center gap-2">
                  ▶ Ouça no Spotify
                </p>
                {song.spotify ? (
                  <div className="w-full">
                    <iframe
                      title={song.nome}
                      src={song.spotify}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="block border-0 bg-transparent"
                    />
                  </div>
                ) : (
                  <p className="font-typewriter text-xs border-2 border-dashed border-ink/40 p-4 text-center text-ink/60">
                    Sem link do Spotify disponível.
                  </p>
                )}
              </div>

              {/* 2. Compositor */}
              {song.compositor && (
                <div className="flex items-baseline gap-2">
                  <span className="font-typewriter text-[11px] uppercase tracking-widest text-crimson">
                    Compositor:
                  </span>
                  <span className="font-mono text-base text-ink/90">{song.compositor}</span>
                </div>
              )}

              {/* 3. Justificativa de Escolha */}
              {song.justificativa && (
                <div className="flex flex-col gap-2">
                  <p className="font-typewriter text-[11px] uppercase tracking-widest text-crimson">
                    Por que escolhemos esta canção?
                  </p>
                  <p className="font-mono text-base leading-relaxed text-ink/90">
                    {song.justificativa}
                  </p>
                </div>
              )}

              {/* 4. Censura ou Parecer (A lógica que criamos juntos) */}
              {song.justificativaCensura &&
                (song.censurada ? (
                  // ======= FORMATO: CENSURADA (VETADA) =======
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-typewriter text-[11px] uppercase tracking-widest text-crimson">
                        Censura
                      </p>
                      <span className="stamp text-[9px] text-crimson border-crimson">vetada</span>
                    </div>
                    <p className="font-mono text-base leading-relaxed text-ink/90">
                      {song.justificativaCensura}
                    </p>
                  </div>
                ) : (
                  // ======= FORMATO: NÃO CENSURADA (LIBERADA) =======
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-typewriter text-[11px] uppercase tracking-widest text-emerald-700">
                        Parecer da Censura
                      </p>
                      <span className="stamp text-[9px] border-emerald-700 text-emerald-700">
                        liberada
                      </span>
                    </div>
                    <p className="font-mono text-sm leading-relaxed text-ink/70 italic">
                      {song.justificativaCensura}
                    </p>
                  </div>
                ))}

              {/* 5. Fonte */}
              {song.fonte && (
                <div className="flex flex-col gap-1 mt-2">
                  <p className="font-typewriter text-[11px] uppercase tracking-widest text-crimson">
                    Fonte:
                  </p>
                  <p className="font-typewriter text-xs text-ink/70 break-all sm:break-normal">
                    {song.fonte}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
