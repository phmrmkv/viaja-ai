// Interações da página. Tudo aqui é melhoria: sem este arquivo a página continua
// legível, com âncoras e CSS puros (docs/transicoes.md).

const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;

/* ---------- Tema ---------- */
const botaoTema = document.querySelector<HTMLButtonElement>('[data-tema-botao]');
if (botaoTema) {
  const sincronizar = () => {
    const escuro = raiz.dataset.theme === 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', escuro ? '#111215' : '#f4f4f2');
    botaoTema.setAttribute('aria-label', (escuro ? botaoTema.dataset.rotuloClaro : botaoTema.dataset.rotuloEscuro) ?? '');
  };
  sincronizar();
  new MutationObserver(sincronizar).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
  botaoTema.addEventListener('click', () => {
    const proximo = raiz.dataset.theme === 'dark' ? 'light' : 'dark';
    raiz.dataset.theme = proximo;
    try {
      localStorage.setItem('viaja-tema', proximo);
    } catch {
      /* sem armazenamento: a troca vale só nesta visita */
    }
  });
  window.addEventListener('storage', (e) => {
    if (e.key === 'viaja-tema' && (e.newValue === 'dark' || e.newValue === 'light')) raiz.dataset.theme = e.newValue;
  });
}

/* ---------- Rolagem suave das âncoras (curva do sistema) ---------- */
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

const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link || link.pathname !== location.pathname || !link.hash) return;
  const id = decodeURIComponent(link.hash.slice(1));
  const alvo = document.getElementById(id);
  if (!alvo) return;
  e.preventDefault();
  if (menu?.open) menu.open = false;
  history.pushState(null, '', `#${id}`);
  const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
  const y = id === 'inicio' ? 0 : alvo.getBoundingClientRect().top + window.scrollY - margem;
  rolarAte(Math.max(0, y), () => {
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });
});

/* ---------- Menu do celular: Esc fecha e devolve o foco ao botão ---------- */
if (menu) {
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (menu.open && !menu.contains(e.target as Node)) menu.open = false;
  });
}

/* ---------- Cabeçalho: borda ao rolar ---------- */
const cabecalho = document.querySelector<HTMLElement>('[data-cabecalho]');
if (cabecalho) {
  const marcar = () => (cabecalho.dataset.rolado = String(window.scrollY > 8));
  marcar();
  window.addEventListener('scroll', marcar, { passive: true });
}

/* ---------- Seção atual no menu ---------- */
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (nav && 'IntersectionObserver' in window) {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href*="#"]')];
  const secoes = links.map((a) => document.getElementById(a.hash.slice(1))).filter((s): s is HTMLElement => !!s);
  const visiveis = new Set<string>();
  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((en) => (en.isIntersecting ? visiveis.add(en.target.id) : visiveis.delete(en.target.id)));
      const atual = secoes.find((s) => visiveis.has(s.id));
      links.forEach((a) => (atual && a.hash === `#${atual.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  secoes.forEach((s) => io.observe(s));
}

/* ---------- Diálogos nativos ---------- */
const dialogos = document.querySelectorAll<HTMLDialogElement>('[data-dlg]');
const origem = new WeakMap<HTMLDialogElement, HTMLElement>();

function fechar(dlg: HTMLDialogElement) {
  if (!dlg.open || dlg.classList.contains('fechando')) return;
  const terminar = () => {
    dlg.classList.remove('fechando');
    dlg.close();
    // O navegador já devolve o foco; repetimos para garantir em qualquer navegador.
    origem.get(dlg)?.focus();
  };
  const dur = parseFloat(getComputedStyle(raiz).getPropertyValue('--dur-close')) || 150;
  dlg.classList.add('fechando');
  window.setTimeout(terminar, dur);
}

document.querySelectorAll<HTMLElement>('[data-abrir]').forEach((gatilho) => {
  gatilho.addEventListener('click', () => {
    const dlg = document.getElementById(gatilho.dataset.abrir ?? '') as HTMLDialogElement | null;
    if (!dlg) return;
    origem.set(dlg, gatilho);
    dlg.showModal();
  });
});

dialogos.forEach((dlg) => {
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault(); // Esc: fecha com a animação
    fechar(dlg);
  });
  // Clique no fundo: o alvo é o próprio <dialog> (o conteúdo fica num div interno).
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) fechar(dlg);
  });
  dlg.querySelectorAll<HTMLElement>('[data-fechar]').forEach((b) => b.addEventListener('click', () => fechar(dlg)));
  dlg.addEventListener('close', () => origem.get(dlg)?.focus());
});

/* ---------- Lista de espera (demonstração: nada é enviado) ---------- */
const form = document.querySelector<HTMLFormElement>('[data-form-lista]');
if (form) {
  const aviso = form.querySelector<HTMLElement>('[data-lista-aviso]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    if (aviso) aviso.hidden = false;
  });
  const dlg = form.closest('dialog');
  dlg?.addEventListener('close', () => {
    if (aviso) aviso.hidden = true;
    form.reset();
  });
}

/* ---------- Demonstração: "Chove no dia 2" ---------- */
const demo = document.querySelector<HTMLElement>('[data-demo]');
const botaoChuva = demo?.querySelector<HTMLButtonElement>('[data-demo-chuva]');
const estado = demo?.querySelector<HTMLElement>('[data-demo-estado]');
if (demo && botaoChuva && estado) {
  botaoChuva.addEventListener('click', () => {
    const chuva = demo.dataset.chuva !== 'true';
    demo.dataset.chuva = String(chuva);
    botaoChuva.setAttribute('aria-pressed', String(chuva));
    estado.textContent = chuva
      ? 'Plano refeito: o dia 2 troca o passeio ao ar livre por museus. Os outros dias ficam como estão.'
      : 'Plano de volta ao original.';
  });
}
