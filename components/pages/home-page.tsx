"use client"

import { useTranslations, type Language } from "@/lib/translations"

interface HomePageProps {
  onConnect: () => void
  language: Language
}

export function HomePage({ onConnect, language }: HomePageProps) {
  const t = useTranslations(language)

  const opportunities = [
    {
      title: t.celoPublicGoods,
      type: "Grant",
      description: t.celoPublicGoodsDesc,
      provider: "Celo Foundation",
      amount: language === "en" ? "Bi-weekly CELO" : "CELO quinzenal",
      deadline: language === "en" ? "Rolling" : "Contínuo",
      tags: language === "en" ? ["Grant", "Support", "Celo"] : ["Subsídio", "Suporte", "Celo"],
      link: "https://www.celopg.eco/",
    },
    {
      title: t.celoBuilderFund,
      type: language === "en" ? "Rewards" : "Recompensas",
      description: t.celoBuilderFundDesc,
      provider: "Celo PG",
      amount: language === "en" ? "10,000 CELO/month" : "10.000 CELO/mês",
      deadline: language === "en" ? "Monthly" : "Mensal",
      tags: language === "en" ? ["Rewards", "Builder", "Monthly"] : ["Recompensas", "Construtor", "Mensal"],
      link: "https://www.celopg.eco/programs/celo-builder-fund",
    },
    {
      title: t.prezentiGrants,
      type: language === "en" ? "Grant" : "Subsídio",
      description: t.prezentiGrantsDesc,
      provider: "Prezenti",
      amount: language === "en" ? "Up to $50,000" : "Até $50.000",
      deadline: language === "en" ? "Rolling" : "Contínuo",
      tags: language === "en" ? ["Grant", "Funding", "Celo"] : ["Subsídio", "Financiamento", "Celo"],
      link: "http://prezenti.xyz/",
    },
    {
      title: t.celoCamp,
      type: language === "en" ? "Accelerator" : "Aceleradora",
      description: t.celoCampDesc,
      provider: "Celo Foundation",
      amount: language === "en" ? "Varies" : "Varia",
      deadline: language === "en" ? "Cohort-based" : "Por turma",
      tags: language === "en" ? ["Accelerator", "Mentorship", "Ecosystem"] : ["Aceleradora", "Mentoria", "Ecossistema"],
      link: "https://www.celocamp.com/",
    },
  ]

  return (
    <div className="p-5 pb-24">
      {/* Opportunities Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold flex items-center gap-2">🚀 {t.opportunities}</h3>
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
                    opp.type.includes("Grant") || opp.type.includes("Subsídio")
                      ? "bg-[#636D4F] text-white"
                      : opp.type.includes("Rewards") || opp.type.includes("Recompensas")
                        ? "bg-[#C36DF0] text-white"
                        : opp.type.includes("Accelerator") || opp.type.includes("Aceleradora")
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

              <a
                href={opp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D96E5F] text-white px-4 py-2 text-sm font-bold border-2 border-black w-full hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow block text-center"
              >
                {t.knowMore}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
