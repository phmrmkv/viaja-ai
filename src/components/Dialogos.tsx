import { useEffect, useId, useState, type SubmitEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mensagemDeErro } from '@/lib/validacao';

type Demo = { titulo: string; mensagem: string };
type Erros = { email?: string; senha?: string };

/**
 * Dois diálogos do site, numa ilha só:
 *  - Login (aberto por qualquer elemento com [data-abrir-login] ou pelo evento caravan:login);
 *  - Aviso de demonstração (evento caravan:demo): depois de enviar um formulário, nada é enviado de verdade.
 */
export default function Dialogos() {
  const [login, setLogin] = useState(false);
  const [demo, setDemo] = useState<Demo | null>(null);
  const [erros, setErros] = useState<Erros>({});
  const [resumo, setResumo] = useState('');
    const idEmail = useId();
  const idSenha = useId();

  useEffect(() => {
    const w = window as unknown as { __caravanDemo?: Demo | null; __caravanLogin?: boolean };
    const abrirLogin = () => {
      w.__caravanLogin = false;
      setLogin(true);
    };
    const abrirDemo = (e: Event) => {
      w.__caravanDemo = null;
      setDemo((e as CustomEvent<Demo>).detail);
    };
    const clique = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest('[data-abrir-login]')) abrirLogin();
    };
    window.addEventListener('caravan:login', abrirLogin);
    window.addEventListener('caravan:demo', abrirDemo);
    document.addEventListener('click', clique);
    // Eventos disparados antes de a ilha carregar
    if (w.__caravanLogin) abrirLogin();
    if (w.__caravanDemo) setDemo(w.__caravanDemo);
    return () => {
      window.removeEventListener('caravan:login', abrirLogin);
      window.removeEventListener('caravan:demo', abrirDemo);
      document.removeEventListener('click', clique);
    };
  }, []);

  function validar(dados: FormData): Erros {
    const email = mensagemDeErro(String(dados.get('email') ?? ''), { regra: 'email', rotulo: 'o e-mail' });
    const senha = mensagemDeErro(String(dados.get('senha') ?? ''), { rotulo: 'a senha' });
    return { ...(email && { email }), ...(senha && { senha }) };
  }

  function enviar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const novos = validar(new FormData(e.currentTarget));
    const n = Object.keys(novos).length;
    setErros(novos);
    if (n) {
      setResumo(n === 1 ? 'Corrija 1 campo para continuar.' : `Corrija ${n} campos para continuar.`);
      let primeiro: HTMLElement | null = null;
      for (const nome of ['email', 'senha'] as const) {
        if (!novos[nome]) continue;
        const el = e.currentTarget.elements.namedItem(nome) as HTMLElement | null;
        if (!el) continue;
        primeiro ??= el;
        // reinicia a tremida sem remontar o campo (o texto digitado fica)
        el.classList.remove('campo-tremida');
        void el.offsetWidth;
        el.classList.add('campo-tremida');
      }
      primeiro?.focus();
      return;
    }
    setResumo('');
    e.currentTarget.reset();
    setLogin(false);
    window.setTimeout(
      () => setDemo({ titulo: 'Login de demonstração', mensagem: 'Este é um site de estudo: ninguém foi autenticado e nenhum dado foi enviado.' }),
      180,
    );
  }

  function limpar(campo: keyof Erros) {
    if (erros[campo]) setErros((x) => ({ ...x, [campo]: undefined }));
  }

  return (
    <>
      <Dialog
        open={login}
        onOpenChange={(v) => {
          setLogin(v);
          if (!v) {
            setErros({});
            setResumo('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md" rotuloFechar="Fechar">
          <DialogHeader>
            <DialogTitle className="text-xl">Entre na sua conta</DialogTitle>
            <DialogDescription>Demonstração: nada é enviado, não use dados reais.</DialogDescription>
          </DialogHeader>
          <form onSubmit={enviar} noValidate className="grid gap-4">
            <div>
              <label htmlFor={`${idEmail}`} className="campo-rotulo">
                E-mail
              </label>
              <input
                id={idEmail}
                name="email"
                type="email"
                autoComplete="off"
                className="campo-entrada"
                aria-invalid={erros.email ? true : undefined}
                aria-describedby={erros.email ? `${idEmail}-erro` : undefined}
                onInput={() => limpar('email')}
              />
              <p id={`${idEmail}-erro`} className="mensagem-erro" data-visivel={erros.email ? 'true' : 'false'}>
                {erros.email}
              </p>
            </div>
            <div>
              <label htmlFor={idSenha} className="campo-rotulo">
                Senha
              </label>
              <input
                id={idSenha}
                name="senha"
                type="password"
                autoComplete="off"
                className="campo-entrada"
                aria-invalid={erros.senha ? true : undefined}
                aria-describedby={erros.senha ? `${idSenha}-erro` : undefined}
                onInput={() => limpar('senha')}
              />
              <p id={`${idSenha}-erro`} className="mensagem-erro" data-visivel={erros.senha ? 'true' : 'false'}>
                {erros.senha}
              </p>
            </div>
            <p className="resumo-erro" role="alert">
              {resumo}
            </p>
            <DialogFooter className="sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Esqueceu sua senha? Em um site real, haveria um link aqui.</p>
              <button type="submit" className="press botao-primario inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-medium">
                Entrar na conta
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={demo !== null} onOpenChange={(v) => !v && setDemo(null)}>
        <DialogContent className="sm:max-w-md" rotuloFechar="Fechar">
          <DialogHeader>
            <DialogTitle className="text-xl">{demo?.titulo}</DialogTitle>
            <DialogDescription>{demo?.mensagem}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDemo(null)}
              className="press botao-primario inline-flex min-h-11 items-center justify-center rounded-lg px-5 font-medium"
            >
              Entendi
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
