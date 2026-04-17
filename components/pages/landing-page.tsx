"use client"

import { useAppKit } from '@reown/appkit/react'
import { useTranslations, type Language } from "@/lib/translations"
import { Wallet, Users, Building2, Handshake, CheckCircle, Globe, Shield, Zap, Smartphone, Mail } from "lucide-react"

interface LandingPageProps {
  onConnect: () => void
  onOpenWallet: () => void
  language: Language
}

export function LandingPage({ onConnect, onOpenWallet, language }: LandingPageProps) {
  const t = useTranslations(language)

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <section className="px-[22px] py-12 bg-white border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-3">
            {language === "en" ? "Web3 Task Platform on Celo" : "Plataforma de Tarefas Web3 no Celo"}
          </p>
          <h1 className="font-display text-4xl text-balaio-ink mb-4 leading-tight">
            {language === "en"
              ? <>Simple. Functional. <em>Useful.</em></>
              : <>Simples. Funcional. <em>Útil.</em></>}
          </h1>
          <p className="text-sm text-balaio-muted mb-8" style={{ lineHeight: 1.7 }}>
            {language === "en"
              ? "A mobile-first task management Dapp where people earn by completing tasks, and projects can execute their budget with transparency and accountability."
              : "Um Dapp de gerenciamento de tarefas mobile-first onde pessoas ganham completando tarefas, e projetos podem executar seu orçamento com transparência e responsabilidade."}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onConnect}
              className="bg-balaio-ink text-white px-6 py-3.5 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity flex items-center justify-between w-full"
            >
              <span>{t.connectWallet} (MetaMask)</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onOpenWallet()}
              className="bg-balaio-surface text-balaio-ink px-6 py-3.5 font-semibold rounded-balaio-lg hover:bg-balaio-rule transition-colors flex items-center justify-between w-full"
            >
              <span>{t.connectWallet} (WalletConnect)</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* What is Balaio Section */}
      <section className="px-[22px] py-10 bg-white border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-2">
            {language === "en" ? "About" : "Sobre"}
          </p>
          <h2 className="font-display text-2xl text-balaio-ink mb-5">
            {language === "en" ? <>What is <em>Balaio?</em></> : <>O que é o <em>Balaio?</em></>}
          </h2>

          <p className="text-sm text-balaio-muted mb-6" style={{ lineHeight: 1.7 }}>
            {language === "en"
              ? "Balaio is a task-based coordination app built by ReFaz0x, Felipe Farias, Pedro Parrachia, and CeLatam."
              : "Balaio é um app de coordenação baseado em tarefas construído por ReFaz0x, Felipe Farias, Pedro Parrachia e CeLatam."}
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 py-4 border-b border-balaio-rule">
              <CheckCircle className="w-4 h-4 text-balaio-sage flex-shrink-0 mt-0.5" />
              <span className="text-sm text-balaio-ink">
                {language === "en"
                  ? "People complete real-world or online tasks and get paid onchain."
                  : "Pessoas completam tarefas do mundo real ou online e são pagas onchain."}
              </span>
            </div>
            <div className="flex items-start gap-3 py-4 border-b border-balaio-rule">
              <CheckCircle className="w-4 h-4 text-balaio-sage flex-shrink-0 mt-0.5" />
              <span className="text-sm text-balaio-ink">
                {language === "en"
                  ? "Projects and organizations create and manage tasks with transparent, verifiable payouts."
                  : "Projetos e organizações criam e gerenciam tarefas com pagamentos transparentes e verificáveis."}
              </span>
            </div>
          </div>

          {/* Micro-work Benefits */}
          <div className="bg-balaio-surface rounded-balaio-lg p-5 mt-6">
            <h3 className="font-semibold text-sm text-balaio-ink mb-4">
              {language === "en" ? "Micro-work, but smarter:" : "Micro-trabalho, mas mais inteligente:"}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-balaio-sage" />
                <span className="text-sm text-balaio-muted">{language === "en" ? "No bank account needed" : "Sem necessidade de conta bancária"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-balaio-sage" />
                <span className="text-sm text-balaio-muted">{language === "en" ? "Low fees, fast settlement" : "Taxas baixas, liquidação rápida"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-balaio-sage" />
                <span className="text-sm text-balaio-muted">{language === "en" ? "Designed for low-connectivity" : "Projetado para baixa conectividade"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-[22px] py-10 bg-white border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-2">
            {language === "en" ? "How it works" : "Como funciona"}
          </p>
          <h2 className="font-display text-2xl text-balaio-ink mb-7">
            {language === "en" ? <>How Balaio <em>Works</em></> : <>Como o Balaio <em>Funciona</em></>}
          </h2>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-balaio-sage" />
              <h3 className="font-semibold text-sm text-balaio-ink">
                {language === "en" ? "For Contributors" : "Para Colaboradores"}
              </h3>
            </div>
            <ol className="flex flex-col gap-0">
              {[
                { step: "1", title: language === "en" ? "Sign up:" : "Cadastre-se:", desc: language === "en" ? "Connect your wallet." : "Conecte sua carteira." },
                { step: "2", title: language === "en" ? "Choose tasks:" : "Escolha tarefas:", desc: language === "en" ? "Filter by type, reward, or location." : "Filtre por tipo, recompensa ou localização." },
                { step: "3", title: language === "en" ? "Submit and get paid:" : "Envie e seja pago:", desc: language === "en" ? "Complete the task, submit proof, and receive onchain payment once approved." : "Complete a tarefa, envie prova e receba pagamento onchain após aprovação." },
              ].map((item) => (
                <li key={item.step} className="flex gap-4 py-4 border-b border-balaio-rule">
                  <span className="w-7 h-7 rounded-full bg-balaio-sage text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <span className="font-semibold text-sm text-balaio-ink">{item.title}</span>
                    <p className="text-xs text-balaio-muted mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-balaio-ink" />
              <h3 className="font-semibold text-sm text-balaio-ink">
                {language === "en" ? "For Organizations" : "Para Organizações"}
              </h3>
            </div>
            <ol className="flex flex-col gap-0">
              {[
                { step: "1", title: language === "en" ? "Design tasks:" : "Crie tarefas:", desc: language === "en" ? "Define what needs to be done and how much you'll pay." : "Defina o que precisa ser feito e quanto você pagará." },
                { step: "2", title: language === "en" ? "Publish to Balaio:" : "Publique no Balaio:", desc: language === "en" ? "Your tasks appear to contributors." : "Suas tarefas aparecem para colaboradores." },
                { step: "3", title: language === "en" ? "Approve and pay:" : "Aprove e pague:", desc: language === "en" ? "Review submissions and trigger on-chain payouts in one click." : "Revise envios e acione pagamentos onchain em um clique." },
              ].map((item) => (
                <li key={item.step} className="flex gap-4 py-4 border-b border-balaio-rule">
                  <span className="w-7 h-7 rounded-full bg-balaio-ink text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <span className="font-semibold text-sm text-balaio-ink">{item.title}</span>
                    <p className="text-xs text-balaio-muted mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-7 text-center">
            <button
              onClick={onConnect}
              className="bg-balaio-ink text-white px-8 py-3 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              {language === "en" ? "Get Started →" : "Começar →"}
            </button>
          </div>
        </div>
      </section>

      {/* Why Onchain Section */}
      <section className="px-[22px] py-10 bg-balaio-surface border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted mb-2">
            {language === "en" ? "Why onchain" : "Por que onchain"}
          </p>
          <h2 className="font-display text-2xl text-balaio-ink mb-2">
            {language === "en" ? <>Why <em>Onchain?</em></> : <>Por que <em>Onchain?</em></>}
          </h2>
          <p className="text-sm text-balaio-muted mb-7">
            {language === "en"
              ? "Tasks and payments you can verify, not just \"trust\""
              : "Tarefas e pagamentos que você pode verificar, não apenas \"confiar\""}
          </p>

          <div className="grid grid-cols-1 gap-0">
            {[
              { icon: Zap, title: language === "en" ? "Low fees, high efficiency" : "Taxas baixas, alta eficiência", desc: language === "en" ? "Ideal for small, frequent task payments." : "Ideal para pagamentos de tarefas pequenas e frequentes." },
              { icon: Globe, title: language === "en" ? "Borderless by design" : "Sem fronteiras por design", desc: language === "en" ? "Pay and coordinate contributors across regions without complex banking." : "Pague e coordene colaboradores de várias regiões sem burocracia bancária." },
              { icon: Shield, title: language === "en" ? "Transparent history" : "Histórico transparente", desc: language === "en" ? "Every task and payout leaves an onchain trace." : "Toda tarefa e pagamento deixa um rastro onchain." },
              { icon: CheckCircle, title: language === "en" ? "Fair and predictable" : "Justo e previsível", desc: language === "en" ? "Rewards are defined upfront and cannot be silently changed." : "Recompensas são definidas antecipadamente e não podem ser alteradas silenciosamente." },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-balaio-rule">
                  <Icon className="w-4 h-4 text-balaio-sage flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-balaio-ink">{item.title}</h3>
                    <p className="text-xs text-balaio-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* For Projects Section */}
      <section className="px-[22px] py-10 bg-white border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-balaio-ink" />
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
              {language === "en" ? "For projects" : "Para projetos"}
            </p>
          </div>
          <h2 className="font-display text-2xl text-balaio-ink mb-2">
            {language === "en" ? <>For <em>Projects</em></> : <>Para <em>Projetos</em></>}
          </h2>
          <p className="text-sm text-balaio-muted mb-6">
            {language === "en"
              ? "Coordinate contributors and payouts in one place"
              : "Coordene colaboradores e pagamentos em um só lugar"}
          </p>

          <p className="text-sm text-balaio-muted mb-6" style={{ lineHeight: 1.7 }}>
            {language === "en"
              ? "Balaio lets your project publish tasks onchain, verify work, and pay contributors directly."
              : "O Balaio permite que seu projeto compartilhe tarefas onchain, verifique trabalhos e pague colaboradores onchain com total transparência."}
          </p>

          <h4 className="font-semibold text-sm text-balaio-ink mb-3">{language === "en" ? "What you can do:" : "O que você pode fazer:"}</h4>
          <ul className="flex flex-col gap-0 mb-6">
            {[
              language === "en" ? "Create task lists in minutes: Define rewards, deadlines, and requirements." : "Crie listas de tarefas em minutos: Defina recompensas, prazos e requisitos.",
              language === "en" ? "Work with contributors from all over the world." : "Trabalhe com colaboradores de todo o mundo.",
              language === "en" ? "Review and approve work: Track submissions, request edits, and pay at your own pace." : "Revise e aprove trabalhos: Acompanhe envios, solicite edições e aprove em escala.",
              language === "en" ? "Automate payouts: Once tasks are approved, contributors receive onchain payments." : "Automatize pagamentos: Após aprovação das tarefas, colaboradores recebem pagamentos onchain.",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 py-3 border-b border-balaio-rule">
                <CheckCircle className="w-4 h-4 text-balaio-sage flex-shrink-0 mt-0.5" />
                <span className="text-sm text-balaio-muted">{text}</span>
              </li>
            ))}
          </ul>

          <h4 className="font-semibold text-sm text-balaio-ink mb-3">{language === "en" ? "Ideal for:" : "Ideal para:"}</h4>
          <div className="flex flex-wrap gap-2 mb-7">
            {[
              language === "en" ? "Web3 ecosystem growth" : "Crescimento de ecossistemas Web3",
              language === "en" ? "Local research" : "Pesquisa local",
              language === "en" ? "Education & onboarding" : "Educação & onboarding",
              language === "en" ? "Community missions" : "Missões de comunidade",
            ].map((tag) => (
              <span key={tag} className="bg-balaio-surface text-balaio-muted px-3 py-1 text-xs font-semibold rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <a
            href="mailto:talkbalaio@gmail.com"
            className="bg-balaio-sage text-white px-6 py-3 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {language === "en" ? "Talk to us about launching your tasks →" : "Fale conosco sobre lançar suas tarefas →"}
          </a>
        </div>
      </section>

      {/* For Contributors Section */}
      <section className="px-[22px] py-10 bg-balaio-open-bg border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-balaio-sage" />
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
              {language === "en" ? "For contributors" : "Para colaboradores"}
            </p>
          </div>
          <h2 className="font-display text-2xl text-balaio-ink mb-2">
            {language === "en" ? <>For <em>Contributors</em></> : <>Para <em>Colaboradores</em></>}
          </h2>
          <p className="text-sm text-balaio-muted mb-6">
            {language === "en"
              ? "Earn with tasks, paid directly to your crypto wallet"
              : "Ganhe com tarefas, pago diretamente na sua carteira crypto"}
          </p>

          <p className="text-sm text-balaio-muted mb-6" style={{ lineHeight: 1.7 }}>
            {language === "en"
              ? "Use your phone to complete tasks for companies, communities, and Web3 projects: from surveys and content to local field work. Get paid onchain with stable digital dollars you can spend, save, or cash out."
              : "Use seu celular para completar tarefas para empresas, comunidades e projetos Web3: de pesquisas e conteúdo a trabalho de campo local. Seja pago onchain com dólares digitais estáveis que você pode gastar, economizar ou sacar."}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-7">
            {[
              { icon: Wallet, title: language === "en" ? "Easy to start" : "Fácil de começar", desc: language === "en" ? "Connect a wallet, create your account, and pick your first task." : "Conecte uma carteira, crie sua conta e escolha sua primeira tarefa." },
              { icon: CheckCircle, title: language === "en" ? "Real pay for real work" : "Pagamento real por trabalho real", desc: language === "en" ? "Every approved task is paid. No points, no hidden rules." : "Toda tarefa aprovada é paga. Sem pontos, sem regras ocultas." },
              { icon: Zap, title: language === "en" ? "Fast payouts" : "Pagamentos rápidos", desc: language === "en" ? "Onchain transfers arrive in minutes, not weeks." : "Transferências onchain chegam em minutos, não semanas." },
              { icon: Smartphone, title: language === "en" ? "Built for mobile" : "Feito para mobile", desc: language === "en" ? "Lightweight experience that works even on basic smartphones." : "Experiência leve que funciona até em smartphones básicos." },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-white rounded-balaio-lg p-4 shadow-balaio-card">
                  <Icon className="w-4 h-4 text-balaio-sage mb-2" />
                  <h5 className="font-semibold text-xs text-balaio-ink mb-1">{item.title}</h5>
                  <p className="text-xs text-balaio-muted">{item.desc}</p>
                </div>
              )
            })}
          </div>

          <button
            onClick={onConnect}
            className="bg-balaio-ink text-white px-6 py-3 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            {language === "en" ? "Start Earning →" : "Comece a Ganhar →"}
          </button>
        </div>
      </section>

      {/* For Partners Section */}
      <section className="px-[22px] py-10 bg-white border-b border-balaio-rule">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Handshake className="w-4 h-4 text-balaio-ink" />
            <p className="text-xs font-semibold tracking-[0.08em] uppercase text-balaio-muted">
              {language === "en" ? "For partners" : "Para parceiros"}
            </p>
          </div>
          <h2 className="font-display text-2xl text-balaio-ink mb-2">
            {language === "en" ? <>For <em>Partners</em></> : <>Para <em>Parceiros</em></>}
          </h2>
          <p className="text-sm text-balaio-muted mb-6">
            {language === "en"
              ? "Partner with Balaio to activate communities at scale"
              : "Seja parceiro do Balaio para ativar comunidades em escala"}
          </p>

          <p className="text-sm text-balaio-muted mb-6" style={{ lineHeight: 1.7 }}>
            {language === "en"
              ? "We collaborate with ecosystems, NGOs, universities, and accelerator programs to turn funding into measurable, onchain work done by real people."
              : "Colaboramos com ecossistemas, ONGs, universidades e programas aceleradores para transformar financiamento em trabalho mensurável e onchain feito por pessoas reais."}
          </p>

          <h4 className="font-semibold text-sm text-balaio-ink mb-3">{language === "en" ? "How we co-create:" : "Como co-criamos:"}</h4>
          <ul className="flex flex-col gap-0 mb-6">
            {[
              language === "en" ? "Design pilot programs in specific regions or communities" : "Projetamos programas piloto em regiões ou comunidades específicas",
              language === "en" ? "Integrate Balaio tasks into your existing education or impact programs" : "Integramos tarefas do Balaio em seus programas de educação ou impacto existentes",
              language === "en" ? "Provide dashboards to track activity, payouts, and outcomes" : "Fornecemos dashboards para acompanhar atividade, pagamentos e resultados",
              language === "en" ? "Support local onboarding and collect product feedback" : "Apoiamos com onboarding local e ciclos de feedback do produto",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 py-3 border-b border-balaio-rule">
                <CheckCircle className="w-4 h-4 text-balaio-sage flex-shrink-0 mt-0.5" />
                <span className="text-sm text-balaio-muted">{text}</span>
              </li>
            ))}
          </ul>

          <h4 className="font-semibold text-sm text-balaio-ink mb-3">{language === "en" ? "Perfect if you are:" : "Perfeito se você é:"}</h4>
          <div className="flex flex-wrap gap-2 mb-7">
            {[
              language === "en" ? "Blockchain ecosystem or foundation" : "Ecossistema ou fundação blockchain",
              language === "en" ? "Impact fund, NGO, or agency" : "Fundo de impacto, ONG ou agência",
              language === "en" ? "University or accelerator" : "Universidade ou aceleradora",
            ].map((tag) => (
              <span key={tag} className="bg-balaio-surface text-balaio-muted px-3 py-1 text-xs font-semibold rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <a
            href="mailto:talkbalaio@gmail.com"
            className="bg-balaio-ink text-white px-6 py-3 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Handshake className="w-4 h-4" />
            {language === "en" ? "Work with us →" : "Fale com a gente →"}
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-[22px] py-12 bg-balaio-surface">
        <div className="max-w-lg mx-auto text-center">
          <img src="/logo.png" alt="Balaio" className="w-16 h-16 mx-auto mb-5 bg-white rounded-balaio-lg p-2 shadow-balaio-card" />
          <h2 className="font-display text-2xl text-balaio-ink mb-2">
            {language === "en" ? <>Ready to get <em>started?</em></> : <>Pronto para <em>começar?</em></>}
          </h2>
          <p className="text-sm text-balaio-muted mb-7">
            {language === "en"
              ? "Connect your wallet and start using Balaio today."
              : "Conecte sua carteira e comece a usar o Balaio hoje."}
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={onConnect}
              className="bg-balaio-ink text-white px-6 py-3.5 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity flex items-center justify-between w-full"
            >
              <span>{t.connectWallet} (MetaMask)</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onOpenWallet()}
              className="bg-white text-balaio-ink px-6 py-3.5 font-semibold rounded-balaio-lg hover:bg-balaio-rule transition-colors flex items-center justify-between w-full border border-balaio-rule"
            >
              <span>{t.connectWallet} (WalletConnect)</span>
              <span>→</span>
            </button>
          </div>
          <p className="text-xs text-balaio-muted mt-6">
            {language === "en" ? "Built on Celo Mainnet · Open source" : "Construído na Celo Mainnet · Código aberto"}
          </p>
        </div>
      </section>
    </div>
  )
}
