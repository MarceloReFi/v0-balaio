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
    content: `Learn2Earn platforms are revolutionizing education by combining learning with earning. Through blockchain technology, educational achievements are permanently recorded and verified globally.

**Why Learn2Earn Matters**

Traditional education often leaves students in debt with no guarantee of employment. Learn2Earn flips this model: you gain skills while earning cryptocurrency, building both knowledge and financial resources simultaneously.

**How It Works on Balaio**

1. Browse available learning tasks
2. Complete educational modules or micro-tasks
3. Submit proof of completion
4. Receive instant crypto rewards

Smart contracts ensure fair reward distribution, making education more accessible and rewarding for everyone, regardless of their location or background.`,
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
    content: `The freelance economy is undergoing a fundamental transformation. Web3 technology is solving the biggest pain points that have plagued freelancers for decades.

**The Problems with Traditional Freelancing**

- Payment delays of 30-90 days
- Platform fees of 20-30%
- Disputes with no clear resolution
- Limited access to global opportunities
- No portable reputation

**The Web3 Solution**

Balaio and similar platforms leverage blockchain to create a fairer ecosystem:

**Instant Payments**: Smart contracts release funds immediately upon task approval. No more waiting weeks for payment.

**Low Fees**: Without intermediary banks and payment processors, fees drop dramatically. More money stays with the workers.

**Transparent Contracts**: Every task, submission, and payment is recorded on-chain. Disputes become rare because everything is verifiable.

**Global Access**: Anyone with a wallet can participate. No bank account needed, no geographic restrictions.

**Portable Reputation**: Your work history lives on the blockchain, following you across platforms and projects.

**Getting Started**

1. Connect your Celo wallet (Valora, MetaMask, or MiniPay)
2. Browse available tasks matching your skills
3. Claim and complete tasks
4. Build your on-chain reputation

The future of work is transparent, instant, and accessible. Welcome to Web3 freelancing.`,
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
    content: `One of the most powerful features of blockchain-based task platforms is complete budget transparency. Every token is tracked, every payment is visible, and every allocation is accountable.

**The Old Way: Hidden Budgets**

Traditional platforms operate as black boxes:
- You don't know how much the client paid
- Platform fees are opaque
- Budget allocation is hidden
- No way to verify fair payment

**The Balaio Way: Full Transparency**

When a task is created on Balaio:

1. **Funds Are Locked**: The reward is deposited into the smart contract upfront. Workers know the money exists.

2. **Visible Allocation**: Anyone can verify how much is allocated per slot, total budget, and remaining funds.

3. **Automatic Distribution**: Upon approval, rewards are released automatically. No manual intervention, no delays.

4. **Audit Trail**: Every transaction is permanently recorded on Celo blockchain, viewable by anyone.

**Benefits for Everyone**

**For Workers**: Confidence that payment is guaranteed. No more "the check is in the mail."

**For Task Creators**: Build trust with your community. Show you're a fair employer.

**For the Ecosystem**: Higher completion rates, better quality work, stronger community.

**Real-World Impact**

Projects using transparent budgets on Balaio report:
- 40% higher task completion rates
- Faster time-to-completion
- Better quality submissions
- Stronger long-term relationships with workers

Transparency isn't just nice to have—it's the foundation of trust in the decentralized economy.`,
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

Web3 has an adoption problem. Most apps require users to:
- Understand gas fees
- Navigate complex UIs
- Manage multiple tokens
- Learn new paradigms

The result? Only crypto-natives can use them.

**Our Philosophy: Simple & Functional**

Balaio is built on three principles:

**1. Mobile-First Design**
Most of the world accesses the internet via smartphone. Our interface is designed for one-handed use, with large buttons and clear actions.

**2. Minimal Steps**
- Connect wallet: 1 tap
- Create task: 3 fields
- Claim task: 1 tap
- Submit work: 1 field

Every additional step loses users. We obsess over removing friction.

**3. Clear Feedback**
Users always know:
- What just happened
- What they can do next
- How much they earned/spent

**Why This Matters for Adoption**

Simple apps aren't just easier to use—they're more inclusive:

- **Low Connectivity**: Works on slow networks
- **Limited Data**: Lightweight pages load fast
- **New Users**: No learning curve required
- **Accessibility**: Clear design helps everyone

**The Result**

Users from Fortaleza to São Paulo are completing tasks on Balaio—many using Web3 for the first time. Simplicity is our superpower.

Build simple. Ship fast. Iterate based on real feedback. That's the Balaio way.`,
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

- **Mobile-First**: Designed for smartphones, works anywhere
- **Instant Payments**: Rewards sent directly to your wallet
- **Transparent**: All payments verified on Celo blockchain
- **Simple**: No complex DeFi knowledge required

**Who Uses Balaio**

- **Workers**: Complete tasks, earn cUSD/USDC
- **Organizations**: Create tasks, build community
- **Projects**: Distribute rewards transparently

**Getting Started**

1. Download Valora or MiniPay
2. Visit Balaio and connect your wallet
3. Browse available tasks
4. Claim, complete, and earn

Welcome to the future of work.`,
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
    content: `Balaio serves different types of users, each with unique capabilities and earning potential:

**Students** (5-25 cUSD per task)
- Learn Web3 fundamentals
- Complete educational tasks
- Build foundational skills

**Contributors** (10-200+ cUSD per task)
- Complete various tasks
- Community contributions
- Content creation

**Builders** (50-500+ cUSD per task)
- Technical development
- Smart contract work
- Infrastructure building

**Organizations**
- Create and fund tasks
- Manage project budgets
- Build contributor communities

Each user type can progress and unlock new opportunities as they build their on-chain reputation.`,
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
    content: `Tasks on Balaio follow a clear lifecycle:

**1. Creation**
- Set title and description
- Define reward amount
- Choose number of slots
- Deposit funds to smart contract

**2. Discovery**
- Workers browse available tasks
- Filter by category, reward, complexity
- Claim tasks that match skills

**3. Completion**
- Complete the work
- Submit proof (link, file, description)
- Wait for review

**4. Review & Payment**
- Task creator reviews submission
- Approve or request changes
- Rewards released automatically on approval

All stages are tracked on-chain for complete transparency.`,
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
    content: `Build your reputation with our Orkut-inspired rating system across 6 categories:

**Always On The Keyboard** ⌨️
Consistency and responsiveness

**Shipper** 🚀
Completing tasks and delivering results

**Can Trust** 🤝
Reliability and honesty

**Web3 Native** 🌐
Blockchain knowledge and skills

**Community Builder** 👥
Helping others and contributing

**Celo Champion** 🏆
Overall excellence on the platform

Higher rankings unlock better opportunities and build trust with task creators.`,
    tags: ["Gamification", "Rankings", "Community"],
  },
]

export const blogCategories = ["All", "Platform", "Education", "Tutorial", "Gamification", "Learn2Earn", "Insights"]
