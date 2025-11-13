"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

// Define a type for the gtag function
type GtagFunction = (...args: any[]) => void;

export default function WaitingList() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle analytics tracking
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    // Simple analytics tracking using a global function
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: GtagFunction })?.gtag) {
      (window as unknown as { gtag: GtagFunction }).gtag('event', eventName, {
        event_category: 'engagement',
        event_label: JSON.stringify(properties)
      });
    }
    console.log(`Event tracked: ${eventName}`, properties);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous errors
    setError(null);
    
    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      trackEvent('form_submission_error', { error: 'invalid_email' });
      return;
    }

    setIsLoading(true);
    trackEvent('form_submission_started');

    try {
      // Send data to Formspree
      const response = await fetch('https://formspree.io/f/xblqrblj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Store data in localStorage as backup
        const submissionData = {
          email,
          timestamp: new Date().toISOString(),
          id: `wl-${Date.now()}`,
        };
        
        const existing = JSON.parse(localStorage.getItem('waitingList') || '[]');
        localStorage.setItem('waitingList', JSON.stringify([...existing, submissionData]));
        
        setIsSubmitted(true);
        trackEvent('form_submission_success');
      } else {
        // Handle server error - still save to localStorage as fallback
        console.error('Form submission failed with status:', response.status);
        const submissionData = {
          email,
          timestamp: new Date().toISOString(),
          id: `wl-${Date.now()}`,
        };
        
        const existing = JSON.parse(localStorage.getItem('waitingList') || '[]');
        localStorage.setItem('waitingList', JSON.stringify([...existing, submissionData]));
        
        setIsSubmitted(true);
        trackEvent('form_submission_fallback', { error: 'server_error' });
      }
    } catch (error) {
      // Handle network error - still save to localStorage as fallback
      console.error('Network error:', error);
      const submissionData = {
        email,
        timestamp: new Date().toISOString(),
        id: `wl-${Date.now()}`,
      };
      
      const existing = JSON.parse(localStorage.getItem('waitingList') || '[]');
      localStorage.setItem('waitingList', JSON.stringify([...existing, submissionData]));
      
      setIsSubmitted(true);
      trackEvent('form_submission_fallback', { error: 'network_error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="w-full py-16 px-4 bg-card border-t border-card">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">You&apos;re on the list!</h2>
          <p className="text-lg text-gray-300 mb-6">
            Thank you for joining our waitlist. We&apos;ll notify you when Axiom ID is ready.
          </p>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover-primary transition-colors"
          >
            Join Another Email
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 bg-card border-t border-card">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Join the Waitlist</h2>
        <p className="text-lg text-gray-300 mb-8">
          Be the first to experience the future of AI trust. Sign up for early access.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover-primary transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Join Waitlist"
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
}