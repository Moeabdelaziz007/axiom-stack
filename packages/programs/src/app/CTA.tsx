"use client";

import { Github, Facebook, Instagram, Mail, MessageCircle } from "lucide-react";

// Define a type for the gtag function
type GtagFunction = (...args: any[]) => void;

export default function CTA() {
  // Function to handle analytics tracking
  const trackSocialClick = (platform: string) => {
    // Simple analytics tracking using a global function
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: GtagFunction })?.gtag) {
      (window as unknown as { gtag: GtagFunction }).gtag('event', 'social_link_click', {
        event_category: 'engagement',
        event_label: platform
      });
    }
    console.log(`Social link clicked: ${platform}`);
  };

  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Build the Future of AI Trust.
        </h2>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          Get started by reading our documentation or join the conversation with our community of developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://github.com/Moeabdelaziz007/axiom-id" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackSocialClick('github')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover-primary transition-colors flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            View GitHub
          </a>
          <a 
            href="https://www.facebook.com/profile.php?id=61583477974464&locale=ar_AR" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackSocialClick('facebook')}
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2"
          >
            <Facebook className="w-5 h-5" />
            Facebook
          </a>
          <a 
            href="https://www.instagram.com/axiom_id/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackSocialClick('instagram')}
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2"
          >
            <Instagram className="w-5 h-5" />
            Instagram
          </a>
          <a 
            href="https://discord.com/api/oauth2/authorize?client_id=1438403210334306304&permissions=8&scope=bot%20applications.commands" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackSocialClick('discord')}
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Join Discord
          </a>
          <a 
            href="mailto:team@axiomid.app"
            onClick={() => trackSocialClick('email')}
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}