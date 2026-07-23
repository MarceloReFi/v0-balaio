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

const PARTNERS = [
  { name: "GoodDollar",           src: "/GoodDapp_Primary.webp" },
  { name: "Green Pill Brasil",    src: "/greenpill-logo.png" },
  { name: "Blockchain na Escola", src: "/blockchain na escola.png" },
  { name: "UNIFACS",              src: "https://www.unifacs.br/assets/img/logo-unifacs.svg" },
]

// ── Component ────────────────────────────────────────────────────────
export function LandingPage({ onConnect, onOpenWallet, language, onNavigateToAgents }: LandingPageProps) {
  const t = useTranslations(language)
  const [inMiniPay, setInMiniPay] = useState(false)
  const [showEmpresasModal, setShowEmpresasModal] = useState(false)
  const [showProfissionaisModal, setShowProfissionaisModal] = useState(false)
  useEffect(() => { setInMiniPay(isMiniPay()) }, [])

  const STEPS = [
    { num: "01", title: t.landingStep1Title, body: t.landingStep1Body },
    { num: "02", title: t.landingStep2Title, body: t.landingStep2Body },
    { num: "03", title: t.landingStep3Title, body: t.landingStep3Body },
    { num: "04", title: t.landingStep4Title, body: t.landingStep4Body },
  ]

  const AUDIENCES = [
    {
      id: "companies",
      icon: Building2,
      label: t.landingAudienceCompaniesLabel,
      body: t.landingAudienceCompaniesBody,
      cta: t.landingAudienceCompaniesCta,
      dark: false,
    },
    {
      id: "professionals",
      icon: Users,
      label: t.landingAudienceProfessionalsLabel,
      body: t.landingAudienceProfessionalsBody,
      cta: t.landingAudienceProfessionalsCta,
      dark: false,
    },
    {
      id: "ai",
      icon: Bot,
      label: t.landingAudienceAiLabel,
      body: t.landingAudienceAiBody,
      cta: t.landingAudienceAiCta,
      dark: false,
    },
  ]

  return (
    <div className="bg-surface text-on-surface">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-container leading-tight" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
            {t.landingHeroTitle1}<br />
            <span className="text-secondary">{t.landingHeroTitle2}</span>
          </h1>
          <p className="text-base text-on-surface-variant leading-relaxed max-w-md">
            {t.landingHeroSubtitle}
          </p>
          {!inMiniPay && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onConnect}
                className="bg-marigold text-on-tertiary-fixed px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-container hover:text-on-primary transition-all flex items-center gap-2"
              >
                {t.cta2} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right side: trust signals */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="Balaio" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-primary-container text-lg" style={{ fontFamily: "'Noto Serif', serif" }}>Balaio</span>
          </div>
          <div className="bg-surface-container rounded-2xl p-8 flex flex-col gap-5">
            {[t.landingTrust1, t.landingTrust2, t.landingTrust3, t.landingTrust4].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-marigold flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-on-tertiary-fixed" />
                </span>
                <span className="text-sm text-on-surface-variant">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <SectionLabel>{t.landingStepsLabel}</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold text-primary-container" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
              {t.landingStepsTitle}
            </h2>
            <p className="mt-2 text-on-surface-variant">
              {t.landingStepsSubtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map(({ num, title, body }) => (
              <div key={num} className="bg-surface rounded-xl p-6 flex flex-col gap-3" style={{ boxShadow: "0 8px 24px rgba(28,28,23,0.06)" }}>
                <span className="text-secondary font-extrabold text-xs tracking-widest uppercase">{t.landingStepLabel} {num}</span>
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
          <SectionLabel>{t.landingAudienceLabel}</SectionLabel>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {AUDIENCES.map(({ id, icon: Icon, label, body, cta, dark }) => (
            <div
              key={id}
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
                onClick={
                  id === "companies" ? () => setShowEmpresasModal(true)
                  : id === "professionals" ? () => setShowProfissionaisModal(true)
                  : id === "ai" ? onNavigateToAgents
                  : undefined
                }
                className={`flex items-center gap-2 text-sm font-semibold ${dark ? "text-marigold" : "text-secondary"}`}
              >
                {cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────── */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionLabel>{t.landingPartnersLabel}</SectionLabel>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {PARTNERS.map(({ name, src }) => (
              <img
                key={name}
                src={src}
                alt={name}
                className="h-[52px] object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-5xl mx-auto px-6">
          <Thread />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-3">
              <SectionLabel>{t.landingCtaLabel}</SectionLabel>
              <h2 className="text-3xl font-bold text-primary-container" style={{ fontFamily: "'Noto Serif', serif", letterSpacing: "-0.02em" }}>
                {t.landingCtaTitle}
              </h2>
              <p className="text-on-surface-variant max-w-md">
                {t.landingCtaSubtitle}
              </p>
            </div>
            {!inMiniPay && (
              <button
                onClick={onConnect}
                className="flex-shrink-0 bg-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-base hover:bg-black transition-all"
                style={{ boxShadow: "0 8px 24px rgba(28,28,23,0.06)" }}
              >
                {t.landingCtaButton}
              </button>
            )}
          </div>
          <Thread />
        </div>
      </section>

      {/* Modal — Empresas e Equipes */}
      {showEmpresasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/40 backdrop-blur-sm" onClick={() => setShowEmpresasModal(false)}>
          <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-[0_24px_48px_rgba(28,28,23,0.16)]" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-primary-container mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>{t.landingCompaniesModalTitle}</h3>
            <ol className="flex flex-col gap-4">
              {[
                { n: "01", t: t.landingCompaniesStep1Title, d: t.landingCompaniesStep1Body },
                { n: "02", t: t.landingCompaniesStep2Title, d: t.landingCompaniesStep2Body },
                { n: "03", t: t.landingCompaniesStep3Title, d: t.landingCompaniesStep3Body },
                { n: "04", t: t.landingCompaniesStep4Title, d: t.landingCompaniesStep4Body },
                { n: "05", t: t.landingCompaniesStep5Title, d: t.landingCompaniesStep5Body },
              ].map(({ n, t: stepTitle, d }) => (
                <li key={n} className="flex gap-4">
                  <span className="text-secondary font-extrabold text-xs tracking-widest mt-0.5 w-6 flex-shrink-0">{n}</span>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{stepTitle}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <button onClick={() => setShowEmpresasModal(false)} className="mt-8 w-full bg-primary-container text-on-primary py-3 rounded-xl font-bold text-sm">
              {t.landingCompaniesModalDismiss}
            </button>
          </div>
        </div>
      )}

      {/* Modal — Profissionais */}
      {showProfissionaisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/40 backdrop-blur-sm" onClick={() => setShowProfissionaisModal(false)}>
          <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-[0_24px_48px_rgba(28,28,23,0.16)]" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-primary-container mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>{t.landingProfessionalsModalTitle}</h3>
            <ol className="flex flex-col gap-4">
              {[
                { n: "01", t: t.landingProfessionalsStep1Title, d: t.landingProfessionalsStep1Body },
                { n: "02", t: t.landingProfessionalsStep2Title, d: t.landingProfessionalsStep2Body },
                { n: "03", t: t.landingProfessionalsStep3Title, d: t.landingProfessionalsStep3Body },
                { n: "04", t: t.landingProfessionalsStep4Title, d: t.landingProfessionalsStep4Body },
                { n: "05", t: t.landingProfessionalsStep5Title, d: t.landingProfessionalsStep5Body },
              ].map(({ n, t: stepTitle, d }) => (
                <li key={n} className="flex gap-4">
                  <span className="text-secondary font-extrabold text-xs tracking-widest mt-0.5 w-6 flex-shrink-0">{n}</span>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{stepTitle}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <button onClick={() => setShowProfissionaisModal(false)} className="mt-8 w-full bg-marigold text-on-tertiary-fixed py-3 rounded-xl font-bold text-sm">
              {t.cta2}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
