"use client"

interface HomePageProps {
  setCurrentPage: (page: "home" | "tasks" | "profile") => void
  setShowCreateModal: (show: boolean) => void
}

export function HomePage({ setCurrentPage, setShowCreateModal }: HomePageProps) {
  const opportunities = [
    {
      title: "Celo Public Goods - Support Streams",
      type: "Grant",
      description: "Submit your Support Stream application and earn bi-weekly CELO incentive budgets",
      provider: "Celo Foundation",
      amount: "Bi-weekly CELO",
      deadline: "Rolling",
      tags: ["Grant", "Support", "Celo"],
    },
    {
      title: "Builder Rewards Program",
      type: "Rewards",
      description: "Monthly rewards program by Celo PG x Talent Protocol",
      provider: "Celo PG",
      amount: "10,000 CELO/month",
      deadline: "Monthly",
      tags: ["Rewards", "Builder", "Monthly"],
    },
    {
      title: "Prezenti Grants",
      type: "Grant",
      description: "Apply for Prezenti grants to fund your Celo project",
      provider: "Prezenti",
      amount: "Up to $50,000",
      deadline: "Rolling",
      tags: ["Grant", "Funding", "Celo"],
    },
    {
      title: "Celo Camp Accelerator",
      type: "Accelerator",
      description: "The ecosystem's flagship accelerator that helps elevate projects to the next level",
      provider: "Celo Foundation",
      amount: "Varies",
      deadline: "Cohort-based",
      tags: ["Accelerator", "Mentorship", "Ecosystem"],
    },
  ]

  return (
    <div className="p-5 pb-24">
      <div className="bg-gradient-to-r from-[#2B325C] via-[#636D4F] to-[#F2E885] border-2 border-black p-8 mb-5 text-center">
        <div className="text-4xl mb-3">🚀</div>
        <h2 className="text-2xl font-bold mb-2 text-white">Discover All Features</h2>
        <p className="text-sm mb-4 text-white/90">
          AI-powered task creation, mobile-first design, and comprehensive tools for every user type
        </p>
        <button
          onClick={() => setCurrentPage("tasks")}
          className="bg-[#FFF244] text-black px-6 py-3 font-bold border-2 border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow inline-flex items-center gap-2"
        >
          📋 Explore Features
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">📋 Latest Tasks</h3>
          <button
            onClick={() => setCurrentPage("tasks")}
            className="bg-[#C36DF0] text-white px-4 py-2 text-sm font-bold border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
          >
            + More
          </button>
        </div>

        <div className="grid gap-3">
          <div className="bg-white border-2 border-black p-4">
            <h4 className="font-bold text-base mb-2">Complete Celo DeFi Tutorial</h4>
            <p className="text-xs text-gray-600 mb-3">
              Complete the Celo DeFi tutorial and submit the completion certificate URL
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1">💰 5 cUSD</span>
              <span className="flex items-center gap-1">👥 10 slots</span>
              <span className="flex items-center gap-1">⏱️ 694d ago</span>
              <span className="bg-[#636D4F] text-white px-2 py-1 font-bold">Active</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="bg-[#636D4F] text-white px-4 py-2 text-sm font-bold border-2 border-black flex-1">
                View
              </button>
              <button className="bg-[#D96E5F] text-white px-4 py-2 text-sm font-bold border-2 border-black">
                Claim
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <h4 className="font-bold text-base mb-2">Research Web3 Impact Projects</h4>
            <p className="text-xs text-gray-600 mb-3">
              Research and document 5 Web3 projects making social impact. Submit a 2-page report.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1">💰 15 cUSD</span>
              <span className="flex items-center gap-1">👥 5 slots</span>
              <span className="flex items-center gap-1">⏱️ 695d ago</span>
              <span className="bg-[#636D4F] text-white px-2 py-1 font-bold">Active</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="bg-[#636D4F] text-white px-4 py-2 text-sm font-bold border-2 border-black flex-1">
                View
              </button>
              <button className="bg-[#D96E5F] text-white px-4 py-2 text-sm font-bold border-2 border-black">
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">🚀 Opportunities</h3>
          <button className="bg-[#C36DF0] text-white px-4 py-2 text-sm font-bold border-2 border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow">
            + More
          </button>
        </div>

        <div className="grid gap-3">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-white border-2 border-black p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-base flex-1">{opp.title}</h4>
              </div>

              <div className="mb-2">
                <span
                  className={`px-2 py-1 text-xs font-bold border-2 border-black ${
                    opp.type === "Grant"
                      ? "bg-[#636D4F] text-white"
                      : opp.type === "Rewards"
                        ? "bg-[#C36DF0] text-white"
                        : opp.type === "Accelerator"
                          ? "bg-[#FFF244] text-black"
                          : "bg-[#D96E5F] text-white"
                  }`}
                >
                  {opp.type}
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-3">{opp.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                <span className="flex items-center gap-1">🏢 {opp.provider}</span>
                <span className="flex items-center gap-1">💰 {opp.amount}</span>
                <span className="flex items-center gap-1">📅 {opp.deadline}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {opp.tags.map((tag) => (
                  <span key={tag} className="bg-white border border-black px-2 py-0.5 text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <button className="bg-[#D96E5F] text-white px-4 py-2 text-sm font-bold border-2 border-black w-full hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
