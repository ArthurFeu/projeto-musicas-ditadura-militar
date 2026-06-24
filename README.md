# GERAL + FERRAMENTAS

## Resumo

É uma aplicação web desenvolvida em **React + TypeScript**, com construção rápida utilizando **Vite** e suporte para leitura de dados em **CSV**.

### React

Biblioteca utilizada para construir a interface do site por meio de componentes reutilizáveis. É o responsável por montar as páginas e atualizar dinamicamente os elementos exibidos na tela.

### TypeScript

Extensão do JavaScript que adiciona tipagem ao código, reduzindo erros e facilitando a manutenção e compreensão da aplicação.

### Vite

Ferramenta de desenvolvimento responsável por iniciar rapidamente o projeto durante o desenvolvimento e gerar a versão final otimizada para publicação.

### Hospedagem

O projeto foi publicado utilizando o **Vercel**, plataforma gratuita que permite a implantação rápida de aplicações web.

### Criação Inicial

A base inicial do projeto foi criada com o **Lovable**, uma ferramenta de desenvolvimento assistida por inteligência artificial voltada para aplicações front-end.

A partir de uma estrutura básica gerada com base nos desenhos produzidos no Excalidraw e em um prompt detalhado descrevendo a arquitetura desejada, a aplicação foi sendo adaptada conforme as necessidades do projeto.

#### Prompt original

> Tenho um csv para o projeto "Músicas da Ditadura" com as seguintes colunas:
>
> MOVIMENTO, NOME, CANTOR, COMPOSITOR, ANO DE LANÇAMENTO, ÁLBUM, JUSTIFICATIVA DE ESCOLHA, FOI CENSURADA?, FOI CENSURADA? (se sim, a justificativa), LINK NO SPOTIFY (PARA GERAR CÓDIGO qr ou tocar embedded), LINK PARA IMAGEM (CAPA DO ÁLBUM) e FONTE.
>
> Quero montar um infográfico em página web RESPONSIVA. O infográfico terá as seguintes características:
>
> * Página principal com visão geral
> * Página por movimento (são 4, com 3 músicas cada)
>
> Faça um código com separação fácil por página e com um fácil acesso para adicionar uma planilha nova.

---

# PAGINAÇÃO

Ao final do desenvolvimento foram criadas páginas de acordo com o desenho estruturado no Excalidraw.
A aplicação possui quatro páginas principais:

* **Index** (Página Principal)
* **Visão Geral**
* **Movimento** (renderizada dinamicamente de acordo com o movimento selecionado)
* **Acervo** (catálogo completo de músicas)

## TanStack

Para a organização e renderização das telas foi utilizado o ecossistema **TanStack**, responsável pela estrutura da aplicação, navegação e gerenciamento de dados.

### TanStack Start

Fornece a estrutura-base do projeto para aplicações React.

### TanStack Router

Responsável pelo gerenciamento de rotas e navegação entre as páginas.

### TanStack Query

Gerencia os dados carregados da aplicação, como a planilha de músicas, oferecendo cache automático e melhor desempenho.

---

# FORMATAÇÃO DAS MÚSICAS

Os dados foram estruturados para permitir fácil manutenção, inclusão de novas músicas e expansão futura do sistema.

Para exibir informações detalhadas de cada música foi criado o componente **SongModal**.

Cada linha do arquivo CSV representa uma música. Durante a leitura da planilha, os dados são convertidos para a seguinte estrutura:

```ts
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
```

## Leitura e Conversão do CSV

A conversão dos dados é realizada utilizando a biblioteca **PapaParse**, responsável por ler o arquivo `musicas.csv` e transformá-lo em objetos utilizáveis pela aplicação.

```ts
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
    justificativa:
      r["JUSTIFICATIVA"] ??
      r["JUSTIFICATIVA DE ESCOLHA"] ??
      "",
    censurada: parseBool(
      r["CENSURADA"] ??
      r["FOI CENSURADA?"] ??
      ""
    ),
    justificativaCensura:
      r["JUSTIFICATIVA_CENSURA"] ??
      r["FOI CENSURADA? (se sim, a justificativa)"] ??
      "",
    spotify: toEmbed(
      r["SPOTIFY"] ??
      r["LINK NO SPOTIFY (PARA GERAR CÓDIGO qr ou tocar embedded)"] ??
      null
    ),
    imagem:
      r["IMAGEM"] ??
      r["LINK PARA IMAGEM (CAPA DO ÁLBUM)"] ??
      "",
    fonte: r["FONTE"] ?? "",
  }));
}
```

Essa abordagem permite que novas planilhas sejam incorporadas ao projeto sem necessidade de alterações significativas na lógica da aplicação, desde que mantenham a estrutura esperada das colunas.

