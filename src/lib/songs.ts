import Papa from "papaparse";

export type Song = {
  movimento: string;
  nome: string;
  cantor: string;
  compositor: string;
  ano: string;
  album: string;
  justificativa: string;
  censurada: boolean;
  justificativaCensura: string;
  spotify: string;
  imagem: string;
  fonte: string;
};

export type Movimento = {
  slug: string;
  nome: string;
  resumo: string;
  songs: Song[];
};

/**
 * Resumos curtos por movimento. Adicione/edite aqui quando incluir novos
 * movimentos na planilha (public/data/musicas.csv).
 */
export const MOVIMENTO_RESUMOS: Record<string, string> = {
  Tropicalismo:
    "Movimento de ruptura iniciado em 1967 nos festivais da TV. Misturou guitarra elétrica, poesia concreta e crítica ao Brasil arcaico — Caetano e Gil acabariam exilados em 1969.",
  "MPB de Protesto":
    "A canção engajada como trincheira. Letras cifradas, metáforas e duplos sentidos para denunciar a tortura, a censura e clamar pela redemocratização.",
  "Vanguarda Paulista":
    "Cena paulistana dos anos 80 que radicalizou a experimentação sonora durante a abertura. Linguagem fragmentada como recusa às narrativas oficiais.",
  "Samba de Resistência":
    "O samba como crônica do regime — do golpe de 64 à anistia. Pseudônimos, ironia e versos que viraram hinos populares contra o autoritarismo.",
};

function parseBool(v: string): boolean {
  return /^s|sim|yes|true|1$/i.test(v.trim());
}

function toEmbed(url: string): string {
  if (!url) return "";

  url = url.replace("/intl-pt", "").trim();
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  return url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function loadSongs(): Promise<Song[]> {
  const res = await fetch("/data/musicas.csv");
  const text = await res.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data.map((r) => ({
    movimento: r["MOVIMENTO"] ?? "",
    nome: r["NOME"] ?? "",
    cantor: r["CANTOR"] ?? "",
    compositor: r["COMPOSITOR"] ?? "",
    ano: r["ANO"] ?? r["ANO DE LANÇAMENTO"] ?? "",
    album: r["ALBUM"] ?? r["ÁLBUM"] ?? "",
    justificativa: r["JUSTIFICATIVA"] ?? r["JUSTIFICATIVA DE ESCOLHA"] ?? "",
    censurada: parseBool(r["CENSURADA"] ?? r["FOI CENSURADA?"] ?? ""),
    justificativaCensura:
      r["JUSTIFICATIVA_CENSURA"] ?? r["FOI CENSURADA? (se sim, a justificativa)"] ?? "",
    spotify: toEmbed(
      r["SPOTIFY"] ?? r["LINK NO SPOTIFY (PARA GERAR CÓDIGO qr ou tocar embedded)"] ?? null,
    ),
    imagem: r["IMAGEM"] ?? r["LINK PARA IMAGEM (CAPA DO ÁLBUM)"] ?? "",
    fonte: r["FONTE"] ?? "",
  }));
}

export function groupByMovimento(songs: Song[]): Movimento[] {
  const map = new Map<string, Song[]>();
  for (const s of songs) {
    if (!s.movimento) continue;
    const arr = map.get(s.movimento) ?? [];
    arr.push(s);
    map.set(s.movimento, arr);
  }
  return Array.from(map.entries()).map(([nome, songs]) => ({
    nome,
    slug: slugify(nome),
    resumo: MOVIMENTO_RESUMOS[nome] ?? "",
    songs,
  }));
}
