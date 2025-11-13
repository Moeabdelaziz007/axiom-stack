import { ShieldCheck, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-8" />
        <h1 className="text-7xl font-bold text-white mb-4">Axiom ID</h1>
        <h2 className="text-5xl font-bold text-white mb-6">
          The Trust Layer for the AI Economy.
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Decentralized Identity for Autonomous Agents on Solana
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover-primary transition-colors">
            Read The Whitepaper
          </button>
          <a 
            href="https://discord.com/api/oauth2/authorize?client_id=1438403210334306304&permissions=8&scope=bot%20applications.commands" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Join Our Discord
          </a>
        </div>
      </div>
    </section>
  );
}