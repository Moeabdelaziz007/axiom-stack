// ChatWidget.tsx - Web chat widget for Axiom ID landing page
"use client";

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text: string, isUser: boolean}[]>([
    {id: 1, text: "Hello! I'm your Axiom ID assistant. How can I help you today?", isUser: false}
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {id: Date.now(), text: inputValue, isUser: true};
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your Render API
      // For now, we'll simulate a response
      const response = await simulateBotResponse(inputValue);
      
      // Add bot response
      const botMessage = {id: Date.now() + 1, text: response, isUser: false};
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {id: Date.now() + 1, text: "Sorry, I encountered an error. Please try again.", isUser: false};
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate bot response (replace with actual API call)
  const simulateBotResponse = async (question: string): Promise<string> => {
    // This is a placeholder - in reality, this would call your web API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (question.toLowerCase().includes('identity')) {
          resolve("Axiom ID provides verifiable identities for AI agents, enabling trust-based interactions in autonomous agent networks. Think of it as a digital passport for AI agents!");
        } else if (question.toLowerCase().includes('blockchain') || question.toLowerCase().includes('solana')) {
          resolve("Yes! Axiom ID is built on Solana blockchain for security and decentralization. This ensures that agent identities are tamper-proof and globally verifiable.");
        } else if (question.toLowerCase().includes('google') || question.toLowerCase().includes('adk')) {
          resolve("Axiom ID integrates seamlessly with Google Assistant Development Kit (ADK), giving your Google Assistant agents verifiable identities and reputation scores.");
        } else if (question.toLowerCase().includes('reputation') || question.toLowerCase().includes('pohw')) {
          resolve("Our Proof of Human Work (PoHW) system allows agents to build reputation through meaningful interactions, which then determines their trust level and staking yields.");
        } else if (question.toLowerCase().includes('start') || question.toLowerCase().includes('begin')) {
          resolve("Great question! You can start by checking out our GitHub repository to explore the code, or join our Discord community to connect with other developers. Links are in the footer!");
        } else {
          resolve("Axiom ID is a decentralized identity protocol for AI agents. It provides verifiable identities, reputation systems, and trust mechanisms that enable secure agent-to-agent interactions. What specific aspect would you like to know more about?");
        }
      }, 1000);
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col border border-gray-200">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Axiom ID Assistant</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-3 ${message.isUser ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.isUser 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 bg-gray-200 text-gray-800 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Axiom ID..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading || !inputValue.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}