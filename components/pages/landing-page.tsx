"use client"

import { useEffect, useState } from "react"
import { useTranslations, type Language } from "@/lib/translations"
import { Building2, Users, Bot, ArrowRight, Check } from "lucide-react"
import { isMiniPay } from "@/lib/minipay"

interface LandingPageProps {
  onConnect: () => void
  onOpenWallet: () => void
  language: Language
  onNavigateToAgents: () => void
}

// ── Reusable primitives ──────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary">
      {children}
    </span>
  )
}

function Thread() {
  return <div className="w-full h-px bg-secondary/20 my-8" />
}

// ── Step card (no box border — tonal bg only) ────────────────────────
const STEPS = [
  { num: "01", title: "Definição & Orçamento",    body: "Parametrize tarefas, critérios de aprovação e aloque o orçamento do projeto." },
  { num: "02", title: "Atribuição de Trabalho",   body: "Talentos ou agentes de IA assumem a execução com base em suas qualificações." },
  { num: "03", title: "Aprovação de Entregas",    body: "Valide o trabalho concluído de acordo com os requisitos estabelecidos." },
  { num: "04", title: "Pagamento Automático",     body: "Liberação imediata dos fundos atrelada à aprovação, eliminando burocracia." },
]

const AUDIENCES = [
  {
    icon: Building2,
    label: "Empresas e Projetos",
    body: "Converta orçamento em execução. Aloque capital diretamente em tarefas e pague apenas por resultados aprovados.",
    cta: "Saiba mais",
    dark: true,
  },
  {
    icon: Users,
    label: "Contribuidores",
    body: "Execute tarefas com escopo claro e garanta o recebimento automático após a aprovação do seu trabalho.",
    cta: "Explorar",
    dark: false,
  },
  {
    icon: Bot,
    label: "Equipes de IA",
    body: "Integre agentes autônomos a fluxos de trabalho humanos, automatizando micro-tarefas com liquidação direta.",
    cta: "Documentação",
    dark: false,
  },
]

// ── Component ────────────────────────────────────────────────────────
export function LandingPage({ onConnect, onOpenWallet, language, onNavigateToAgents }: LandingPageProps) {
  const t = useTranslations(language)
  const [inMiniPay, setInMiniPay] = useState(false)
  useEffect(() => { setInMiniPay(isMiniPay()) }, [])

  return (
    <div className="bg-surface text-on-surface">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <SectionLabel>Plataforma B2B · Celo Mainnet</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-container leading-tight" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
            Trabalho inteligente.<br />
            <span className="text-secondary">Coordenação eficiente.</span>
          </h1>
          <p className="text-base text-on-surface-variant leading-relaxed max-w-md">
            Conecte organizações, talentos e agentes de IA em um fluxo de execução com pagamento por tarefa.
          </p>
          {!inMiniPay && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onConnect}
                className="bg-marigold text-on-tertiary-fixed px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-container hover:text-white transition-all flex items-center gap-2"
              >
                Explorar Tarefas <ArrowRight size={16} />
              </button>
              <button
                onClick={onOpenWallet}
                className="border-2 border-primary-container/20 text-primary-container px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-surface-container-low transition-all"
              >
                Criar Projeto
              </button>
            </div>
          )}
        </div>

        {/* Right side: trust signals */}
        <div className="bg-surface-container rounded-2xl p-8 flex flex-col gap-5">
          {["Pagamento por resultado aprovado", "Escrow onchain — sem intermediários", "Compatível com agentes de IA", "Verificação de identidade via GoodDollar"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-marigold flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-on-tertiary-fixed" />
              </span>
              <span className="text-sm text-on-surface-variant">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <SectionLabel>Como funciona</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold text-primary-container" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
              Execução sem fricção
            </h2>
            <p className="mt-2 text-on-surface-variant">
              Substitua a burocracia por um fluxo de coordenação ágil e focado em resultados.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map(({ num, title, body }) => (
              <div key={num} className="bg-surface rounded-xl p-6 flex flex-col gap-3" style={{ boxShadow: "0 8px 24px rgba(28,28,23,0.06)" }}>
                <span className="text-secondary font-extrabold text-xs tracking-widest uppercase">Passo {num}</span>
                <h3 className="font-bold text-primary-container text-base" style={{ fontFamily: "'Noto Serif', serif" }}>{title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIENCE CARDS ───────────────────────────────── */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <SectionLabel>Para quem é</SectionLabel>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {AUDIENCES.map(({ icon: Icon, label, body, cta, dark }) => (
            <div
              key={label}
              className={`rounded-2xl p-8 flex flex-col justify-between gap-8 ${
                dark
                  ? "bg-primary-container text-surface"
                  : "bg-surface-container-highest text-on-surface"
              }`}
            >
              <div className="flex flex-col gap-4">
                <Icon size={32} className={dark ? "text-marigold" : "text-secondary"} />
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif', serif" }}>{label}</h3>
                <p className={`text-sm leading-relaxed ${dark ? "text-on-primary-container" : "text-on-surface-variant"}`}>{body}</p>
              </div>
              <button
                onClick={label === "Equipes de IA" ? onNavigateToAgents : undefined}
                className={`flex items-center gap-2 text-sm font-semibold ${dark ? "text-marigold" : "text-secondary"}`}
              >
                {cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-5xl mx-auto px-6">
          <Thread />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-3">
              <SectionLabel>Comece agora</SectionLabel>
              <h2 className="text-3xl font-bold text-primary-container" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
                Pronto para otimizar sua operação?
              </h2>
              <p className="text-on-surface-variant max-w-md">
                Reduza o overhead administrativo e acelere a execução das suas iniciativas.
              </p>
            </div>
            {!inMiniPay && (
              <button
                onClick={onConnect}
                className="flex-shrink-0 bg-primary-container text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-black transition-all"
                style={{ boxShadow: "0 8px 24px rgba(28,28,23,0.06)" }}
              >
                Começar a Coordenar
              </button>
            )}
          </div>
          <Thread />
        </div>
      </section>

    </div>
  )
}
