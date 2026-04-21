export const metadata = {
  title: "Terms of Service — Balaio",
}

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-on-surface">
      <h1 className="text-3xl font-bold text-primary-container mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
        Terms of Service
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">Last updated: April 2026</p>

      <section className="flex flex-col gap-8 text-sm leading-relaxed text-on-surface-variant">

        <div>
          <h2 className="font-bold text-on-surface mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using Balaio ("the Platform") at usebalaio.com, you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">2. What Balaio Is</h2>
          <p>Balaio is a decentralized task marketplace built on the Celo blockchain. It provides smart contract infrastructure and a user interface that allows any user to create tasks, claim tasks, submit work, and approve or reject submissions. The Platform does not act as an employer, client, contractor, intermediary, or agent for any party.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">3. Peer-to-Peer Interactions</h2>
          <p>All interactions on Balaio — including task creation, claiming, completion, submission of proof, and approval or rejection of work — occur exclusively between users. Balaio is not a party to any of these interactions and bears no responsibility for their outcome, accuracy, or fairness. There are no privileged, verified, or differentiated categories of users on the Platform. All wallets interact with the same smart contracts under the same rules.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">4. No Platform Liability for Task Outcomes</h2>
          <p>Balaio is not responsible for:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>The quality, accuracy, or legality of any task created by a user;</li>
            <li>Whether a claimed task is completed to the creator&apos;s satisfaction;</li>
            <li>Submission content provided by workers;</li>
            <li>Approval or rejection decisions made by task creators;</li>
            <li>Loss of funds resulting from smart contract interactions;</li>
            <li>Disputes between users arising from any task or transaction.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">5. Wallet Connection and Balance Reading</h2>
          <p>By connecting your wallet to Balaio, you acknowledge and consent that the Platform may read the balance of your wallet for the cryptocurrencies supported within the application (including but not limited to CELO, cUSD, USDC, and G$). This is necessary to display relevant information within the interface and to facilitate task reward transactions. Balaio does not store your private keys, seed phrases, or any credentials granting control over your wallet.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">6. Blockchain Transactions</h2>
          <p>All task-related transactions are executed on the Celo blockchain via immutable smart contracts. Once submitted, transactions cannot be reversed or modified by Balaio. You are solely responsible for reviewing and confirming all transactions before signing them with your wallet.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">7. Eligibility</h2>
          <p>You must be at least 18 years old and legally permitted to use blockchain-based applications in your jurisdiction. By using the Platform, you represent that you meet these requirements.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">8. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>Use the Platform for any illegal purpose;</li>
            <li>Create tasks that involve illegal goods, services, or activities;</li>
            <li>Attempt to exploit, hack, or manipulate the smart contracts or the interface;</li>
            <li>Misrepresent your identity or the nature of your work submissions.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">9. Disclaimer of Warranties</h2>
          <p>The Platform is provided &quot;as is&quot; without warranties of any kind. Balaio does not guarantee uninterrupted availability, freedom from bugs, or suitability for any particular purpose.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">10. Limitation of Liability</h2>
          <p>To the fullest extent permitted by applicable law, Balaio and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including loss of funds due to smart contract interactions or user decisions.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">11. Changes to These Terms</h2>
          <p>Balaio may update these Terms at any time. Continued use of the Platform after changes are posted constitutes acceptance. The date at the top of this page reflects the most recent revision.</p>
        </div>

        <div>
          <h2 className="font-bold text-on-surface mb-2">12. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:contato@usebalaio.com" className="text-secondary underline">contato@usebalaio.com</a>.</p>
        </div>

      </section>
    </main>
  )
}
