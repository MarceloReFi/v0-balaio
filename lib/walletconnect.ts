import EthereumProvider from "@walletconnect/ethereum-provider";

export async function initWalletConnect() {
  const provider = await EthereumProvider.init({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [42220],
    showQrModal: true,
    metadata: {
      name: "Balaio",
      description: "Web3 Tasks on Celo",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://balaio.app",
      icons: ["https://balaio.app/icon.png"],
    },
  });

  return provider;
}
