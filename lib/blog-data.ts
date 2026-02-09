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
    id: "future-of-learn2earn",
    title: "The Future of Learn2Earn in Web3",
    date: "2024-01-10",
    category: "Learn2Earn",
    author: "Maria Santos",
    readTime: "5 min read",
    featured: true,
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
    featured: true,
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

**Always On The Keyboard** ⌨️ measures consistency and responsiveness — how reliably you show up and communicate.

**Shipper** 🚀 tracks your delivery record. Completing tasks on time and at quality builds this score.

**Can Trust** 🤝 reflects reliability and honesty. It grows when you follow through on commitments.

**Web3 Native** 🌐 captures blockchain knowledge and technical skills demonstrated through your work.

**Community Builder** 👥 rewards helping others, mentoring, and contributing beyond your own tasks.

**Celo Champion** 🏆 is the overall score that combines everything above into a single reputation signal.

Higher rankings unlock better task opportunities and build trust with creators who are choosing between applicants. Your reputation is portable — it lives on-chain, not locked inside the platform.`,
    tags: ["Gamification", "Rankings", "Community"],
  },
]

export const blogCategories = ["All", "Platform", "Education", "Tutorial", "Gamification", "Learn2Earn", "Insights"]
