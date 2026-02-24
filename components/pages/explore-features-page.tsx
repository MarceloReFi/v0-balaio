"use client"

import { ArrowLeft, Zap, Users, Shield, Wallet, CheckCircle, Globe, Smartphone } from "lucide-react"
import type { Language } from "@/lib/translations"

interface ExploreFeaturesPageProps {
  onBack: () => void
  language: Language
}

const features = [
  {
    icon: Zap,
    titleEn: "Task Creation",
    titlePt: "Criacao de Tarefas",
    descEn: "Create tasks with clear requirements, set rewards in cUSD or USDC, and define how many workers can participate. Funds are locked in a smart contract ensuring guaranteed payment.",
    descPt: "Crie tarefas com requisitos claros, defina recompensas em cUSD ou USDC e determine quantos trabalhadores podem participar. Os fundos sao bloqueados em contrato inteligente garantindo pagamento.",
    color: "#FFFF66",
  },
  {
    icon: CheckCircle,
    titleEn: "Task Claiming",
    titlePt: "Reivindicar Tarefas",
    descEn: "Browse available tasks, claim ones matching your skills, and start working immediately. Your slot is reserved on-chain.",
    descPt: "Navegue pelas tarefas disponiveis, reivindique as que combinam com suas habilidades e comece a trabalhar imediatamente. Sua vaga e reservada on-chain, garantindo acesso justo.",
    color: "#99FF99",
  },
  {
    icon: Wallet,
    titleEn: "Instant Rewards",
    titlePt: "Recompensas Instantaneas",
    descEn: "Once your work is approved, rewards are released automatically to your wallet. No waiting, no intermediaries, no fees beyond gas costs.",
    descPt: "Assim que seu trabalho e aprovado, as recompensas sao liberadas automaticamente para sua carteira. Sem espera, sem intermediarios, sem taxas alem do gas.",
    color: "#FF99CC",
  },
  {
    icon: Users,
    titleEn: "Multi-User Workflow",
    titlePt: "Fluxo Multi-Usuario",
    descEn: "Tasks can have multiple slots, allowing several workers to complete the same task. Perfect for community initiatives, surveys, or distributed work.",
    descPt: "Tarefas podem ter multiplas vagas, permitindo que varios trabalhadores completem a mesma tarefa. Perfeito para iniciativas comunitarias ou trabalho distribuido.",
    color: "#FF99CC",
  },
  {
    icon: Shield,
    titleEn: "Blockchain Security",
    titlePt: "Seguranca Blockchain",
    descEn: "All transactions are recorded on Celo blockchain. Task creation, claims, submissions, and payments are transparent and verifiable by anyone.",
    descPt: "Todas as transacoes sao registradas na blockchain Celo. Criacao de tarefas, reivindicacoes, submissoes e pagamentos sao transparentes e verificaveis.",
    color: "#111111",
  },
  {
    icon: Globe,
    titleEn: "Wallet Integration",
    titlePt: "Integracao de Carteira",
    descEn: "Connect with Valora, MetaMask, or MiniPay. Works on mobile and desktop. No bank account needed to participate.",
    descPt: "Conecte com Valora, MetaMask ou MiniPay. Funciona perfeitamente em celular e desktop. Nenhuma conta bancaria necessaria.",
    color: "#99FF99",
  },
  {
    icon: Smartphone,
    titleEn: "Simple & Fast",
    titlePt: "Simples e Rapido",
    descEn: "Mobile-first design with minimal steps. Create a task in under a minute, claim with one tap, and receive payment once approved.",
    descPt: "Design mobile-first com passos minimos. Crie uma tarefa em menos de um minuto, reivindique com um toque e receba pagamentos instantaneamente.",
    color: "#FFFF66",
  },
]

export function ExploreFeaturesPage({ onBack, language }: ExploreFeaturesPageProps) {
  return (
    <div className="p-5 pb-24">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#111111] mb-4"
      >
        <ArrowLeft size={16} />
        {language === "en" ? "Back" : "Voltar"}
      </button>

      <div className="bg-[#111111] border-2 border-[#111111] rounded-xl p-6 mb-6 text-white shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <h1 className="text-2xl font-bold mb-2">
          {language === "en" ? "Explore Features" : "Explorar Recursos"}
        </h1>
        <p className="text-sm opacity-90">
          {language === "en"
            ? "Discover how Balaio helps you create, complete, and get paid for tasks on-chain."
            : "Descubra como o Balaio ajuda voce a criar, completar e receber por tarefas on-chain."}
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-white border-2 border-[#111111] rounded-xl p-4 hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 border-2 border-[#111111] rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: feature.color }}
                >
                  <Icon size={24} className={feature.color === "#111111" ? "text-white" : "text-[#111111]"} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {language === "en" ? feature.titleEn : feature.titlePt}
                  </h3>
                  <p className="text-sm text-[#666666]">
                    {language === "en" ? feature.descEn : feature.descPt}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-[#FFFF66] border-2 border-[#111111] rounded-xl p-4 text-center shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
        <p className="font-bold mb-2 text-[#111111]">
          {language === "en" ? "Ready to get started?" : "Pronto para comecar?"}
        </p>
        <p className="text-sm text-[#111111]">
          {language === "en"
            ? "Connect your wallet and explore available tasks!"
            : "Conecte sua carteira e explore as tarefas disponiveis!"}
        </p>
      </div>
    </div>
  )
}
