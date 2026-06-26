import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { loadSongs, type Song } from "@/lib/songs";
import { motion, AnimatePresence } from "framer-motion";
import { SongModal } from "@/components/SongModal";

export const Route = createFileRoute("/acervo")({
  head: () => ({
    meta: [
      { title: "Acervo de Músicas: Músicas da Ditadura" },
      { name: "description", content: "Lista completa de canções arquivadas." },
    ],
  }),
  component: AcervoPage,
});

const ITEMS_PER_PAGE = 8;

function AcervoPage() {
  const { data: songs = [], isLoading } = useQuery({ queryKey: ["songs"], queryFn: loadSongs });

  // Estados para filtro, busca, paginação e modal
  const [filterMovimento, setFilterMovimento] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 font-typewriter text-sm uppercase tracking-widest">
        Carregando arquivo…
      </main>
    );
  }

  // Extrair movimentos únicos para o select
  const movimentosUnicos = Array.from(new Set(songs.map((s) => s.movimento).filter(Boolean)));

  // Lógica de filtragem combinada (Movimento + Texto)
  const filteredSongs = songs
    .filter((s) => {
      // 1. Verifica o movimento
      const matchMovimento = filterMovimento === "Todos" || s.movimento === filterMovimento;

      // 2. Verifica a busca por texto (nome ou cantor)
      const searchLower = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        s.nome?.toLowerCase().includes(searchLower) ||
        s.cantor?.toLowerCase().includes(searchLower);

      return matchMovimento && matchSearch;
    })
    .sort((a, b) => (a.nome ?? "").localeCompare(b.nome ?? ""));

  // Lógica de paginação
  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSongs = filteredSongs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers para os inputs
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterMovimento(e.target.value);
    setCurrentPage(1); // Reseta paginação
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reseta paginação
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Cabeçalho */}
      <header className="mb-10 border-b-2 border-ink pb-8">
        <p className="font-typewriter text-xs uppercase tracking-[0.3em] text-crimson">
          Arquivo Completo
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Acervo Musical</h1>
      </header>

      {/* Barra de Filtros e Busca */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Input de Busca */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por música ou cantor..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full appearance-none border-2 border-ink bg-paper py-3 px-4 font-typewriter text-xs uppercase tracking-widest text-ink placeholder:text-ink/50 transition-colors focus:outline-none focus:ring-0 shadow-[4px_4px_0_0_var(--ink)]"
          />
        </div>

        {/* Select de Movimento */}
        <div className="relative min-w-[240px]">
          <select
            value={filterMovimento}
            onChange={handleFilterChange}
            className="w-full appearance-none border-2 border-ink bg-paper py-3 pl-4 pr-12 font-typewriter text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper focus:outline-none focus:ring-0 cursor-pointer shadow-[4px_4px_0_0_var(--ink)]"
          >
            <option value="Todos">Filtrar por movimento</option>
            {movimentosUnicos.map((mov) => (
              <option key={mov} value={mov}>
                {mov}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-current">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lista de Músicas */}
      <div className="flex flex-col gap-4">
        {paginatedSongs.length > 0 ? (
          paginatedSongs.map((song) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={song.id || song.nome}
              onClick={() => setSelectedSong(song)} // <--- Abre o modal ao clicar
              className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-2 border-ink bg-card p-4 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--ink)] cursor-pointer"
            >
              {/* Capa */}
              <div className="h-16 w-16 shrink-0 border-2 border-ink bg-paper overflow-hidden">
                {song.imagem ? (
                  <img
                    src={song.imagem}
                    alt={song.album}
                    className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-ochre/30 font-display text-2xl">
                    ♪
                  </div>
                )}
              </div>

              {/* Nome & Cantor */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-2xl leading-none truncate" title={song.nome}>
                  {song.nome}
                </h3>
                <p className="font-serif text-sm italic text-ink/80 mt-1 truncate">{song.cantor}</p>
              </div>

              {/* Movimento */}
              <div className="sm:w-48 sm:text-right">
                <span className="font-typewriter text-[10px] sm:text-[11px] uppercase tracking-widest text-crimson">
                  {song.movimento || "Não classificado"}
                </span>
              </div>

              {/* Ano */}
              <div className="sm:w-16 sm:text-right">
                <span className="font-display text-xl">{song.ano}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-ink/40">
            <p className="font-typewriter text-xs uppercase tracking-widest text-muted-foreground">
              Nenhuma música encontrada para este filtro.
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {/* ... Código da paginação original mantido intacto ... */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper font-display transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 disabled:hover:bg-paper disabled:hover:text-ink"
          >
            ←
          </button>

          <div className="flex items-center gap-2 px-4">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-3 w-3 rounded-full border-2 border-ink transition-colors ${
                    currentPage === pageNum ? "bg-ink" : "bg-transparent hover:bg-ink/40"
                  }`}
                  aria-label={`Ir para a página ${pageNum}`}
                />
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper font-display transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 disabled:hover:bg-paper disabled:hover:text-ink"
          >
            →
          </button>
        </div>
      )}

      {/* MODAL: Renderiza se houver uma música selecionada */}
      <AnimatePresence>
        {selectedSong && <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />}
      </AnimatePresence>
    </main>
  );
}
