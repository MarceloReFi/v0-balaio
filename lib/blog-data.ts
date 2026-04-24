export interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  tags: string[]
  author: string
  readTime: string
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    id: "apresentacao-balaio",
    title: "Conheça o Balaio: A nova infraestrutura para coordenação eficiente de tarefas",
    date: "2025-01-20",
    category: "Plataforma",
    author: "ReFaz0x",
    readTime: "4 min",
    featured: true,
    excerpt: "O trabalho moderno exige agilidade, mas as ferramentas tradicionais continuam lentas e burocráticas. O Balaio conecta orçamentos diretamente à execução de tarefas.",
    content: `O trabalho moderno exige agilidade, mas as ferramentas tradicionais de contratação e pagamento continuam lentas, burocráticas e desconectadas da execução real. Para as organizações, alocar orçamento e garantir que as entregas sejam feitas no prazo é um desafio constante. Para os talentos, a fricção na hora de receber pelo trabalho afasta a produtividade e a confiança.

Foi para resolver essa lacuna que criamos o Balaio.

O Balaio é uma plataforma de coordenação que substitui a burocracia por um fluxo ágil focado em resultados. Nós conectamos orçamentos diretamente à execução de tarefas. Uma organização parametriza uma missão, um talento (ou agente de IA) assume a execução e, após a aprovação do trabalho, a liquidação financeira acontece de forma instantânea e automatizada, sem intermediários.

Estamos construindo o sistema operacional para a execução de projetos.

O desenvolvimento da plataforma é resultado de um esforço focado em aliar design de produto à eficiência matemática. O projeto foi idealizado e construído por ReFaz0x (responsável pela arquitetura de produto, código, branding e comunicação) e Filipe Farias (responsável pela engenharia dos smart contracts e infraestrutura de liquidação). A plataforma também conta com o suporte fundamental de Pedro Parrachia e Suzane Zaperllon (CeLatam) na estruturação de parcerias e estratégia de crescimento.

O Balaio já está no ar para otimizar a sua operação. Reduza seu overhead administrativo e comece a coordenar tarefas com liquidação imediata.`,
    tags: ["Plataforma", "Coordenação", "Produto"],
  },
  {
    id: "parceria-gooddollar",
    title: "Balaio e GoodDollar: Identidade verificada no Good Builders Season 3",
    date: "2025-02-10",
    category: "Parceria",
    author: "ReFaz0x",
    readTime: "4 min",
    featured: false,
    excerpt: "Anunciamos nossa integração com o protocolo de identidade verificada do GoodDollar e participação no Good Builders Season 3.",
    content: `Quando uma organização aloca capital para a execução de tarefas, a maior prioridade é a garantia de que o trabalho será feito com qualidade e por pessoas reais. Em ecossistemas digitais, evitar fraudes e bots é um desafio técnico complexo.

É com muito orgulho que anunciamos nossa integração com o GoodDollar e nossa participação no programa de aceleração Good Builders Season 3.

Através dessa parceria, o Balaio integra o protocolo de identidade verificada do GoodDollar (GoodID). Na prática, isso significa que as organizações que utilizam o Balaio para distribuir orçamentos de impacto ou tarefas comunitárias têm a garantia de que os pagamentos estão sendo direcionados a indivíduos únicos e verificados.

Por que isso importa para a sua operação? Auditoria simplificada: você sabe exatamente quem está executando suas tarefas. Eficiência de capital: zero desperdício de orçamento com contas duplicadas ou bots não autorizados. Impacto real: em tarefas de engajamento e crescimento de comunidade, a recompensa chega diretamente a pessoas reais.

Fazer parte do Good Builders Season 3 nos conecta a um ecossistema global de construtores focados em ferramentas com utilidade real e impacto mensurável. Esta é mais uma camada de segurança e eficiência para organizações que escolhem o Balaio como sua infraestrutura de coordenação.`,
    tags: ["GoodDollar", "Identidade", "Parceria"],
  },
  {
    id: "piloto-unifacs",
    title: "Conectando a academia ao mercado: Piloto com UNIFACS e Blockchain na Escola",
    date: "2025-03-05",
    category: "Educação",
    author: "ReFaz0x",
    readTime: "5 min",
    featured: false,
    excerpt: "Parceria com UNIFACS e Blockchain na Escola para criar um banco de talentos qualificado e verificável através de trilhas estruturadas de execução.",
    content: `Um dos maiores gargalos do mercado de tecnologia atual é o alinhamento entre a formação acadêmica e as demandas práticas das empresas. O talento existe, mas frequentemente carece de um histórico verificável de execução para comprovar suas habilidades.

Para resolver isso, o Balaio, em parceria com a UNIFACS (Universidade Salvador) e o projeto Blockchain na Escola, assinou um Memorando de Entendimento (MOU) para a execução de um projeto piloto de 6 meses focado na criação de um banco de talentos qualificado e verificável.

O projeto utilizará a infraestrutura do Balaio para conectar estudantes universitários ao mercado através de trilhas estruturadas de aprendizado e execução. As certificações incluem áreas de alta demanda: Fundamentos de Blockchain (Web3 101), Integração de IA e fluxos de trabalho, Desenvolvimento de Produtos e DAOs, e Solidity e Token Engineering.

O Balaio fornecerá a camada tecnológica para que o progresso dos alunos não fique apenas no papel. Ao concluírem desafios e tarefas dentro das trilhas, os estudantes receberão registros públicos de suas conquistas, formando um portfólio verificável.

Ao fim do semestre, entregaremos não apenas um grupo de alunos certificados, mas um banco de dados real de talentos prontos para o mercado. Para as empresas, significa acesso direto a profissionais qualificados, com provas irrefutáveis de sua capacidade de entrega.`,
    tags: ["Educação", "UNIFACS", "Talentos"],
  },
  {
    id: "caso-green-pill",
    title: "Execução orçamentária com transparência: O caso de uso da Green Pill Brasil",
    date: "2025-04-01",
    category: "Caso de Uso",
    author: "ReFaz0x",
    readTime: "4 min",
    featured: false,
    excerpt: "Como a Green Pill Brasil está usando o Balaio para coordenar sua tesouraria e distribuir incentivos com total transparência.",
    content: `Para comunidades e organizações não governamentais, gerir uma tesouraria e distribuir incentivos são processos que exigem extrema transparência. As lideranças precisam prestar contas, enquanto os membros precisam de caminhos claros para contribuir e serem recompensados de forma justa.

É exatamente este modelo operacional que a Green Pill Brasil está adotando ao escolher o Balaio como sua ferramenta oficial para coordenação e execução de orçamento.

A Green Pill Brasil utilizará o painel do Balaio para disponibilizar tarefas essenciais para o crescimento da sua rede: missões de onboarding para novos membros, tarefas de incentivo para pesquisa e engajamento local, e micro-trabalhos de infraestrutura para os capítulos da organização no Brasil.

Ao postar uma tarefa no Balaio, a Green Pill Brasil define claramente o escopo e o valor financeiro alocado para aquela entrega. Quando um membro da comunidade conclui o trabalho e ele é aprovado pela moderação, a plataforma liquida o pagamento instantaneamente.

Para a auditoria da Green Pill, o benefício é imenso: cada centavo distribuído do orçamento está obrigatoriamente atrelado a uma tarefa concluída e validada. É a eliminação do overhead administrativo de fechar planilhas no fim do mês, garantindo que o foco da organização permaneça na execução da sua missão principal.`,
    tags: ["Caso de Uso", "Green Pill", "Transparência"],
  },
  {
    id: "balaio-bread-coordenacao",
    title: "Balaio e BREAD: Infraestrutura Alinhada para a Coordenação de Comunidades",
    date: "2026-04-24",
    category: "Parceria",
    author: "ReFaz0x",
    readTime: "3 min",
    featured: false,
    excerpt: "O Balaio agora suporta oficialmente o token BREAD na Gnosis Chain, unindo coordenação de tarefas à infraestrutura financeira nativa de comunidades de impacto.",
    content: `Para comunidades e fundos de impacto que operam na linha de frente, a execução orçamentária precisa ser tão eficiente quanto o seu propósito. O trabalho moderno exige agilidade, substituindo processos lentos e burocráticos por fluxos ágeis focados em resultados. É por isso que o Balaio agora suporta oficialmente o token BREAD na Gnosis Chain.

Tanto o Balaio quanto o ecossistema do BREAD compartilham uma visão operacional fundamental: o foco deve estar na coordenação de talentos e no impacto real. O BREAD atua como uma opção de infraestrutura financeira nativa, fundamental para comunidades e ecossistemas que desejam recompensar o engajamento local e a execução de missões.

No entanto, possuir o ativo é apenas metade do caminho. O Balaio entra como a camada de infraestrutura operacional. Nós conectamos os orçamentos das comunidades diretamente à execução de tarefas. Não somos apenas um marketplace; somos o sistema operacional para a execução de projetos.

Ao unir o BREAD à plataforma de coordenação do Balaio, entregamos um fluxo de trabalho sem fricção para a governança de tesourarias:

Alocação Direta: Organizações e líderes de comunidade parametrizam tarefas operacionais e alocam o orçamento diretamente em BREAD.

Execução Focada: Talentos assumem a missão com total clareza do escopo e da recompensa.

Liquidação Imediata: Quando o trabalho é concluído e aprovado, a liquidação financeira acontece de forma instantânea e automatizada.

Gerir a distribuição de incentivos manualmente consome um tempo valioso. Chega de fechar planilhas no fim do mês. Se a sua organização busca distribuir BREAD com máxima eficiência de capital, o Balaio já está no ar para otimizar a sua operação.`,
    tags: ["BREAD", "Gnosis Chain", "Parceria"],
  },
]

export const blogCategories = ["Todos", "Plataforma", "Parceria", "Educação", "Caso de Uso"]
