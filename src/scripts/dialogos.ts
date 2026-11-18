// Login e aviso de demonstração em <dialog> nativo.
// Cada diálogo lembra quem o abriu e devolve o foco a esse elemento ao fechar (Esc, X, botão ou fundo).
const login = document.getElementById('dialogo-login') as HTMLDialogElement | null;
const demo = document.getElementById('dialogo-demo') as HTMLDialogElement | null;

type Origem = HTMLElement | null;
const origens = new WeakMap<HTMLDialogElement, Origem>();

function duracaoFechar(): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-close')) || 150;
}

function abrir(d: HTMLDialogElement, origem: Origem) {
  origens.set(d, origem);
  d.removeAttribute('data-fechando');
  if (!d.open) d.showModal();
}

/** Fecha com a animação de saída (150 ms). `devolverFoco` leva o foco de volta a quem abriu. */
function fechar(d: HTMLDialogElement, devolverFoco = true) {
  if (!d.open || d.hasAttribute('data-fechando')) return;
  d.setAttribute('data-fechando', '');
  window.setTimeout(() => {
    d.close();
    d.removeAttribute('data-fechando');
    const origem = origens.get(d);
    if (devolverFoco && origem?.isConnected) origem.focus();
  }, duracaoFechar());
}

for (const d of [login, demo]) {
  if (!d) continue;
  // Esc: usa a mesma saída animada
  d.addEventListener('cancel', (e) => {
    e.preventDefault();
    fechar(d);
  });
  // Clique no fundo (o próprio <dialog>); o conteúdo tem padding num div interno
  d.addEventListener('click', (e) => {
    if (e.target === d) fechar(d);
  });
  d.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => fechar(d)));
}

// Login: botões [data-abrir-login] e o evento caravan:login (menu do celular)
function abrirLogin(origem: Origem) {
  if (login) abrir(login, origem);
}
document.addEventListener('click', (e) => {
  const botao = (e.target as Element | null)?.closest<HTMLElement>('[data-abrir-login]');
  if (botao) abrirLogin(botao);
});
window.addEventListener('caravan:login', (e) => {
  abrirLogin(((e as CustomEvent<{ origem?: HTMLElement }>).detail?.origem ?? document.activeElement) as Origem);
});

// Aviso de demonstração. Se vier do Login, o Login fecha sem tirar o foco e o aviso herda a origem.
window.addEventListener('caravan:demo', (e) => {
  if (!demo) return;
  const { titulo, mensagem } = (e as CustomEvent<{ titulo: string; mensagem: string }>).detail;
  let origem = document.activeElement as Origem;
  if (login?.open) {
    origem = origens.get(login) ?? origem;
    login.close();
    login.removeAttribute('data-fechando');
  }
  demo.querySelector('#demo-titulo')!.textContent = titulo;
  demo.querySelector('#demo-msg')!.textContent = mensagem;
  abrir(demo, origem);
});

// Ao fechar o Login por qualquer via, limpa os erros e o que foi digitado
login?.addEventListener('close', () => login.querySelector('form')?.reset());
