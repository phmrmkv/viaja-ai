// Interações da página (docs/transicoes.md). Tudo aqui é melhoria: se este arquivo
// não carregar, a página continua funcionando com links e CSS puros.
import { avisarDemonstracao } from '@/lib/validacao';

const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Curva do sistema, cubic-bezier(0.22, 1, 0.36, 1), resolvida por Newton-Raphson
// para a rolagem por JS seguir a mesma sensação das transições em CSS.
function curvaSuave(t: number): number {
  const x1 = 0.22, y1 = 1, x2 = 0.36, y2 = 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const dsx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const d = dsx(u);
    if (Math.abs(d) < 1e-6) break;
    u -= (sx(u) - t) / d;
  }
  u = Math.min(1, Math.max(0, u));
  return ((ay * u + by) * u + cy) * u;
}

let rolagemAtual = 0;
function rolarAte(y: number, aoTerminar?: () => void) {
  cancelAnimationFrame(rolagemAtual);
  const inicio = window.scrollY;
  const distancia = y - inicio;
  if (Math.abs(distancia) < 2) {
    window.scrollTo(0, y);
    aoTerminar?.();
    return;
  }
  // 450 a 900 ms conforme a distância. Com movimento reduzido, continua suave, mas curta (300 ms).
  const duracao = reduzido() ? 300 : Math.min(900, Math.max(450, Math.abs(distancia) * 0.25));
  const t0 = performance.now();
  const passo = (agora: number) => {
    const p = Math.min(1, (agora - t0) / duracao);
    window.scrollTo(0, inicio + distancia * curvaSuave(p));
    if (p < 1) rolagemAtual = requestAnimationFrame(passo);
    else aoTerminar?.();
  };
  rolagemAtual = requestAnimationFrame(passo);
}

for (const ev of ['wheel', 'touchstart', 'keydown'] as const) {
  window.addEventListener(ev, () => cancelAnimationFrame(rolagemAtual), { passive: true });
}

// Âncoras internas (ex.: "Pular para o conteúdo"): rolagem suave com a curva do sistema e foco no destino.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  const id = decodeURIComponent(link.hash.slice(1));
  const alvo = id ? document.getElementById(id) : null;
  if (!alvo) return;
  e.preventDefault();
  history.pushState(null, '', `#${id}`);
  const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
  const y = alvo.getBoundingClientRect().top + window.scrollY - margem;
  rolarAte(Math.max(0, y), () => {
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });
});

// Cabeçalho: borda aparece quando a página sai do topo.
const cabecalho = document.querySelector<HTMLElement>('[data-cabecalho]');
if (cabecalho) {
  const marcar = () => (cabecalho.dataset.rolado = String(window.scrollY > 8));
  marcar();
  window.addEventListener('scroll', marcar, { passive: true });
}

// Botões que só mostram o aviso de demonstração (redes sociais, ingressos...).
document.addEventListener('click', (e) => {
  const botao = (e.target as Element | null)?.closest<HTMLElement>('[data-demo]');
  if (!botao) return;
  avisarDemonstracao(
    botao.dataset.demoTitulo ?? 'Demonstração',
    botao.dataset.demoMsg ?? 'Este é um site de estudo: não há nada real por trás deste botão.',
  );
});
