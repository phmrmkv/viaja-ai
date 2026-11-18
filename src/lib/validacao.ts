// Regras de validação dos formulários de demonstração (nada é enviado).
// Usadas pelos formulários em HTML (src/scripts/formularios.ts) e pelo Login (React).
export type Regra = 'email' | 'cpf' | 'cep' | 'cartao' | 'cvv' | 'senha' | 'nome';

const soDigitos = (v: string) => v.replace(/\D/g, '');

/** Devolve a mensagem de erro, ou '' quando o valor é válido. */
export function mensagemDeErro(
  valor: string,
  opts: { regra?: Regra; rotulo: string; obrigatorio?: boolean; tipo?: 'texto' | 'selecao' | 'marcar' },
): string {
  const v = valor.trim();
  const { regra, rotulo, obrigatorio = true, tipo = 'texto' } = opts;
  if (!v) {
    if (!obrigatorio) return '';
    if (tipo === 'selecao') return `Selecione ${rotulo}.`;
    if (tipo === 'marcar') return rotulo;
    return `Preencha ${rotulo}.`;
  }
  switch (regra) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Informe um e-mail válido, como nome@exemplo.com.';
    case 'cpf':
      return soDigitos(v).length === 11 ? '' : 'O CPF deve ter 11 números.';
    case 'cep':
      return soDigitos(v).length === 8 ? '' : 'O CEP deve ter 8 números.';
    case 'cartao': {
      const n = soDigitos(v).length;
      return n >= 13 && n <= 19 ? '' : 'O número do cartão deve ter de 13 a 19 números.';
    }
    case 'cvv': {
      const n = soDigitos(v).length;
      return n === 3 || n === 4 ? '' : 'O código deve ter 3 ou 4 números.';
    }
    case 'senha':
      return v.length >= 6 ? '' : 'A senha deve ter pelo menos 6 caracteres.';
    case 'nome':
      return v.split(/\s+/).length >= 2 ? '' : 'Informe nome e sobrenome.';
    default:
      return '';
  }
}

/** Dispara o aviso de demonstração (diálogo nativo em src/scripts/dialogos.ts). */
export function avisarDemonstracao(titulo: string, mensagem: string) {
  window.dispatchEvent(new CustomEvent('caravan:demo', { detail: { titulo, mensagem } }));
}

/** Abre o Login; origem é o elemento que recebe o foco ao fechar. */
export function abrirLogin(origem?: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent('caravan:login', { detail: { origem } }));
}
