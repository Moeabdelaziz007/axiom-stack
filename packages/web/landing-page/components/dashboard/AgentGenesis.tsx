import { useState } from 'react';

interface AgentData {
  name: string;
  persona: string;
  bio: string;
  stopLoss: number;
  maxRisk: number;
}

interface AgentResponse {
  agentId: string;
  solanaPublicKey?: string;
  success: boolean;
  publicKey: string;
  message: string;
}

const AgentGenesis = () => {
  const [step, setStep] = useState(1);
  const [agentData, setAgentData] = useState({
    name: '',
    persona: 'Trader',
    bio: '',
    stopLoss: 5,
    maxRisk: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgentData(prev => ({
      ...prev,
      [name]: name === 'stopLoss' || name === 'maxRisk' ? parseFloat(value) : value
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AGENT_FACTORY_URL}/spawn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: agentData.persona.toLowerCase(), // Convert to lowercase to match expected type
          config: {
            name: agentData.name,
            rules: {
              stopLoss: agentData.stopLoss / 100, // Convert percentage to decimal
              maxRisk: agentData.maxRisk / 100, // Convert percentage to decimal
              // Add other default rules as needed
            }
          },
          strategy: agentData.bio // Use bio as strategy
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create agent: ${response.statusText}`);
      }

      const data: AgentResponse = await response.json();
      setAgentResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="border border-cyan-500 rounded-lg p-6 shadow-lg shadow-cyan-500/20 bg-gray-900/50 backdrop-blur-sm"
        >
          <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            AGENT GENESIS PROTOCOL
          </h1>
          <p className="text-center text-cyan-300 mb-8">Initialize your autonomous agent</p>

          {/* Progress Bar */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    step >= num
                      ? 'bg-cyan-500 border-cyan-500 text-black'
                      : 'border-cyan-500 text-cyan-500'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`h-1 w-16 mx-2 ${
                      step > num ? 'bg-cyan-500' : 'bg-gray-700'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Identity */}
          {step === 1 && (
            <div
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">IDENTITY PROTOCOL</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="agent-name" className="block text-cyan-300 mb-2">Agent Name</label>
                  <input
                    type="text"
                    id="agent-name"
                    name="name"
                    value={agentData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-cyan-500 rounded px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label htmlFor="agent-persona" className="block text-cyan-300 mb-2">Persona</label>
                  <select
                    id="agent-persona"
                    name="persona"
                    value={agentData.persona}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-cyan-500 rounded px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Trader">Trader</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Strategist">Strategist</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="agent-bio" className="block text-cyan-300 mb-2">Bio</label>
                  <textarea
                    id="agent-bio"
                    name="bio"
                    value={agentData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-800 border border-cyan-500 rounded px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe your agent's purpose and capabilities..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Constitution */}
          {step === 2 && (
            <div
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">CONSTITUTION PROTOCOL</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="stop-loss" className="block text-cyan-300 mb-2">
                    Stop Loss Percentage: {agentData.stopLoss}%
                  </label>
                  <input
                    type="range"
                    id="stop-loss"
                    name="stopLoss"
                    min="0"
                    max="50"
                    value={agentData.stopLoss}
                    onChange={handleInputChange}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-cyan-300 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="max-risk" className="block text-cyan-300 mb-2">
                    Max Risk Percentage: {agentData.maxRisk}%
                  </label>
                  <input
                    type="range"
                    id="max-risk"
                    name="maxRisk"
                    min="0"
                    max="100"
                    value={agentData.maxRisk}
                    onChange={handleInputChange}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-cyan-300 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Activation */}
          {step === 3 && (
            <div
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">ACTIVATION PROTOCOL</h2>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                  <p className="text-cyan-300">Synthesizing Neural Net...</p>
                  <p className="text-cyan-400 text-sm mt-2">Initializing quantum cognition protocols</p>
                </div>
              ) : agentResponse ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500 mb-6">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-500 mb-4">AGENT ACTIVATED</h3>
                  <div className="bg-gray-800/50 border border-cyan-500 rounded-lg p-4 text-left">
                    <div className="mb-3">
                      <p className="text-cyan-300 text-sm">Agent ID</p>
                      <p className="text-cyan-100 font-mono break-all">{agentResponse.agentId}</p>
                    </div>
                    <div>
                      <p className="text-cyan-300 text-sm">Solana Public Key</p>
                      <p className="text-cyan-100 font-mono break-all">{agentResponse.publicKey || agentResponse.solanaPublicKey || 'N/A'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setAgentResponse(null);
                      setAgentData({
                        name: '',
                        persona: 'Trader',
                        bio: '',
                        stopLoss: 5,
                        maxRisk: 10
                      });
                    }}
                    className="mt-6 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded transition duration-200"
                  >
                    Create Another Agent
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="bg-gray-800/50 border border-cyan-500 rounded-lg p-4 mb-6">
                    <h3 className="text-cyan-300 font-bold mb-2">Agent Configuration Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-cyan-400">Name:</p>
                        <p className="text-cyan-100">{agentData.name || 'Unnamed Agent'}</p>
                      </div>
                      <div>
                        <p className="text-cyan-400">Persona:</p>
                        <p className="text-cyan-100">{agentData.persona}</p>
                      </div>
                      <div>
                        <p className="text-cyan-400">Stop Loss:</p>
                        <p className="text-cyan-100">{agentData.stopLoss}%</p>
                      </div>
                      <div>
                        <p className="text-cyan-400">Max Risk:</p>
                        <p className="text-cyan-100">{agentData.maxRisk}%</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-cyan-400">Bio:</p>
                      <p className="text-cyan-100">{agentData.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6 text-red-300">
                      Error: {error}
                    </div>
                  )}
                  
                  <div className="text-center">
                    <button
                      onClick={handleSubmit}
                      className="relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-black font-bold rounded-lg transition duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                    >
                      <span className="relative z-10">INITIATE GENESIS SEQUENCE</span>
                      <div className="absolute inset-0 bg-white rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                    <p className="text-cyan-400 text-sm mt-4">
                      WARNING: This action will create a new autonomous agent on the Axiom network
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {!agentResponse && !isLoading && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-2 rounded ${
                  step === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-700 hover:bg-cyan-600 text-cyan-100'
                }`}
              >
                ← Previous
              </button>
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded"
                >
                  Next →
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentGenesis;