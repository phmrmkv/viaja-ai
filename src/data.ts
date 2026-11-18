// Conteúdo e contatos do Caravan. Todos os contatos são FICTÍCIOS (site de demonstração).
export const site = {
  nome: 'Caravan',
  url: 'https://caravan.libertycondominio.online',
  autor: 'Paulo H. M. Rabelo',
  empresa: 'PHMR Tech Solutions',
  urlAutor: 'https://phmr.libertycondominio.online',
};

export const contato = {
  email: 'caravan@exemplo.com.br',
  telefone: '21 99999-9999',
  horario: 'De seg. a sex., das 8h às 18h',
  aviso: 'Contatos fictícios, só para demonstração.',
  endereco: 'Rua de Exemplo, 123, Centro, Cidade de Exemplo',
};

export const paginas = [
  { href: '/local/', texto: 'Locais' },
  { href: '/planos/', texto: 'Planos' },
  { href: '/contato/', texto: 'Contato' },
];

export const cidades = ['Califórnia', 'Paris', 'Dublin'];

export const planos = {
  gold: {
    id: 'gold',
    nome: 'Gold',
    preco: 'R$ 5.000',
    novo: false,
    itens: [
      { texto: '30 dias de viagem', dica: 'Isso mesmo, são 30 dias totais durante a viagem.' },
      { texto: '3 destinos diferentes', dica: '3 destinos dentro da cidade de sua escolha.' },
      { texto: 'Tudo pago pela empresa' },
      { texto: 'Ingressos para festas' },
    ],
  },
  platinum: {
    id: 'platinum',
    nome: 'Platinum',
    preco: 'R$ 7.500',
    novo: true,
    itens: [
      { texto: '60 dias de viagem' },
      { texto: '6 destinos diferentes' },
      { texto: 'Tudo pago pela empresa' },
      { texto: 'Ingressos para festas' },
    ],
  },
};

export const perguntas = [
  {
    q: 'É possível cancelar a viagem?',
    a: 'Sim. Em um site real, o cancelamento seguiria as regras do plano contratado, com prazo e reembolso informados antes da compra. Aqui é só uma demonstração.',
  },
  {
    q: 'Qual a garantia que tenho se perder o voo?',
    a: 'Em um serviço real, a empresa ajudaria a remarcar a passagem. Este é um site de estudo e não vende viagens de verdade.',
  },
  {
    q: 'Qual a principal forma de viagem?',
    a: 'Os planos incluem passagens aéreas, translado e hospedagem. Os detalhes de cada roteiro apareceriam na página do plano.',
  },
  {
    q: 'Qual o melhor destino de viagem?',
    a: 'Depende do gosto de cada viajante: praias na Califórnia, arte e gastronomia em Paris ou paisagens verdes na Irlanda.',
  },
  {
    q: 'Vocês dão descontos para grupos grandes?',
    a: 'Em um serviço real, grupos poderiam ter condições especiais, combinadas pelo contato. Nesta demonstração não há ofertas reais.',
  },
];

// Eventos fictícios, só para preencher a agenda da demonstração.
export const eventos = ['23/10', '25/10', '30/10', '02/11', '08/11', '14/11'].map((data) => ({
  data,
  evento: 'Show de exemplo',
  local: 'Local de exemplo',
}));

export const vantagens = [
  { icone: 'passaporte', titulo: 'Documentos', texto: 'Ajuda com passaporte, vistos e a papelada da viagem.' },
  { icone: 'passagens', titulo: 'Passagens', texto: 'Passagens de ida e volta já incluídas no plano.' },
  { icone: 'translado', titulo: 'Translado', texto: 'Transporte entre o aeroporto e a hospedagem.' },
  { icone: 'praias', titulo: 'Praias', texto: 'Roteiros com os melhores trechos de litoral.' },
  { icone: 'bagagens', titulo: 'Bagagens', texto: 'Despacho de bagagem sem custo extra.' },
  { icone: 'turismo', titulo: 'Turismo', texto: 'Passeios guiados pelos pontos mais conhecidos.' },
];
