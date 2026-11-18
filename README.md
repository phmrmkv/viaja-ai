# Viaja.ai

Página de demonstração da **Viaja.ai**, um assistente com IA que planeja viagens: a pessoa diz destino, datas, orçamento e estilo, e a IA monta um roteiro dia a dia, sugere onde ficar e o que levar, e ajusta o plano quando algo muda.

**O produto está em desenvolvimento e ainda não abre para uso.** Esta página é uma demonstração: o roteiro de Lisboa é um exemplo escrito à mão, os botões abrem avisos e o formulário da lista de espera não envia nem guarda nada.

Produto em desenvolvimento pela PHMR Tech Solutions (Paulo H. M. Rabelo).

Origem: começou como estudo de curso (Caravan, da Digital House). O site de estudo original segue no histórico do Git e em `referencias/original/`.

## Como rodar

```sh
npm install
npm run dev       # desenvolvimento
npm run check     # astro check (0 erros)
npm run build     # gera dist/
npm run preview   # serve dist/
```

## Stack

Astro (estático, TypeScript estrito) e Tailwind CSS 4. Sem React: diálogos e menu usam `<dialog>` e `<details>` nativos. Tema claro/escuro (chave `viaja-tema`), movimento conforme `docs/transicoes.md`.

O logo é tipográfico e provisório. Para regenerar favicon, ícone e `og-image.jpg`: `node scripts/gerar-marca.mjs`.

## Hospedagem

Site estático em `https://viaja.phmr.com.br` (Hostinger). Publicar o conteúdo de `dist/`; `public/.htaccess` cuida de HTTPS, cabeçalhos de segurança e cache.
