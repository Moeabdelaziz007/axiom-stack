import { Contact, ShieldCheck, Link } from "lucide-react";

export default function Solution() {
  const features = [
    {
      icon: Contact,
      title: "On-Chain Identity",
      description: "Every agent mints a unique, non-transferable AgentID (NFT) on the Solana blockchain, providing a single source of truth."
    },
    {
      icon: ShieldCheck,
      title: "Verifiable Credentials",
      description: "Agents build reputation. Attach verifiable credentials for past tasks, completed bounties, and security audits to their AgentID."
    },
    {
      icon: Link,
      title: "Trustless Interaction",
      description: "Enable secure, permissionless agent-to-agent (A2A) commerce, data sharing, and collaboration. Know exactly who you're dealing with."
    }
  ];

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          The Axiom Protocol: Verifiable Trust
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-card rounded-lg p-6 hover-card transition-colors">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}