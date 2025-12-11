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
    content: `Learn2Earn platforms are revolutionizing education by combining learning with earning. Through blockchain technology, educational achievements are permanently recorded and verified globally. Smart contracts ensure fair reward distribution, making education more accessible and rewarding.`,
    tags: ["Learn2Earn", "Web3", "Education"],
  },
  {
    id: "welcome-to-balaio",
    title: "Welcome to Balaio: Your Web3 Learn2Earn Platform",
    date: "2024-11-30",
    category: "Platform",
    author: "Balaio Team",
    readTime: "4 min read",
    excerpt:
      "Discover how Balaio bridges the gap between Web3 education and real-world opportunities through task-based learning and earning.",
    content: `Balaio bridges Web3 education with real opportunities through task-based learning. Built mobile-first with pixel art aesthetics, it serves multiple user types. Earn cUSD and USDC, participate in rankings, and build your Web3 profile.`,
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
    content: `Balaio serves Students (learn fundamentals, 5-25 cUSD), Contributors (complete tasks, 10-200+ cUSD), Builders (technical work, 50-500+ cUSD), and Organizations (create tasks and manage projects). Each type has unique capabilities and earning potential.`,
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
    content: `Tasks move through four stages: Creation (set requirements), Discovery (browse and claim), Completion (submit work), and Review (approval/rejection). All stages are blockchain-tracked for transparency and fairness.`,
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
    content: `Orkut-style ratings across 6 categories: Always On The Keyboard, Shipper, Can Trust, Web3 Native, Community Builder, and Celo Champion. Rankings help you build reputation and access better opportunities.`,
    tags: ["Gamification", "Rankings", "Community"],
  },
]

export const blogCategories = ["All", "Platform", "Education", "Tutorial", "Gamification", "Learn2Earn"]
