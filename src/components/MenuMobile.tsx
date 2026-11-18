import { useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { abrirLogin } from '@/lib/validacao';

type Link = { href: string; texto: string };

export default function MenuMobile({ links, atual }: { links: Link[]; atual: string }) {
  const [aberto, setAberto] = useState(false);
  const gatilho = useRef<HTMLButtonElement>(null);

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger
        ref={gatilho}
        className="press -mr-2 inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-accent"
        aria-label="Abrir menu"
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        rotuloFechar="Fechar menu"
        className="w-[82vw] max-w-sm gap-0 px-2"
      >
        <SheetHeader className="px-4 pt-6">
          <SheetTitle className="text-left text-lg font-semibold">Menu</SheetTitle>
          <SheetDescription className="sr-only">Páginas do site Caravan</SheetDescription>
        </SheetHeader>
        <nav aria-label="Principal (celular)" className="px-2 pt-2">
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.href} className="menu-item" style={{ '--i': i } as React.CSSProperties}>
                <a
                  href={l.href}
                  aria-current={atual === l.href ? 'page' : undefined}
                  className="link-menu flex min-h-12 items-center rounded-xl px-3 text-xl font-medium tracking-tight"
                >
                  {l.texto}
                </a>
              </li>
            ))}
            <li className="menu-item" style={{ '--i': links.length } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => {
                  setAberto(false);
                  // o foco volta ao botão do menu; o Login herda esse botão como origem
                  window.setTimeout(() => abrirLogin(gatilho.current), 300);
                }}
                className="link-menu flex min-h-12 w-full items-center rounded-xl px-3 text-left text-xl font-medium tracking-tight"
              >
                Login
              </button>
            </li>
          </ul>
        </nav>
        <div className="menu-item mt-auto px-4 pb-8" style={{ '--i': links.length + 1 } as React.CSSProperties}>
          <a href="/inscricao/" className="press botao-primario flex h-12 items-center justify-center rounded-lg font-medium">
            Inscreva-se
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
