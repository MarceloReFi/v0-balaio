import { useAppKit } from '@reown/appkit/react'
"use client"

import { useTranslations, type Language } from "@/lib/translations"
import { Wallet, Users, Building2, Handshake, CheckCircle, Globe, Shield, Zap, Smartphone, ArrowRight, Mail } from "lucide-react"
import { useAppKit } from '@reown/appkit/react'

interface LandingPageProps {
  onConnect: () => void
  language: Language
}

export function LandingPage({ onConnect, language }: LandingPageProps) {
  const t = useTranslations(language)
  const { open } = useAppKit()

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <section className="bg-[#111111] border-b-2 border-[#111111] p-6 md:p-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {language === "en" ? "Simple. Functional. Useful." : "Simples. Funcional. Útil."}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            {language === "en"
              ? "A mobile-first task management Dapp where people earn by completing tasks, and projects can execute their budget with transparency and accountability."
              : "Um Dapp de gerenciamento de tarefas mobile-first onde pessoas ganham completando tarefas, e projetos podem executar seu orçamento com transparência e responsabilidade."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onConnect}
              className="bg-[#FF99CC] text-[#111111] px-8 py-4 text-lg font-bold border-2 border-[#111111] rounded-xl hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
            >
              🦊 {t.connectWallet} (MetaMask)
            </button>
            <button
              onClick={() => open()}
              className="bg-[#99FF99] text-[#111111] px-8 py-4 text-lg font-bold border-2 border-[#111111] rounded-xl hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
            >
              🔗 {t.connectWallet} (WalletConnect)
            </button>
          </div>
        </div>
      </section>

      {/* What is Balaio Section */}
      <section className="p-6 md:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {language === "en" ? "What is Balaio?" : "O que é o Balaio?"}
          </h2>

          <div className="bg-white border-2 border-[#111111] rounded-xl p-6 mb-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            <p className="text-sm md:text-base mb-4">
              {language === "en"
                ? "Balaio is a task-based coordination app built by ReFaz0x, Felipe Farias, Pedro Parrachia, and CeLatam."
                : "Balaio é um app de coordenação baseado em tarefas construído por ReFaz0x, Felipe Farias, Pedro Parrachia e CeLatam."}
            </p>
            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>
                  {language === "en"
                    ? "People complete real-world or online tasks and get paid onchain."
                    : "Pessoas completam tarefas do mundo real ou online e são pagas onchain."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>
                  {language === "en"
                    ? "Projects and organizations create and manage tasks with transparent, verifiable payouts."
                    : "Projetos e organizações criam e gerenciam tarefas com pagamentos transparentes e verificáveis."}
                </span>
              </li>
            </ul>
          </div>

          {/* Micro-work Benefits */}
          <div className="bg-[#99FF99] border-2 border-[#111111] rounded-xl p-6 text-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            <h3 className="font-bold text-lg mb-4">
              {language === "en" ? "Micro-work, but smarter:" : "Micro-trabalho, mas mais inteligente:"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span className="text-sm">{language === "en" ? "No bank account needed" : "Sem necessidade de conta bancária"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">{language === "en" ? "Low fees, fast settlement" : "Taxas baixas, liquidação rápida"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm">{language === "en" ? "Designed for low-connectivity" : "Projetado para baixa conectividade"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Two Options */}
      <section className="p-6 md:p-10 bg-white border-y-2 border-[#111111]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Freelancer CTA */}
            <div className="bg-white border-2 border-[#111111] rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-[#111111]" />
                <h3 className="font-bold text-lg">{language === "en" ? "Freelancer" : "Freelancer"}</h3>
              </div>
              <p className="text-sm mb-4">
                {language === "en"
                  ? "Connect your wallet to check available tasks and start earning."
                  : "Conecte sua carteira para verificar tarefas disponíveis e começar a ganhar."}
              </p>
              <button
                onClick={onConnect}
                className="w-full bg-[#111111] text-white px-4 py-3 font-bold text-sm border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {t.connectWallet}
              </button>
            </div>

            {/* Organization CTA */}
            <div className="bg-white border-2 border-[#111111] rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-[#111111]" />
                <h3 className="font-bold text-lg">{language === "en" ? "Organization" : "Organização"}</h3>
              </div>
              <p className="text-sm mb-4">
                {language === "en"
                  ? "Get in touch with our team to launch your tasks onchain."
                  : "Entre em contato com nossa equipe para lançar suas tarefas onchain."}
              </p>
              <a
                href="mailto:talkbalaio@gmail.com"
                className="w-full bg-[#FF99CC] text-[#111111] px-4 py-3 font-bold text-sm border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                talkbalaio@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="p-6 md:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {language === "en" ? "How Balaio Works" : "Como o Balaio Funciona"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For Contributors */}
            <div className="bg-white border-2 border-[#111111] rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#99FF99]" />
                {language === "en" ? "For Contributors" : "Para Colaboradores"}
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="bg-[#99FF99] border-2 border-[#111111] rounded-lg w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                  <div>
                    <span className="font-bold text-sm">{language === "en" ? "Sign up:" : "Cadastre-se:"}</span>
                    <p className="text-xs text-[#666666]">{language === "en" ? "Connect your wallet." : "Conecte sua carteira."}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#99FF99] border-2 border-[#111111] rounded-lg w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                  <div>
                    <span className="font-bold text-sm">{language === "en" ? "Choose tasks:" : "Escolha tarefas:"}</span>
                    <p className="text-xs text-[#666666]">{language === "en" ? "Filter by type, reward, or location." : "Filtre por tipo, recompensa ou localização."}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#99FF99] border-2 border-[#111111] rounded-lg w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                  <div>
                    <span className="font-bold text-sm">{language === "en" ? "Submit and get paid:" : "Envie e seja pago:"}</span>
                    <p className="text-xs text-[#666666]">{language === "en" ? "Complete the task, submit proof, and receive onchain payment once approved." : "Complete a tarefa, envie prova e receba pagamento onchain após aprovação."}</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* For Organizations */}
            <div className="bg-white border-2 border-[#111111] rounded-xl p-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF99CC]" />
                {language === "en" ? "For Organizations" : "Para Organizações"}
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="bg-[#FF99CC] border-2 border-[#111111] rounded-lg w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                  <div>
                    <span className="font-bold text-sm">{language === "en" ? "Design tasks:" : "Crie tarefas:"}</span>
                    <p className="text-xs text-[#666666]">{language === "en" ? "Define what needs to be done and how much you'll pay." : "Defina o que precisa ser feito e quanto você pagará."}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#FF99CC] border-2 border-[#111111] rounded-lg w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                  <div>
                    <span className="font-bold text-sm">{language === "en" ? "Publish to Balaio:" : "Publique no Balaio:"}</span>
                    <p className="text-xs text-[#666666]">{language === "en" ? "Your tasks appear to contributors." : "Suas tarefas aparecem para colaboradores."}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-[#FF99CC] border-2 border-[#111111] rounded-lg w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                  <div>
                    <span className="font-bold text-sm">{language === "en" ? "Approve and pay:" : "Aprove e pague:"}</span>
                    <p className="text-xs text-[#666666]">{language === "en" ? "Review submissions and trigger on-chain payouts in one click." : "Revise envios e acione pagamentos onchain em um clique."}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onConnect}
              className="bg-[#FFFF66] text-[#111111] px-8 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] transition-shadow inline-flex items-center gap-2"
            >
              {language === "en" ? "Get Started →" : "Começar →"}
            </button>
          </div>
        </div>
      </section>

      {/* Why Onchain Section */}
      <section className="p-6 md:p-10 bg-[#111111] border-y-2 border-[#111111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-white text-center">
            {language === "en" ? "Why Onchain?" : "Por que Onchain?"}
          </h2>
          <p className="text-white/80 text-center mb-8">
            {language === "en"
              ? "Tasks and payments you can verify, not just \"trust\""
              : "Tarefas e pagamentos que você pode verificar, não apenas \"confiar\""}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 border-2 border-white/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-[#FFFF66]" />
                <h3 className="font-bold text-white">{language === "en" ? "Low fees, high efficiency" : "Taxas baixas, alta eficiência"}</h3>
              </div>
              <p className="text-white/80 text-sm">
                {language === "en"
                  ? "Ideal for small, frequent task payments."
                  : "Ideal para pagamentos de tarefas pequenas e frequentes."}
              </p>
            </div>

            <div className="bg-white/10 border-2 border-white/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-[#FFFF66]" />
                <h3 className="font-bold text-white">{language === "en" ? "Borderless by design" : "Sem fronteiras por design"}</h3>
              </div>
              <p className="text-white/80 text-sm">
                {language === "en"
                  ? "Pay and coordinate contributors across regions without complex banking."
                  : "Pague e coordene colaboradores de várias regiões sem burocracia bancária."}
              </p>
            </div>

            <div className="bg-white/10 border-2 border-white/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-[#FFFF66]" />
                <h3 className="font-bold text-white">{language === "en" ? "Transparent history" : "Histórico transparente"}</h3>
              </div>
              <p className="text-white/80 text-sm">
                {language === "en"
                  ? "Every task and payout leaves an onchain trace."
                  : "Toda tarefa e pagamento deixa um rastro onchain."}
              </p>
            </div>

            <div className="bg-white/10 border-2 border-white/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-[#FFFF66]" />
                <h3 className="font-bold text-white">{language === "en" ? "Fair and predictable" : "Justo e previsível"}</h3>
              </div>
              <p className="text-white/80 text-sm">
                {language === "en"
                  ? "Rewards are defined upfront and cannot be silently changed."
                  : "Recompensas são definidas antecipadamente e não podem ser alteradas silenciosamente."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Projects Section */}
      <section className="p-6 md:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <Building2 className="w-7 h-7 text-[#111111]" />
            <h2 className="text-2xl font-bold">
              {language === "en" ? "For Projects" : "Para Projetos"}
            </h2>
          </div>
          <p className="text-center text-[#666666] mb-6">
            {language === "en"
              ? "Coordinate contributors and payouts in one place"
              : "Coordene colaboradores e pagamentos em um só lugar"}
          </p>

          <div className="bg-white border-2 border-[#111111] rounded-xl p-6 mb-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            <p className="text-sm md:text-base mb-6">
              {language === "en"
                ? "Balaio lets your project publish tasks onchain, verify work, and pay contributors directly."
                : "O Balaio permite que seu projeto compartilhe tarefas onchain, verifique trabalhos e pague colaboradores onchain com total transparência."}
            </p>

            <h4 className="font-bold mb-3">{language === "en" ? "What you can do:" : "O que você pode fazer:"}</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Create task lists in minutes: Define rewards, deadlines, and requirements." : "Crie listas de tarefas em minutos: Defina recompensas, prazos e requisitos."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Work with contributors from all over the world: Count on diverse talents for a wide variety of tasks." : "Trabalhe com colaboradores de todo o mundo: Conte com talentos diversos para uma ampla variedade de tarefas."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Review and approve work: Track submissions, request edits, and pay at your own pace." : "Revise e aprove trabalhos: Acompanhe envios, solicite edições e aprove em escala."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Automate payouts: Once tasks are approved, contributors receive onchain payments." : "Automatize pagamentos: Após aprovação das tarefas, colaboradores recebem pagamentos onchain."}</span>
              </li>
            </ul>

            <h4 className="font-bold mb-3">{language === "en" ? "Ideal for:" : "Ideal para:"}</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#FF99CC] text-[#111111] px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "Web3 ecosystem growth" : "Crescimento de ecossistemas Web3"}
              </span>
              <span className="bg-[#99FF99] text-[#111111] px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "Local research" : "Pesquisa local"}
              </span>
              <span className="bg-[#FFFF66] text-[#111111] px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "Education & onboarding" : "Educação & onboarding"}
              </span>
              <span className="bg-[#111111] text-white px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "Community missions" : "Missões de comunidade"}
              </span>
            </div>
          </div>

          <div className="text-center">
            <a
              href="mailto:talkbalaio@gmail.com"
              className="bg-[#FF99CC] text-[#111111] px-6 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {language === "en" ? "Talk to us about launching your tasks →" : "Fale conosco sobre lançar suas tarefas →"}
            </a>
          </div>
        </div>
      </section>

      {/* For Contributors Section */}
      <section className="p-6 md:p-10 bg-white border-y-2 border-[#111111]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <Users className="w-7 h-7 text-[#99FF99]" />
            <h2 className="text-2xl font-bold">
              {language === "en" ? "For Contributors" : "Para Colaboradores"}
            </h2>
          </div>
          <p className="text-center text-[#666666] mb-6">
            {language === "en"
              ? "Earn with tasks, paid directly to your crypto wallet"
              : "Ganhe com tarefas, pago diretamente na sua carteira crypto"}
          </p>

          <div className="bg-[#99FF99] border-2 border-[#111111] rounded-xl p-6 mb-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            <p className="text-sm md:text-base mb-6 text-[#111111]">
              {language === "en"
                ? "Use your phone to complete tasks for companies, communities, and Web3 projects: from surveys and content to local field work. Get paid onchain with stable digital dollars you can spend, save, or cash out."
                : "Use seu celular para completar tarefas para empresas, comunidades e projetos Web3: de pesquisas e conteúdo a trabalho de campo local. Seja pago onchain com dólares digitais estáveis que você pode gastar, economizar ou sacar."}
            </p>

            <h4 className="font-bold mb-4 text-[#111111]">{language === "en" ? "Why people use Balaio:" : "Por que as pessoas usam o Balaio:"}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-[#111111] rounded-xl p-4">
                <h5 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#111111]" />
                  {language === "en" ? "Easy to start" : "Fácil de começar"}
                </h5>
                <p className="text-xs text-[#666666]">
                  {language === "en"
                    ? "Connect a wallet, create your account, and pick your first task."
                    : "Conecte uma carteira, crie sua conta e escolha sua primeira tarefa."}
                </p>
              </div>
              <div className="bg-white border-2 border-[#111111] rounded-xl p-4">
                <h5 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#111111]" />
                  {language === "en" ? "Real pay for real work" : "Pagamento real por trabalho real"}
                </h5>
                <p className="text-xs text-[#666666]">
                  {language === "en"
                    ? "Every approved task is paid. No points, no hidden rules."
                    : "Toda tarefa aprovada é paga. Sem pontos, sem regras ocultas."}
                </p>
              </div>
              <div className="bg-white border-2 border-[#111111] rounded-xl p-4">
                <h5 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#111111]" />
                  {language === "en" ? "Fast payouts" : "Pagamentos rápidos"}
                </h5>
                <p className="text-xs text-[#666666]">
                  {language === "en"
                    ? "Onchain transfers arrive in minutes, not weeks."
                    : "Transferências onchain chegam em minutos, não semanas."}
                </p>
              </div>
              <div className="bg-white border-2 border-[#111111] rounded-xl p-4">
                <h5 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#111111]" />
                  {language === "en" ? "Built for mobile" : "Feito para mobile"}
                </h5>
                <p className="text-xs text-[#666666]">
                  {language === "en"
                    ? "Lightweight experience that works even on basic smartphones."
                    : "Experiência leve que funciona até em smartphones básicos."}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onConnect}
              className="bg-[#111111] text-white px-6 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow inline-flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              {language === "en" ? "Start Earning →" : "Comece a Ganhar →"}
            </button>
          </div>
        </div>
      </section>

      {/* For Partners Section */}
      <section className="p-6 md:p-10 bg-[#FF99CC]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <Handshake className="w-7 h-7 text-[#111111]" />
            <h2 className="text-2xl font-bold text-[#111111]">
              {language === "en" ? "For Partners" : "Para Parceiros"}
            </h2>
          </div>
          <p className="text-center text-[#111111]/80 mb-6">
            {language === "en"
              ? "Partner with Balaio to activate communities at scale"
              : "Seja parceiro do Balaio para ativar comunidades em escala"}
          </p>

          <div className="bg-white border-2 border-[#111111] rounded-xl p-6 mb-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            <p className="text-sm md:text-base mb-6">
              {language === "en"
                ? "We collaborate with ecosystems, NGOs, universities, and accelerator programs to turn funding into measurable, onchain work done by real people."
                : "Colaboramos com ecossistemas, ONGs, universidades e programas aceleradores para transformar financiamento em trabalho mensurável e onchain feito por pessoas reais."}
            </p>

            <h4 className="font-bold mb-3">{language === "en" ? "How we co-create:" : "Como co-criamos:"}</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Design pilot programs in specific regions or communities" : "Projetamos programas piloto em regiões ou comunidades específicas"}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Integrate Balaio tasks into your existing education or impact programs" : "Integramos tarefas do Balaio em seus programas de educação ou impacto existentes"}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Provide dashboards to track activity, payouts, and outcomes" : "Fornecemos dashboards para acompanhar atividade, pagamentos e resultados"}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#99FF99] flex-shrink-0 mt-0.5" />
                <span>{language === "en" ? "Support local onboarding and collect product feedback" : "Apoiamos com onboarding local e ciclos de feedback do produto"}</span>
              </li>
            </ul>

            <h4 className="font-bold mb-3">{language === "en" ? "Perfect if you are:" : "Perfeito se você é:"}</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#111111] text-white px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "Blockchain ecosystem or foundation" : "Ecossistema ou fundação blockchain"}
              </span>
              <span className="bg-[#FFFF66] text-[#111111] px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "Impact fund, NGO, or agency" : "Fundo de impacto, ONG ou agência"}
              </span>
              <span className="bg-[#99FF99] text-[#111111] px-3 py-1 text-xs font-bold border-2 border-[#111111] rounded-lg">
                {language === "en" ? "University or accelerator" : "Universidade ou aceleradora"}
              </span>
            </div>
          </div>

          <div className="text-center">
            <a
              href="mailto:talkbalaio@gmail.com"
              className="bg-[#FFFF66] text-[#111111] px-6 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-shadow inline-flex items-center gap-2"
            >
              <Handshake className="w-5 h-5" />
              {language === "en" ? "Work with us →" : "Fale com a gente →"}
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="p-6 md:p-10 bg-[#111111] border-t-2 border-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/logo.png" alt="Balaio" className="w-20 h-20 mx-auto mb-4 border-2 border-[#111111] bg-white rounded-xl p-2" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === "en" ? "Ready to get started?" : "Pronto para começar?"}
          </h2>
          <p className="text-white/80 mb-6">
            {language === "en"
              ? "Connect your wallet and start using Balaio today."
              : "Conecte sua carteira e comece a usar o Balaio hoje."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onConnect}
              className="bg-[#FF99CC] text-[#111111] px-8 py-4 text-lg font-bold border-2 border-[#111111] rounded-xl hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
            >
              🦊 {t.connectWallet} (MetaMask)
            </button>
            <button
              onClick={() => open()}
              className="bg-[#99FF99] text-[#111111] px-8 py-4 text-lg font-bold border-2 border-[#111111] rounded-xl hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all"
            >
              🔗 {t.connectWallet} (WalletConnect)
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
