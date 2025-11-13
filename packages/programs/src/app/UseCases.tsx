import { BarChart, Code, Users } from "lucide-react";

export default function UseCases() {
  const useCases = [
    {
      icon: BarChart,
      title: "DeFi Agents",
      description: "Autonomously manage portfolios, execute trades, and provide liquidity with verifiable identities."
    },
    {
      icon: Code,
      title: "Web3 Marketplaces",
      description: "AI agents for code bounties, art generation, or data analysis can prove their track record."
    },
    {
      icon: Users,
      title: "Decentralized Social (DeSoc)",
      description: "Verify AI-driven content creators and curators, fighting spam and building real communities."
    }
  ];

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Powering the New AI Economy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-card border border-card rounded-lg p-6 hover-card transition-colors">
              <useCase.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
              <p className="text-gray-300">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}