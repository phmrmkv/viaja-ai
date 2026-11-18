# Guia de transições — Viaja.ai (copiado do guia do ServiSindicância)

Base: transitions.dev (lido em 2026-11-17) + conhecimento geral, sempre marcado. O site não publica uma página de "princípios" nem de "durações/easing" em texto corrido; os valores vêm dos **tokens de cada transição** (páginas `/transitions/<nome>/`). Quando algo é nosso (não do site), está marcado como "(conhecimento geral, não está no transitions.dev)".

Páginas lidas:
- https://transitions.dev/ · https://transitions.dev/detail.html?doc=introduction · https://transitions.dev/detail.html?doc=accessibility · https://transitions.dev/skill.html · https://transitions.dev/transitions/
- https://transitions.dev/transitions/modal-open-close/ · /accordion/ · /toast-open-close/ · /menu-dropdown/ · /panel-reveal/ · /texts-reveal/ · /learn-more-hover/ · /3d-tilt/ · /error-state-shake/

## 1. Princípios

1. **Animar só propriedades baratas: `transform`, `opacity`, `filter`; `will-change` com moderação.** Fonte: https://transitions.dev/detail.html?doc=accessibility
2. **Evitar propriedades que forçam repaint** (o site cita `mask-position`); mover uma camada com `transform`. Fonte: https://transitions.dev/ e https://transitions.dev/detail.html?doc=introduction
3. **Um sistema de tokens para tudo** (duração, easing, distância, blur, escala), expostos como variáveis CSS ajustáveis; nada de duração fixa solta no código. Fonte: https://transitions.dev/detail.html?doc=introduction e https://transitions.dev/ (o agente do site sugere trocar `transition: all` por propriedades nomeadas e usar tokens em vez de valores fixos).
4. **Uma única curva suave de saída em todo o sistema:** `cubic-bezier(0.22, 1, 0.36, 1)` aparece em todas as transições lidas (modal, accordion, toast, dropdown, painel, texto, hover, tilt, shake). Fontes: as páginas `/transitions/...` listadas acima.
5. **Fechar é mais rápido que abrir:** modal 250 ms abre / 150 ms fecha; dropdown 250/150; toast 350/250; painel 400/350; accordion 250/250. Fonte: páginas modal-open-close, menu-dropdown, toast-open-close, panel-reveal, accordion.
6. **Entradas combinam movimento curto + opacidade + blur leve** (toast: 16 px, scale 0.97, blur 2 px; painel: blur 2 px; texto: 12 px, blur 3 px). Fontes: toast-open-close, panel-reveal, texts-reveal.
7. **Escala inicial discreta em overlays** (0.96 no modal, 0.97 no dropdown). Fontes: modal-open-close, menu-dropdown.
8. **Escalonamento curto entre linhas:** 40 ms por item (`calc(var(--stagger-stagger) * (N - 1))`). Fonte: https://transitions.dev/transitions/texts-reveal/
9. **Saída sem movimento reverso:** no reveal de texto, a saída só esmaece (200 ms, `ease`), sem refazer slide/blur. Fonte: https://transitions.dev/transitions/texts-reveal/
10. **Altura de accordion via `grid-template-rows: 0fr → 1fr`**, com `opacity` + `blur(2px)` no conteúdo interno e chevron por `scaleY`. Fonte: https://transitions.dev/transitions/accordion/
11. **Desmontar só depois da saída:** o modal usa estado `closed/open/closing` e espera `--modal-close-dur` antes de desmontar. Fonte: https://transitions.dev/transitions/modal-open-close/
12. **Hover pequeno e em CSS puro** (seta: desloca 2 px, abre 8°, 350 ms). Fonte: https://transitions.dev/transitions/learn-more-hover/
13. **Inclinação 3D: seguir o ponteiro rápido (400 ms), voltar devagar (1000 ms)**; wrapper plano como área de clique, só o filho inclina. Fonte: https://transitions.dev/transitions/3d-tilt/
14. **Erro:** tremida curta (6 px, ~280 ms), mensagem aparece por fade. Fonte: https://transitions.dev/transitions/error-state-shake/
15. **Acessibilidade:** ver seção 4 (fonte: https://transitions.dev/detail.html?doc=accessibility).

## 2. Tokens recomendados

Os valores marcados "(site)" são exatos do transitions.dev. Os marcados "(geral)" são complementos nossos (conhecimento geral, não está no transitions.dev), pois o site só publica a curva `0.22, 1, 0.36, 1`.

```css
@theme {
  /* Easing */
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);   /* (site) curva única de todas as transições */
  --ease-in-quick: cubic-bezier(0.4, 0, 1, 1);        /* (geral) saídas que "vão embora" */
  --ease-in-out-std: cubic-bezier(0.4, 0, 0.2, 1);    /* (geral) layout/redimensionar */

  /* Entrada (reveal ao rolar, painéis, texto) */
  --dur-enter: 400ms;          /* (site) painel abre 400 */
  --dur-enter-text: 500ms;     /* (site) texto 500 */
  --dur-stagger: 40ms;         /* (site) escalonamento */
  --distance-enter: 12px;      /* (site) texto 12; toast 16 */
  --blur-enter: 2px;           /* (site) 2-3px */

  /* Saída */
  --dur-exit: 150ms;           /* (site) modal e dropdown fecham em 150 */
  --dur-exit-panel: 350ms;     /* (site) painel fecha 350 */
  --dur-exit-fade: 200ms;      /* (site) saída só com fade */

  /* Hover / press */
  --dur-hover: 350ms;          /* (site) hover da seta 350 */
  --dur-hover-fast: 150ms;     /* (geral; o site usa 150ms ease-out na borda do input) */
  --dur-press: 100ms;          /* (geral) botão pressionado */
  --press-scale: 0.97;         /* (geral) */
  --card-lift: -4px;           /* (geral) elevação de card no hover */

  /* Layout (accordion, cabeçalho) */
  --dur-layout: 250ms;         /* (site) accordion expande/colapsa 250 */
  --dur-header: 250ms;         /* (geral) cabeçalho fixo ao rolar */

  /* Overlays (dialog, sheet, toast) */
  --dur-modal-open: 250ms;     /* (site) */
  --dur-modal-close: 150ms;    /* (site) */
  --modal-scale: 0.96;         /* (site) */
  --dur-toast-open: 350ms;     /* (site) */
  --dur-toast-close: 250ms;    /* (site) */
  --toast-distance: 16px;      /* (site) */
  --toast-scale: 0.97;         /* (site) */
  --dur-sheet-open: 300ms;     /* (geral) menu mobile lateral */
  --dur-sheet-close: 200ms;    /* (geral) */
}
```

Resumo por tipo: entrada 400-500 ms; saída 150-250 ms (fechar mais rápido); hover 150-350 ms; layout 250 ms; overlays 250/150 ms (dialog) e 350/250 ms (toast). Curva padrão `--ease-out-soft`.

## 3. Receitas por elemento

Evitar em todas: `transition: all`, animar `width/height/top/left/margin` e `box-shadow` em listas, `mask-position` (esses dois últimos do site: `transition: all` e `mask-position`; o resto é conhecimento geral, não está no transitions.dev).

### Cabeçalho fixo que muda ao rolar (geral)
Animar fundo (cor) e `transform`; não animar `height` (use padding fixo).
```css
.header { transition: background-color var(--dur-header) var(--ease-out-soft), transform var(--dur-header) var(--ease-out-soft); }
.header[data-scrolled="true"] { background-color: rgb(0 0 0 / .85); }
```
```js
const h = document.querySelector('.header');
addEventListener('scroll', () => { h.dataset.scrolled = String(scrollY > 8); }, { passive: true });
```

### Menu mobile (Sheet do shadcn)
Base do site: dropdown = scale + opacity, 250/150 ms (https://transitions.dev/transitions/menu-dropdown/). Para o Sheet lateral, ajuste nosso (geral): `translateX`.
```css
[data-slot="sheet-content"][data-state="open"]   { animation: sheet-in var(--dur-sheet-open) var(--ease-out-soft); }
[data-slot="sheet-content"][data-state="closed"] { animation: sheet-out var(--dur-sheet-close) var(--ease-in-quick); }
@keyframes sheet-in  { from { transform: translateX(100%); } }
@keyframes sheet-out { to   { transform: translateX(100%); } }
```
Animar só `transform`; o overlay só `opacity`.

### Reveal ao rolar (site: texts-reveal; o gatilho IntersectionObserver é geral)
Inicial: opacity 0, `translateY(12px)`, blur; final zerado, 500 ms; escalonamento 40 ms (https://transitions.dev/transitions/texts-reveal/).
```css
.reveal { opacity: 0; transform: translateY(var(--distance-enter)); filter: blur(var(--blur-enter));
  transition: opacity var(--dur-enter-text) var(--ease-out-soft), transform var(--dur-enter-text) var(--ease-out-soft), filter var(--dur-enter-text) var(--ease-out-soft);
  transition-delay: calc(var(--i, 0) * var(--dur-stagger)); }
.reveal.is-shown { opacity: 1; transform: none; filter: none; }
```
```js
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('is-shown'); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```
Anime uma vez só. Limite o escalonamento a cerca de 6 itens (geral).

### Hover de card de serviço
Site: hover pequeno em CSS puro, 350 ms (learn-more-hover). O tilt 3D (perspectiva 1000 px, segue 400 ms, volta 1000 ms) existe mas é opcional e pesado. Recomendado: elevar com `transform` e realçar a borda.
```css
.card { transition: transform var(--dur-hover) var(--ease-out-soft), border-color var(--dur-hover) var(--ease-out-soft); }
@media (hover: hover) { .card:hover { transform: translateY(var(--card-lift)); border-color: var(--color-gold-500); } }
```
Para sombra, anime a opacity de um `::after` (geral).

### Dialog (galeria de comunicados)
Site: scale 0.96 + opacity; abre 250 ms, fecha 150 ms; `pointer-events: none` fechado (https://transitions.dev/transitions/modal-open-close/).
```css
[data-slot="dialog-content"][data-state="open"]   { animation: dlg-in var(--dur-modal-open) var(--ease-out-soft); }
[data-slot="dialog-content"][data-state="closed"] { animation: dlg-out var(--dur-modal-close) var(--ease-out-soft) forwards; }
@keyframes dlg-in  { from { opacity: 0; scale: var(--modal-scale); } }
@keyframes dlg-out { to   { opacity: 0; scale: var(--modal-scale); } }
[data-slot="dialog-overlay"][data-state="open"]   { animation: fade-in var(--dur-modal-open) var(--ease-out-soft); }
[data-slot="dialog-overlay"][data-state="closed"] { animation: fade-out var(--dur-modal-close) var(--ease-out-soft) forwards; }
```
Uso da propriedade `scale` (em vez de `transform`) evita brigar com o `translate(-50%,-50%)` que o shadcn usa para centralizar (geral). Defina `fade-in`/`fade-out` (opacity) ou use as do `tw-animate-css`. O Radix espera o fim da `animation` antes de desmontar.

### Accordion (FAQ)
Site: `grid-template-rows 0fr → 1fr`, conteúdo com opacity + blur 2 px, chevron `scaleY(-1)`, tudo 250 ms (https://transitions.dev/transitions/accordion/).
```css
[data-slot="accordion-content"] { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-layout) var(--ease-out-soft); }
[data-slot="accordion-content"][data-state="open"] { grid-template-rows: 1fr; }
[data-slot="accordion-content"] > div { overflow: hidden; opacity: 0; filter: blur(2px); transition: opacity var(--dur-layout) var(--ease-out-soft), filter var(--dur-layout) var(--ease-out-soft); }
[data-slot="accordion-content"][data-state="open"] > div { opacity: 1; filter: blur(0); }
```
O shadcn padrão anima altura com `--radix-accordion-content-height` e `animate-accordion-*`; escolha uma das duas abordagens, não as duas. Se mantiver a do shadcn, aproveite só duração e curva dos tokens.

### Toast (feedback do formulário)
Site: opacity 0→1, `translateY(16px) scale(0.97)`, blur 2 px; abre 350 ms, fecha 250 ms; `role="status"` (https://transitions.dev/transitions/toast-open-close/).
```css
.toast { opacity: 0; transform: translateY(var(--toast-distance)) scale(var(--toast-scale)); filter: blur(2px);
  transition: opacity var(--dur-toast-close) var(--ease-out-soft), transform var(--dur-toast-close) var(--ease-out-soft), filter var(--dur-toast-close) var(--ease-out-soft); }
.toast.is-open { opacity: 1; transform: none; filter: none; transition-duration: var(--dur-toast-open); }
```
Se usar Sonner (shadcn), sobrescreva duração e curva por CSS e mantenha `role="status"`. Campo com erro: tremida de 6 px por ~280 ms e fade na mensagem (https://transitions.dev/transitions/error-state-shake/).

### Botão pressionado (geral)
```css
.btn { transition: transform var(--dur-press) var(--ease-out-soft), background-color var(--dur-hover-fast) var(--ease-out-soft); }
.btn:active { transform: scale(var(--press-scale)); }
```

## 4. Acessibilidade

Do site (https://transitions.dev/detail.html?doc=accessibility):
- Toda transição respeita `prefers-reduced-motion: reduce`: a animação some ou vira troca instantânea, e o resultado funcional acontece. O padrão do site é `transition: none !important` nas classes animadas (os estados finais continuam valendo).
- O estado vai sempre no DOM e no texto (`aria-expanded`, `role="status"`, `role="dialog"` com `aria-modal`), nunca só no movimento.
- Botões reais `<button>`, foco nativo preservado, operação total por teclado.
- Nas páginas individuais: o tilt 3D zera o `transform` no reduced-motion mas deixa o brilho esmaecer; a tremida de erro é desligada mas o fade da borda/mensagem continua.

Para nós (geral, não está no transitions.dev):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; scroll-behavior: auto !important; }
  .reveal { transform: none; filter: none; transition: opacity 150ms linear; }   /* manter só esmaecer curto */
  .card:hover { transform: none; }
}
```
- Desligar: deslocamentos, scale, blur, tilt, shake, stagger, parallax, rolagem suave.
- Manter: esmaecer curto (até 150 ms), mudança de cor/borda, indicador de foco.
- Não bloquear interação: não esperar o fim da animação para aceitar clique, teclado ou Esc; `pointer-events: none` só em estados fechados (como o site faz). `:focus-visible` nunca animado.

## 5. View Transitions API / Astro

As páginas lidas do transitions.dev **não falam** de View Transitions API nem de Astro (nem `ClientRouter`). Não há recomendação do site aqui. Como a landing é página única, nem é necessário. Se um dia houver várias páginas (conhecimento geral, não está no transitions.dev): usar `<ClientRouter />` (`import { ClientRouter } from 'astro:transitions'` no `<head>`) e `transition:animate="fade"` nos elementos; ilhas React que devem manter estado precisam de `transition:persist`; respeitar o mesmo reduced-motion (`::view-transition-group(*) { animation: none; }`).

## 6. Checklist para revisão

1. Nenhum `transition: all`; toda transição lista as propriedades.
2. Só `transform`, `opacity`, `filter` (e cor) animados; nenhum `width/height/top/left/margin`.
3. Duração e curva vêm dos tokens `--dur-*`/`--ease-*`, sem valores soltos no componente.
4. Saídas (fechar dialog, toast, sheet) são mais rápidas que as entradas.
5. Dialog 250/150 ms, accordion 250 ms, toast 350/250 ms conferem com a seção 2.
6. Existe bloco `@media (prefers-reduced-motion: reduce)` e, com ele ligado, não há deslocamento/scale/blur, só esmaecer curto.
7. `:focus-visible` aparece em botões, links, accordion, dialog; Tab percorre menu, dialog e FAQ.
8. Estado aberto/fechado está em `aria-expanded`/`data-state`, e o toast tem `role="status"`.
9. Reveal ao rolar anima uma vez só (observer desligado depois) e o conteúdo é legível sem JS.
10. Hover de card só dentro de `@media (hover: hover)`; no toque não fica "preso".
11. Nenhum `will-change` permanente em muitos elementos.
12. No celular, rolagem e reveal sem queda de quadros; o cabeçalho não muda de altura ao rolar.
