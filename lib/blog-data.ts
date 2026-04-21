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
    id: "conheca-o-balaio",
    title: "Conheça o Balaio: A nova infraestrutura para coordenação eficiente de tarefas",
    date: "2025-04-01",
    category: "Platform",
    author: "ReFaz0x",
    readTime: "5 min de leitura",
    featured: true,
    excerpt:
      "O trabalho moderno exige agilidade, mas as ferramentas tradicionais de contratação e pagamento continuam lentas, burocráticas e desconectadas da execução real. Foi para resolver essa lacuna que criamos o Balaio.",
    content: `O trabalho moderno exige agilidade, mas as ferramentas tradicionais de contratação e pagamento continuam lentas, burocráticas e desconectadas da execução real. Para as organizações, alocar orçamento e garantir que as entregas sejam feitas no prazo é um desafio constante. Para os talentos, a fricção na hora de receber pelo trabalho afeta a produtividade e a confiança.

Foi para resolver essa lacuna que criamos o Balaio.

**O que é o Balaio**

O Balaio é uma plataforma de coordenação que substitui a burocracia por um fluxo ágil focado em resultados. Nós conectamos orçamentos diretamente à execução de tarefas. Uma organização parametriza uma missão, um talento (ou agente de IA) assume a execução e, após a aprovação do trabalho, a liquidação financeira acontece de forma instantânea e automatizada, sem intermediários.

Estamos construindo o sistema operacional para a execução de projetos.

**Quem constrói o Balaio**

O desenvolvimento da plataforma é resultado de um esforço focado em aliar design de produto à eficiência matemática. O projeto foi idealizado e construído por ReFaz0x (responsável pela arquitetura de produto, código, branding e comunicação) e Filipe Farias (responsável pela engenharia dos smart contracts e infraestrutura de liquidação). A plataforma também conta com o suporte fundamental de Pedro Parrachia e Suzane Zaperllon (CeLatam) na estruturação de parcerias e estratégia de crescimento.

**Comece agora**

O Balaio já está no ar para otimizar a sua operação. Reduza seu overhead administrativo e comece a coordenar tarefas com liquidação imediata.`,
    tags: ["Plataforma", "Coordenação", "Liquidação instantânea"],
  },
  {
    id: "green-pill-brasil-caso-uso",
    title: "Execução orçamentária com transparência: O caso de uso da Green Pill Brasil",
    date: "2025-04-15",
    category: "Use Case",
    author: "Balaio Team",
    readTime: "4 min de leitura",
    excerpt:
      "Para comunidades e organizações não governamentais, gerir uma tesouraria e distribuir incentivos são processos que exigem extrema transparência. A Green Pill Brasil está adotando o Balaio como sua ferramenta oficial para coordenação e execução de orçamento.",
    content: `Para comunidades e organizações não governamentais, gerir uma tesouraria e distribuir incentivos são processos que exigem extrema transparência. As lideranças precisam prestar contas, enquanto os membros precisam de caminhos claros para contribuir e serem recompensados de forma justa.

É exatamente este modelo operacional que a Green Pill Brasil está adotando ao escolher o Balaio como sua ferramenta oficial para coordenação e execução de orçamento.

**A Operação**

A Green Pill Brasil utilizará o painel do Balaio para disponibilizar tarefas essenciais para o crescimento da sua rede. Isso inclui missões de onboarding para novos membros, tarefas de incentivo para pesquisa e engajamento local, e micro-trabalhos de infraestrutura para os capítulos da organização no Brasil.

**Transparência desde a definição até o pagamento**

Ao postar uma tarefa no Balaio, a Green Pill Brasil define claramente o escopo e o valor financeiro alocado para aquela entrega. Quando um membro da comunidade conclui o trabalho e ele é aprovado pela moderação, a plataforma liquida o pagamento instantaneamente.

Para a auditoria da Green Pill, o benefício é imenso: cada centavo distribuído do orçamento está obrigatoriamente atrelado a uma tarefa concluída e validada. É a eliminação do overhead administrativo de fechar planilhas no fim do mês, garantindo que o foco da organização permaneça na execução da sua missão principal.`,
    tags: ["Green Pill", "Transparência", "Caso de Uso", "ONGs"],
  },
  {
    id: "piloto-unifacs-blockchain",
    title: "Conectando a academia ao mercado: Piloto do Balaio com UNIFACS e Blockchain na Escola",
    date: "2025-04-10",
    category: "Education",
    author: "Balaio Team",
    readTime: "5 min de leitura",
    excerpt:
      "Um dos maiores gargalos do mercado de tecnologia é o alinhamento entre formação acadêmica e demandas práticas. O Balaio, em parceria com a UNIFACS e o Blockchain na Escola, vai criar um banco de talentos qualificado e verificável.",
    content: `Um dos maiores gargalos do mercado de tecnologia atual é o alinhamento entre a formação acadêmica e as demandas práticas das empresas. O talento existe, mas frequentemente carece de um histórico verificável de execução para comprovar suas habilidades.

Para resolver isso, o Balaio, em parceria com a UNIFACS (Universidade Salvador) e o projeto Blockchain na Escola, assinou um Memorando de Entendimento (MOU) para a execução de um projeto piloto de 6 meses focado na criação de um banco de talentos qualificado e verificável.

**O Escopo do Piloto**

O projeto utilizará a infraestrutura do Balaio para conectar estudantes universitários ao mercado através de trilhas estruturadas de aprendizado e execução. As certificações incluem áreas de alta demanda, como Fundamentos de Blockchain (Web3 101), Integração de IA e fluxos de trabalho (AI + Web3), Desenvolvimento de Produtos e DAOs, além de Solidity e Token Engineering.

**Como o Balaio atua nesta parceria**

O Balaio fornecerá a camada tecnológica para que o progresso dos alunos não fique apenas no papel. Ao concluírem desafios e tarefas dentro das trilhas, os estudantes receberão registros públicos de suas conquistas, formando um portfólio verificável.

Ao fim do semestre, entregaremos não apenas um grupo de alunos certificados, mas um banco de dados real de talentos prontos para o mercado. Para as empresas, significa acesso direto a profissionais qualificados, com provas irrefutáveis de sua capacidade de entrega.`,
    tags: ["UNIFACS", "Educação", "Blockchain na Escola", "Talentos"],
  },
  {
    id: "balaio-gooddollar-season3",
    title: "Balaio e GoodDollar: Identidade verificada e eficiência no Good Builders Season 3",
    date: "2025-04-05",
    category: "Partnership",
    author: "ReFaz0x",
    readTime: "4 min de leitura",
    excerpt:
      "Quando uma organização aloca capital para a execução de tarefas, a maior prioridade é garantir que o trabalho seja feito por pessoas reais. Anunciamos nossa integração com o GoodDollar e participação no Good Builders Season 3.",
    content: `Quando uma organização aloca capital para a execução de tarefas, a maior prioridade é a garantia de que o trabalho será feito com qualidade e por pessoas reais. Em ecossistemas digitais, evitar fraudes e bots é um desafio técnico complexo.

É com muito orgulho que anunciamos nossa integração com o GoodDollar e nossa participação no programa de aceleração Good Builders Season 3.

**A Integração**

Através dessa parceria, o Balaio integra o protocolo de identidade verificada do GoodDollar (GoodID). Na prática, isso significa que as organizações que utilizam o Balaio para distribuir orçamentos de impacto ou tarefas comunitárias têm a garantia de que os pagamentos estão sendo direcionados a indivíduos únicos e verificados.

**Por que isso importa para a sua operação**

Auditoria simplificada: você sabe exatamente quem está executando suas tarefas. Eficiência de capital: zero desperdício de orçamento com contas duplicadas ou bots não autorizados. Impacto real: em tarefas de engajamento e crescimento de comunidade, a recompensa chega diretamente a pessoas reais.

**Good Builders Season 3**

Fazer parte do Good Builders Season 3 nos conecta a um ecossistema global de construtores focados em ferramentas com utilidade real e impacto mensurável. Esta é mais uma camada de segurança e eficiência para organizações que escolhem o Balaio como sua infraestrutura de coordenação.`,
    tags: ["GoodDollar", "GoodID", "Parceria", "Identidade verificada"],
  },
  {
    id: "future-of-learn2earn",
    title: "The Future of Learn2Earn in Web3",
    date: "2024-01-10",
    category: "Learn2Earn",
    author: "Maria Santos",
    readTime: "5 min read",
    excerpt:
      "Exploring how blockchain technology is revolutionizing education and creating new opportunities for learners worldwide.",
    content: `Learn2Earn is reshaping how people think about education. Instead of paying for knowledge upfront and hoping it pays off later, learners earn while they grow. Blockchain makes this possible by recording achievements transparently and distributing rewards through smart contracts.

**Why Learn2Earn Matters**

Traditional education often leaves students in debt with no guarantee of employment. Learn2Earn flips this: you gain skills while earning cryptocurrency, building knowledge and financial resources at the same time.

**How It Works on Balaio**

On Balaio, task creators fund educational modules or micro-tasks with crypto. Learners browse what's available, claim tasks that match their interests, complete the work, and submit proof. Once approved, the smart contract releases payment directly to their wallet — no invoicing, no delays.

This model makes education more accessible regardless of where someone lives or what bank account they have.`,
    tags: ["Learn2Earn", "Web3", "Education"],
  },
  {
    id: "freelancing-web3-era",
    title: "Freelancing in the Web3 Era: A New Paradigm",
    date: "2025-01-12",
    category: "Insights",
    author: "Pedro Parrachia",
    readTime: "8 min read",
    excerpt:
      "How blockchain is transforming freelance work with instant payments, transparent contracts, and global accessibility.",
    content: `The freelance economy has long been plagued by delayed payments, opaque platform fees, and limited recourse when disputes arise. Web3 technology addresses these problems at their root.

**What's Broken Today**

Freelancers routinely wait 30 to 90 days for payment. Platforms take 20-30% in fees. Disputes drag on with no clear resolution. Geographic restrictions lock out talented workers in emerging markets. And reputation doesn't transfer between platforms.

**How Web3 Changes This**

Smart contracts release funds the moment work is approved — no payment terms, no intermediaries skimming fees. Every task, submission, and payment lives on-chain, making disputes rare because everything is verifiable by both parties.

Anyone with a wallet can participate. No bank account needed. Your work history follows you across platforms because it's recorded on a public ledger, not locked inside a proprietary database.

**What This Means in Practice**

Balaio and similar platforms let workers connect a Celo wallet (Valora, MetaMask, or MiniPay), browse tasks that match their skills, and get paid immediately upon approval. The future of freelancing is transparent, instant, and open to everyone.`,
    tags: ["Freelancing", "Web3", "Future of Work", "Insights"],
  },
  {
    id: "transparent-budget-management",
    title: "Transparent Budget Management: Why It Matters",
    date: "2025-01-10",
    category: "Insights",
    author: "Felipe Farias",
    readTime: "6 min read",
    excerpt:
      "How on-chain budget tracking creates accountability and trust between task creators and workers.",
    content: `One of the most powerful aspects of blockchain-based task platforms is complete budget transparency. Every token is tracked, every payment is visible, and every allocation is verifiable.

**The Old Way**

Traditional platforms operate as black boxes. Workers don't know how much the client actually paid. Fees are buried in terms of service. Budget allocation is invisible. There's no way to independently verify that payment was fair.

**On-Chain Transparency**

When a task is created on Balaio, the reward is deposited into the smart contract upfront. Workers can see the money is there before they start. Anyone can verify how much is allocated per slot, the total budget, and remaining funds. Upon approval, rewards are released automatically — no manual intervention, no delays, no surprises.

Every transaction is permanently recorded on the Celo blockchain, creating an audit trail that anyone can inspect.

**Why This Works**

Workers get confidence that payment is guaranteed before they begin. Task creators build trust with their community by showing they operate transparently. The ecosystem benefits from higher completion rates, better quality submissions, and stronger long-term working relationships.

Transparency isn't a nice-to-have — it's the foundation of trust in decentralized coordination.`,
    tags: ["Transparency", "Budget", "Trust", "Insights"],
  },
  {
    id: "power-of-simple-apps",
    title: "The Power of Simple Apps: Less is More",
    date: "2025-01-08",
    category: "Insights",
    author: "ReFi Ceara Team",
    readTime: "5 min read",
    excerpt:
      "Why Balaio focuses on simplicity and how straightforward design enables mass adoption of Web3.",
    content: `In a world of complex DeFi protocols and confusing interfaces, Balaio takes a different approach: radical simplicity.

**The Complexity Problem**

Web3 has an adoption problem. Most apps require users to understand gas fees, navigate layered UIs, manage multiple tokens, and internalize entirely new mental models. The result is that only crypto-native users can participate.

**Our Approach**

Balaio is built mobile-first because most of the world accesses the internet through a phone. The interface is designed for one-handed use, with large tap targets and clear actions. Creating a task takes three fields. Claiming one takes a single tap. Every extra step is friction, and we treat friction as a bug.

Users always know what just happened, what they can do next, and exactly how much they earned or spent. No hidden states, no ambiguous loading screens.

**Why Simplicity Drives Adoption**

Simple apps aren't just easier to use — they're more inclusive. They work on slow networks and limited data plans. New users don't need a tutorial. Clear visual design helps everyone, including people using the app in a second language.

Users from Fortaleza to São Paulo are completing tasks on Balaio, many interacting with Web3 for the first time. Simplicity is the feature that makes every other feature accessible.`,
    tags: ["Design", "Simplicity", "Adoption", "Insights"],
  },
  {
    id: "welcome-to-balaio",
    title: "Welcome to Balaio: Your Web3 Task Platform",
    date: "2024-11-30",
    category: "Platform",
    author: "Balaio Team",
    readTime: "4 min read",
    excerpt:
      "Discover how Balaio bridges the gap between Web3 education and real-world opportunities through task-based learning and earning.",
    content: `Balaio is a task-based coordination app where people complete real-world or online tasks and get paid on-chain. Projects and organizations create and manage tasks with transparent, verifiable payouts.

**What Makes Balaio Different**

It's mobile-first, designed for smartphones and usable anywhere. Rewards go directly to your wallet the moment work is approved. All payments are verified on the Celo blockchain. And you don't need to understand DeFi to use it — connect a wallet, pick a task, do the work, get paid.

**Who Uses Balaio**

Workers browse and complete tasks to earn cUSD or USDC. Organizations create tasks and manage contributor communities. Projects distribute rewards transparently across their teams.

**Getting Started**

Download Valora or MiniPay, visit Balaio, connect your wallet, and browse what's available. That's it. Welcome to the future of work.`,
    tags: ["Platform", "Introduction", "Web3"],
  },
  {
    id: "user-types-explained",
    title: "Understanding User Types: Students, Contributors, Builders & Organizations",
    date: "2024-12-04",
    category: "Education",
    author: "Balaio Team",
    readTime: "6 min read",
    excerpt:
      "Learn about the different user types on Balaio and their unique capabilities, earning potential, and progression paths.",
    content: `Balaio serves different types of users, each with their own capabilities and earning potential.

**Students** earn 5–25 cUSD per task by learning Web3 fundamentals and completing educational assignments. This is where most new users start.

**Contributors** earn 10–200+ cUSD per task through community contributions, content creation, and various non-technical work. They form the backbone of most projects on the platform.

**Builders** take on technical work — development, smart contract integration, infrastructure — earning 50–500+ cUSD per task depending on complexity.

**Organizations** sit on the other side. They create and fund tasks, manage project budgets on-chain, and build contributor communities around their work.

Each user type can progress as they build their on-chain reputation. A student completing educational tasks today might be a builder shipping smart contracts next quarter. The progression is organic, driven by demonstrated capability rather than credentials.`,
    tags: ["Education", "User Types", "Getting Started"],
  },
  {
    id: "task-management-guide",
    title: "Complete Guide to Task Management on Balaio",
    date: "2024-12-07",
    category: "Tutorial",
    author: "Balaio Team",
    readTime: "7 min read",
    excerpt:
      "A comprehensive walkthrough of the task lifecycle on Balaio, from creation to completion and reward distribution.",
    content: `Tasks on Balaio follow a clear lifecycle from creation through payment.

**Creation** — A task creator sets a title, description, and reward amount, chooses how many slots are available, and deposits funds into the smart contract. The money is locked and visible before anyone starts working.

**Discovery** — Workers browse available tasks and filter by category, reward, or complexity. When something matches their skills, they claim a slot.

**Completion** — The worker does the job and submits proof — typically a link to their deliverable. The submission is recorded on-chain.

**Review & Payment** — The task creator reviews the submission and either approves it or requests changes. On approval, the smart contract releases the reward directly to the worker's wallet. No invoicing, no payment terms, no delays.

Every stage is tracked on-chain, so both parties can verify exactly where things stand at any point.`,
    tags: ["Tutorial", "Tasks", "Guide"],
  },
  {
    id: "celo-star-rankings",
    title: "Celo Star Rankings: Build Your Reputation",
    date: "2024-12-09",
    category: "Gamification",
    author: "Balaio Team",
    readTime: "5 min read",
    excerpt:
      "Learn how the Orkut-style Celo Star ranking system works and how to improve your ratings across all six categories.",
    content: `Balaio features an Orkut-inspired reputation system that rates users across six dimensions.

**Always On The Keyboard** measures consistency and responsiveness — how reliably you show up and communicate.

**Shipper** tracks your delivery record. Completing tasks on time and at quality builds this score.

**Can Trust** reflects reliability and honesty. It grows when you follow through on commitments.

**Web3 Native** captures blockchain knowledge and technical skills demonstrated through your work.

**Community Builder** rewards helping others, mentoring, and contributing beyond your own tasks.

**Celo Champion** is the overall score that combines everything above into a single reputation signal.

Higher rankings unlock better task opportunities and build trust with creators who are choosing between applicants. Your reputation is portable — it lives on-chain, not locked inside the platform.`,
    tags: ["Gamification", "Rankings", "Community"],
  },
]

export const blogCategories = [
  "All",
  "Platform",
  "Partnership",
  "Education",
  "Use Case",
  "Tutorial",
  "Gamification",
  "Learn2Earn",
  "Insights",
]
