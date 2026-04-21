export const metadata = {
  title: "Privacy Policy — Balaio",
}

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-primary-container mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
        Privacy Policy
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">Last updated: April 2026</p>

      <section className="flex flex-col gap-8 text-sm leading-relaxed text-on-surface-variant">

        <div>
          <h2 className="font-bold text-on-surface mb-2">1. Overview</h2>
          <p>Balaio (&quot;the Platform&quot;) is a decentralized application. We are committed to minimizing data collection and being transparent about what we do collect and why.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">2. Information We Collect</h2>
          <p className="mb-2"><strong className="text-on-surface">Wallet address.</strong> When you connect your wallet, your public blockchain address is associated with your activity on the Platform. This is stored in our database to power the application.</p>
          <p className="mb-2"><strong className="text-on-surface">Wallet balances.</strong> By connecting your wallet, you consent to the Platform reading the balance of supported cryptocurrencies (CELO, cUSD, USDC, G$, and others supported by the application). This data is read in real time and is not stored on our servers.</p>
          <p className="mb-2"><strong className="text-on-surface">Task content.</strong> Titles, descriptions, proof submission links, and other task-related text you provide are stored in our database and associated with your wallet address.</p>
          <p><strong className="text-on-surface">Usage data.</strong> We use Vercel Analytics to collect anonymized, aggregated usage statistics. No personally identifiable information is collected through analytics.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">3. Information We Do Not Collect</h2>
          <ul className="list-disc ml-5 flex flex-col gap-1">
            <li>We do not collect your name, email, phone number, or any off-chain identity.</li>
            <li>We do not store private keys, seed phrases, or signing credentials.</li>
            <li>We do not sell or share your data with third parties for advertising purposes.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">4. Public Blockchain Data</h2>
          <p>All task transactions are recorded on the Celo blockchain, which is public and permanent. Your wallet address and transaction history are visible to anyone with access to the blockchain. This is inherent to decentralized applications and is outside Balaio&apos;s control.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">5. Identity Verification (GoodDollar)</h2>
          <p>If you choose to verify your identity via GoodDollar&apos;s GoodID system to access verified-only tasks, that verification is processed by GoodDollar. Balaio only receives a boolean result (verified / not verified) and does not receive or store any biometric or personal data from that process.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">6. Data Storage</h2>
          <p>Task and activity data is stored in Supabase, a third-party database provider. We retain this data as long as the Platform is operational. You may request deletion of your data by contacting us.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">7. Cookies and Local Storage</h2>
          <p>The Platform may use cookies or local storage for wallet session persistence and user preferences. No tracking or advertising cookies are used.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of the Platform after changes are posted constitutes acceptance.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">9. Contact</h2>
          <p>For privacy-related requests or questions, contact us at <a href="mailto:contato@usebalaio.com" className="text-secondary underline">contato@usebalaio.com</a>.</p>
        </div>

      </section>
    </main>
  )
}
