# Como adicionar/atualizar a planilha de músicas

Os dados do infográfico vêm do arquivo CSV em **`public/data/musicas.csv`**.

## Para trocar a planilha
1. Exporte sua planilha (Google Sheets / Excel) como **CSV (UTF-8)**.
2. Salve por cima de `public/data/musicas.csv`.
3. Recarregue o navegador — pronto.

## Colunas esperadas (cabeçalho da primeira linha)
```
MOVIMENTO, NOME, CANTOR, COMPOSITOR, ANO, ALBUM,
JUSTIFICATIVA, CENSURADA, JUSTIFICATIVA_CENSURA,
SPOTIFY, IMAGEM, FONTE
```

O parser também aceita os nomes originais do briefing:
- `ANO DE LANÇAMENTO`, `ÁLBUM`, `JUSTIFICATIVA DE ESCOLHA`
- `FOI CENSURADA?`, `FOI CENSURADA? (se sim, a justificativa)`
- `LINK NO SPOTIFY (PARA GERAR CÓDIGO qr ou tocar embedded)`
- `LINK PARA IMAGEM (CAPA DO ÁLBUM)`

## Observações
- **CENSURADA**: aceita `Sim`/`Não` (ou `S`/`N`, `true`/`false`).
- **SPOTIFY**: pode ser o link normal (`https://open.spotify.com/track/...`) — é convertido para embed automaticamente.
- **MOVIMENTO**: agrupa as músicas. Para adicionar um novo movimento, basta usar um nome novo nessa coluna. Para customizar o resumo do movimento, edite `MOVIMENTO_RESUMOS` em `src/lib/songs.ts`.
- O design está pensado para **3 músicas por movimento** (cards lado a lado), mas funciona com mais.
