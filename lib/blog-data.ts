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
    content: `The future of education is being revolutionized by blockchain technology, and Learn2Earn platforms are at the forefront of this transformation. As we move into a more decentralized world, the traditional barriers between learning and earning are dissolving.

## What is Learn2Earn?

Learn2Earn represents a paradigm shift where educational activities directly translate into economic rewards. Instead of spending years in traditional education systems without immediate financial returns, learners can now earn cryptocurrency tokens while acquiring new skills and knowledge.

## Key Benefits

### For Learners
- Earn while you learn
- Access to global opportunities
- Verifiable credentials on blockchain
- Direct path to employment

### For Educators
- New revenue streams
- Global reach
- Transparent reward systems

## The Role of Blockchain

Blockchain technology ensures that all educational achievements are:
- Permanently recorded
- Easily verifiable
- Tamper-proof
- Globally accessible

Smart contracts automate the reward distribution, ensuring that learners receive their rewards fairly and promptly.

## Web3 Integration

The integration with Web3 technologies allows for:
- Decentralized credential verification
- Peer-to-peer knowledge sharing
- Community governance of educational content
- Cross-platform skill recognition

## Real-World Applications

We're already seeing Learn2Earn platforms making real impact:

### Rural Communities
Providing economic opportunities in underserved areas

### Professional Development
Helping workers adapt to changing job markets

### Student Support
Offering financial assistance through learning activities

## The Future Outlook

As blockchain adoption grows, we expect to see:
- More sophisticated learning verification systems
- Integration with traditional educational institutions
- Greater emphasis on practical, applicable skills

The Learn2Earn model isn't just about earning money while learning—it's about creating a more equitable, accessible, and practical educational ecosystem for everyone.

## Getting Started

Ready to join the Learn2Earn revolution? Start by:
1. Exploring available tasks and opportunities
2. Building your skills through practical projects
3. Connecting with the community
4. Contributing your own knowledge and expertise

The future of education is here, and it's more rewarding than ever.`,
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
    content: `# Welcome to Balaio

Balaio bridges the gap between Web3 education and real-world opportunities, creating a sustainable ecosystem where learning directly translates to earning. Built with a mobile-first approach and featuring a distinctive pixel art aesthetic, the platform serves multiple user types with different capabilities and earning potential.

## Key Features

### Earning & Rewards
- **cUSD & USDC Payments**: Instant payments in stable currencies
- **Skill-Based Pricing**: Higher rewards for specialized skills
- **Multiple Validation Types**: URL submission, file upload, manual review, auto-verification
- **Transparent Rewards**: Clear reward structure for all task types

### Gamification & Social
- **Celo Star Rankings**: Orkut-style community ratings across 6 categories
- **Achievement Badges**: Unlock badges for milestones
- **User Profiles**: Showcase skills, achievements, and work portfolio
- **Community Building**: Connect with other learners and organizations

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
    content: `# User Types & Capabilities

Balaio serves multiple user types, each with unique capabilities and earning potential.

## Students
**Purpose**: Learn Web3 fundamentals and earn while building skills

**Capabilities**:
- Browse and complete learning tasks
- Earn cUSD/USDC tokens for task completion
- Progress through skill levels
- Access educational content and tutorials
- Build portfolio of completed work

**Earning Potential**: 5-25 cUSD per learning task

## Contributors
**Purpose**: Complete tasks and earn income while contributing to Web3 projects

**Capabilities**:
- Access all public tasks on the platform
- Claim and complete various task types
- Submit work for review and approval
- Build reputation through Celo Star rankings

**Earning Potential**: 10-200+ cUSD per task (based on complexity)

## Builders
**Purpose**: Technical contributors focused on development

**Capabilities**:
- Access to high-complexity technical tasks
- Smart contract development opportunities
- API and integration projects
- Technical auditing and security reviews

**Earning Potential**: 50-500+ cUSD per technical task

## Organizations (Partners)
**Purpose**: Create tasks, manage projects, and build teams

**Capabilities**:
- Create and manage tasks for their projects
- Set custom rewards and requirements
- Review and approve task submissions
- Build talent pools of trusted contributors`,
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
    content: `# Task Management System

Understanding the complete task lifecycle will help you make the most of Balaio.

## Task Lifecycle

### 1. Task Creation
Organizations and administrators can create tasks with:
- Title and detailed instructions
- Category selection (Education, Research, Event, Partner Task, Other)
- Complexity level (Low, Medium, High)
- Reward amount in cUSD or USDC
- Number of available slots
- Validation method selection

### 2. Task Discovery & Claiming
Contributors can:
- Browse tasks by category, complexity, or reward
- View detailed task information
- Claim available task slots
- Track deadlines

### 3. Task Completion & Submission
After completing work:
- Submit proof based on validation method
- Task status changes to "Pending"
- Submission enters review queue

### 4. Review & Approval
Task creators review submissions:
- Approved: Task marked "Completed", reward distributed
- Rejected: Task returns to "Claimed" with feedback`,
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
    content: `# Celo Star Rankings

Our Orkut-style community rating system measures your contributions across 6 unique categories.

## The Six Categories

### 1. Always On The Keyboard (AFK) 💬
Measures responsiveness and communication based on task completion frequency.

### 2. Shipper 🚀
Measures on-time delivery performance and deadline adherence.

### 3. Can Trust 🤝
Measures reliability based on earnings history and completion rate.

### 4. Web3 Native 🔗
Measures technical blockchain knowledge from technical task completion.

### 5. Community Builder 🏗️
Measures contribution to ecosystem growth through community engagement.

### 6. Celo Champion 🏆
Measures outstanding platform contribution based on high earnings and impact.

## Why Rankings Matter

- Build reputation and attract better opportunities
- Earn more with priority for high-value tasks
- Gain community trust
- Track personal growth`,
    tags: ["Gamification", "Rankings", "Community"],
  },
]

export const blogCategories = ["All", "Platform", "Education", "Tutorial", "Gamification", "Learn2Earn"]
