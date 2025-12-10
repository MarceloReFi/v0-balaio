export interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: "welcome-to-balaio",
    title: "Welcome to Balaio: Your Web3 Learn2Earn Platform",
    date: "2024-12-01",
    category: "Platform",
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
    date: "2024-12-05",
    category: "Education",
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

**Progression Path**: Complete 5 learning tasks → Unlock Contributor Badge → Access to all platform tasks

## Contributors
**Purpose**: Complete tasks and earn income while contributing to Web3 projects

**Capabilities**:
- Access all public tasks on the platform
- Claim and complete various task types
- Submit work for review and approval
- Build reputation through Celo Star rankings
- Create organizations to become Partners

**Earning Potential**: 10-200+ cUSD per task (based on complexity)

## Builders
**Purpose**: Technical contributors focused on development

**Capabilities**:
- Access to high-complexity technical tasks
- Smart contract development opportunities
- API and integration projects
- Technical auditing and security reviews
- Mentorship opportunities

**Earning Potential**: 50-500+ cUSD per technical task

## Organizations (Partners)
**Purpose**: Create tasks, manage projects, and build teams

**Capabilities**:
- Create and manage tasks for their projects
- Set custom rewards and requirements
- Review and approve task submissions
- Build talent pools of trusted contributors
- Access analytics and performance metrics`,
    tags: ["Education", "User Types", "Getting Started"],
  },
  {
    id: "task-management-guide",
    title: "Complete Guide to Task Management on Balaio",
    date: "2024-12-08",
    category: "Tutorial",
    excerpt:
      "A comprehensive walkthrough of the task lifecycle on Balaio, from creation to completion and reward distribution.",
    content: `# Task Management System

Understanding the complete task lifecycle will help you make the most of Balaio.

## Task Lifecycle

### 1. Task Creation
**Who**: Organizations, Administrators

**Process**:
1. Fill out task creation form with title, instructions, and requirements
2. Choose category (Education, Research, Event, Partner Task, Other)
3. Set complexity level (Low, Medium, High)
4. Define reward amount in cUSD or USDC
5. Set number of available slots
6. Choose validation method:
   - **Manual Review**: Human review of submitted work
   - **File Upload**: Contributors upload files
   - **URL Submission**: Submit links to completed work
   - **Auto Verification**: System automatically validates

### 2. Task Discovery & Claiming
**Who**: Students, Contributors, Builders

**Process**:
1. Browse tasks by category, complexity, reward, or tags
2. View detailed task information including organization profile
3. Claim task if slots are available
4. Task status changes to "Claimed"
5. Deadline tracking begins

### 3. Task Completion & Submission
**Who**: Task claimants

**Process**:
1. Complete work according to instructions
2. Submit proof based on validation method
3. Task status changes to "Pending"
4. Submission enters review queue

### 4. Review & Approval
**Who**: Task creators, Administrators

**Process**:
1. Review submitted work against requirements
2. Provide feedback if needed
3. Approve or reject submission:
   - **Approved**: Task marked "Completed", reward distributed
   - **Rejected**: Task returns to "Claimed" with feedback

## Task Categories

### Education
Learning modules, tutorials, skill assessments, educational content creation

### Research
Market analysis, technical research, competitive analysis, trend identification

### Events
Conference attendance, workshop facilitation, community event organization

### Partner Tasks
Organization-specific projects, brand collaboration, custom development

### Other
General tasks, experimental projects, community contributions`,
    tags: ["Tutorial", "Tasks", "Guide"],
  },
  {
    id: "celo-star-rankings",
    title: "Celo Star Rankings: Build Your Reputation",
    date: "2024-12-10",
    category: "Gamification",
    excerpt:
      "Learn how the Orkut-style Celo Star ranking system works and how to improve your ratings across all six categories.",
    content: `# Celo Star Rankings

Our Orkut-style community rating system measures your contributions across 6 unique categories.

## The Six Categories

### 1. Always On The Keyboard (AFK) 💬
**Measures**: Responsiveness and communication
**Based on**: Task completion frequency and activity level
**How to improve**: Stay active, complete tasks regularly, respond quickly

### 2. Shipper 🚀
**Measures**: On-time delivery performance
**Based on**: Deadline adherence and timely completion
**How to improve**: Submit work before deadlines, plan your time well

### 3. Can Trust 🤝
**Measures**: Reliability and trustworthiness
**Based on**: Earnings history and completion rate
**How to improve**: Complete tasks successfully, build long-term track record

### 4. Web3 Native 🔗
**Measures**: Technical blockchain knowledge
**Based on**: Technical task completion and complexity
**How to improve**: Take on technical tasks, learn blockchain development

### 5. Community Builder 🏗️
**Measures**: Contribution to ecosystem growth
**Based on**: Community engagement and leadership
**How to improve**: Help others, create content, organize events

### 6. Celo Champion 🏆
**Measures**: Outstanding platform contribution
**Based on**: High earnings and significant impact
**How to improve**: Consistently deliver exceptional work, take on challenging tasks

## Why Rankings Matter

- **Build Reputation**: Higher rankings attract better opportunities
- **Earn More**: Top-ranked users get priority for high-value tasks
- **Community Trust**: Rankings help organizations find reliable contributors
- **Personal Growth**: Track your progress and identify areas to improve

Start building your reputation today by completing tasks and engaging with the community!`,
    tags: ["Gamification", "Rankings", "Community"],
  },
  {
    id: "getting-started-celo",
    title: "Getting Started with Celo: Wallets, cUSD & USDC",
    date: "2024-12-12",
    category: "Education",
    excerpt:
      "A beginner-friendly guide to setting up your Celo wallet and understanding the stable currencies used on Balaio.",
    content: `# Getting Started with Celo

Balaio is built on the Celo blockchain, offering fast, low-cost transactions with stable currencies.

## Supported Wallets

### Valora
The official Celo mobile wallet with built-in support for cUSD and USDC.
- Download: [valora.xyz](https://valora.xyz)
- Best for: Mobile-first users
- Features: Easy onboarding, phone number recovery

### MiniPay
Opera's integrated Celo wallet for seamless payments.
- Available in Opera Mini browser
- Best for: Quick transactions
- Features: Browser integration, low friction

### MetaMask
Popular multi-chain wallet with Celo support.
- Download: [metamask.io](https://metamask.io)
- Best for: Desktop users, multi-chain needs
- Features: Wide ecosystem support

## Understanding Stable Currencies

### cUSD (Celo Dollar)
- Pegged to USD (1 cUSD ≈ $1)
- Native to Celo blockchain
- Low transaction fees
- 18 decimal places

### USDC (USD Coin)
- Circle's stablecoin on Celo
- Widely recognized and trusted
- Also pegged to USD
- 6 decimal places

Both currencies can be used for task rewards on Balaio!

## Adding Celo to MetaMask

1. Open MetaMask and click "Add Network"
2. Enter Celo Mainnet details:
   - Network Name: Celo
   - RPC URL: https://forno.celo.org
   - Chain ID: 42220
   - Currency Symbol: CELO
   - Block Explorer: https://explorer.celo.org

3. Save and switch to Celo network

## Getting Your First Tokens

You can acquire cUSD or USDC by:
- Completing tasks on Balaio
- Using on-ramps like Ramp or MoonPay
- Swapping CELO on Ubeswap or Mobius
- Receiving from other users

Welcome to the Celo ecosystem!`,
    tags: ["Education", "Celo", "Getting Started", "Wallets"],
  },
]
