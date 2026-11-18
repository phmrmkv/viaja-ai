// Formulários de demonstração: validação no navegador (mensagem acessível, aria-invalid,
// tremida curta) e, ao enviar, um aviso de que nada é enviado. Nenhum dado sai da página.
import { mensagemDeErro, avisarDemonstracao, type Regra } from '@/lib/validacao';

type Controle = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function controlesDe(form: HTMLFormElement): Controle[] {
  return [...form.elements].filter(
    (el): el is Controle =>
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
      el.type !== 'radio' &&
      el.type !== 'hidden' &&
      !el.disabled,
  );
}

function erroDoControle(el: Controle): string {
  const tipo = el instanceof HTMLSelectElement ? 'selecao' : el instanceof HTMLInputElement && el.type === 'checkbox' ? 'marcar' : 'texto';
  const valor = el instanceof HTMLInputElement && el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value;
  const de = el.dataset.erroDe ?? 'o campo';
  return mensagemDeErro(valor, {
    regra: el.dataset.regra as Regra | undefined,
    rotulo: tipo === 'marcar' ? (el.dataset.erro ?? 'Marque esta opção para continuar.') : de,
    obrigatorio: el.required,
    tipo,
  });
}

function mostrarErro(el: Controle, msg: string, tremer: boolean) {
  const p = document.getElementById(`${el.id}-erro`);
  if (msg) {
    el.setAttribute('aria-invalid', 'true');
    if (p) {
      p.textContent = msg;
      p.dataset.visivel = 'true';
    }
    if (tremer) {
      el.classList.remove('campo-tremida');
      void el.offsetWidth; // reinicia a animação
      el.classList.add('campo-tremida');
    }
  } else {
    el.removeAttribute('aria-invalid');
    el.classList.remove('campo-tremida');
    if (p) {
      p.textContent = '';
      p.dataset.visivel = 'false';
    }
  }
}

function iniciar(form: HTMLFormElement) {
  form.noValidate = true;
  const resumo = form.querySelector<HTMLElement>('[data-resumo]');

  // Revalida o campo que já estava com erro enquanto a pessoa corrige.
  const revalidar = (e: Event) => {
    const el = e.target as Controle;
    if (el.getAttribute?.('aria-invalid') === 'true') mostrarErro(el, erroDoControle(el), false);
  };
  form.addEventListener('input', revalidar);
  form.addEventListener('change', revalidar);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let primeiro: Controle | null = null;
    let total = 0;
    for (const el of controlesDe(form)) {
      const msg = erroDoControle(el);
      mostrarErro(el, msg, true);
      if (msg) {
        total++;
        primeiro ??= el;
      }
    }
    if (total) {
      if (resumo) resumo.textContent = total === 1 ? 'Corrija 1 campo para continuar.' : `Corrija ${total} campos para continuar.`;
      primeiro?.focus();
      return;
    }
    if (resumo) resumo.textContent = '';
    avisarDemonstracao(
      form.dataset.demoTitulo ?? 'Demonstração',
      form.dataset.demoMsg ?? 'Este é um site de estudo: nada foi enviado e nenhum dado foi guardado.',
    );
    form.reset();
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      for (const el of controlesDe(form)) mostrarErro(el, '', false);
      if (resumo) resumo.textContent = '';
      form.dispatchEvent(new CustomEvent('caravan:redefinido'));
    });
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-demo-form]').forEach(iniciar);

// Forma de pagamento: mostra o painel da opção escolhida e desativa os campos do outro
// (campos desativados não são validados).
document.querySelectorAll<HTMLElement>('[data-grupo-pagamento]').forEach((grupo) => {
  const form = grupo.closest('form');
  const radios = grupo.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  const atualizar = () => {
    const escolhido = [...radios].find((r) => r.checked)?.value;
    form?.querySelectorAll<HTMLElement>('[data-painel]').forEach((p) => {
      const ativo = p.dataset.painel === escolhido;
      p.hidden = !ativo;
      p.querySelectorAll<Controle>('input, select, textarea').forEach((c) => {
        c.disabled = !ativo;
        if (!ativo) mostrarErro(c, '', false);
      });
    });
  };
  radios.forEach((r) => r.addEventListener('change', atualizar));
  form?.addEventListener('caravan:redefinido', atualizar);
  atualizar();
});
