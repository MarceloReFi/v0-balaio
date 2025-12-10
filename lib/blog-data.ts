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
    content: `The future of education is being revolutionized by blockchain technology, and Learn2Earn platforms are at the forefront of this transformation.

Learn2Earn represents a paradigm shift where educational activities directly translate into economic rewards. Instead of spending years in traditional education systems without immediate financial returns, learners can now earn cryptocurrency tokens while acquiring new skills and knowledge.

Blockchain technology ensures that all educational achievements are permanently recorded, easily verifiable, tamper-proof, and globally accessible. Smart contracts automate the reward distribution, ensuring that learners receive their rewards fairly and promptly.`,
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
    content: `Balaio bridges the gap between Web3 education and real-world opportunities, creating a sustainable ecosystem where learning directly translates to earning.

Built with a mobile-first approach and featuring a distinctive pixel art aesthetic, the platform serves multiple user types with different capabilities and earning potential. Users can earn cUSD and USDC, participate in Celo Star Rankings, unlock achievement badges, and build their professional profiles.

Join us in building the future of Web3 education and earning!`,
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
    content: `Balaio serves multiple user types, each with unique capabilities and earning potential.

Students learn Web3 fundamentals and earn while building skills, with earning potential of 5-25 cUSD per learning task.

Contributors complete tasks and earn income while contributing to Web3 projects, with earning potential of 10-200+ cUSD per task based on complexity.

Builders are technical contributors focused on development, with access to high-complexity technical tasks and earning potential of 50-500+ cUSD per technical task.

Organizations create tasks, manage projects, and build teams by setting custom rewards and requirements.`,
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
    content: `Understanding the complete task lifecycle will help you make the most of Balaio.

Tasks go through four stages: Creation (where organizations set requirements and rewards), Discovery & Claiming (where contributors browse and claim tasks), Completion & Submission (where work is submitted for review), and Review & Approval (where creators approve or reject submissions).

Each stage is transparent and tracked on the blockchain, ensuring fair treatment for all participants.`,
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
    content: `Our Orkut-style community rating system measures your contributions across 6 unique categories.

The six categories are: Always On The Keyboard (responsiveness), Shipper (on-time delivery), Can Trust (reliability), Web3 Native (technical knowledge), Community Builder (ecosystem growth), and Celo Champion (outstanding contribution).

Rankings help you build reputation, attract better opportunities, earn more with priority access to high-value tasks, and track your personal growth on the platform.`,
    tags: ["Gamification", "Rankings", "Community"],
  },
]

export const blogCategories = ["All", "Platform", "Education", "Tutorial", "Gamification", "Learn2Earn"]
