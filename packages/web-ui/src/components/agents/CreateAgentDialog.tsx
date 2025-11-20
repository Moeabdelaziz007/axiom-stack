'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { MockAgent } from '@/lib/solana';
import { AixAgent } from '@/lib/aixLoader';
import { ValidationService } from '@/lib/validation';

interface CreateAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agentData: Omit<AixAgent, 'id' | 'createdAt' | 'lastActive'>) => Promise<void>;
}

export function CreateAgentDialog({ isOpen, onClose, onCreate }: CreateAgentDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'paused'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const capabilitiesList = [
    'data-analysis', 'pattern-recognition', 'reporting',
    'content-generation', 'seo', 'social-media',
    'natural-language', 'ticket-management', 'knowledge-base',
    'financial-analysis', 'risk-assessment', 'portfolio-management',
    'threat-detection', 'intrusion-prevention', 'compliance'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const nameError = ValidationService.validateRequired(name, 'Name') || 
                      ValidationService.validateStringLength(name, 'Name', 1, 50);
    if (nameError) newErrors.name = nameError.message;
    
    const descriptionError = ValidationService.validateRequired(description, 'Description') || 
                            ValidationService.validateStringLength(description, 'Description', 1, 200);
    if (descriptionError) newErrors.description = descriptionError.message;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onCreate({
        name,
        description,
        capabilities,
        status,
        reputation: 50, // Default reputation
        loadFactor: 0, // Default load factor
      } as Omit<AixAgent, 'id' | 'createdAt' | 'lastActive'>);
      // Reset form
      setName('');
      setDescription('');
      setCapabilities([]);
      setNewCapability('');
      setStatus('active');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating agent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCapability = () => {
    if (newCapability && !capabilities.includes(newCapability)) {
      setCapabilities([...capabilities, newCapability]);
      setNewCapability('');
    }
  };

  const removeCapability = (capability: string) => {
    setCapabilities(capabilities.filter(c => c !== capability));
  };

  const addPresetCapability = (capability: string) => {
    if (!capabilities.includes(capability)) {
      setCapabilities([...capabilities, capability]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-axiom-dark-lighter rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Create New Agent</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 bg-axiom-dark border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-axiom-error focus:ring-axiom-error/30' : 'border-gray-700 focus:ring-axiom-cyan/30'
                }`}
                placeholder="Agent name"
              />
              {errors.name && <p className="mt-1 text-sm text-axiom-error">{errors.name}</p>}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 bg-axiom-dark border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-axiom-error focus:ring-axiom-error/30' : 'border-gray-700 focus:ring-axiom-cyan/30'
                }`}
                placeholder="Describe what this agent does..."
              />
              {errors.description && <p className="mt-1 text-sm text-axiom-error">{errors.description}</p>}
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <div className="flex gap-2">
                {(['active', 'inactive', 'paused'] as const).map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={status === option}
                      onChange={() => setStatus(option)}
                      className="mr-2 text-axiom-cyan focus:ring-axiom-cyan"
                    />
                    <span className="text-gray-300 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Capabilities Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Capabilities
              </label>
              
              {/* Selected Capabilities */}
              {capabilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {capabilities.map((capability) => (
                    <div 
                      key={capability} 
                      className="flex items-center bg-axiom-purple/20 text-axiom-purple px-2 py-1 rounded-full text-sm"
                    >
                      {capability}
                      <button
                        type="button"
                        onClick={() => removeCapability(capability)}
                        className="ml-1 text-axiom-purple/70 hover:text-axiom-purple"
                        aria-label={`Remove ${capability}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Custom Capability */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  className="flex-1 px-3 py-2 bg-axiom-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axiom-cyan/30"
                  placeholder="Add custom capability"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                />
                <button
                  type="button"
                  onClick={addCapability}
                  className="px-3 py-2 bg-axiom-dark-lighter text-white rounded-lg hover:bg-gray-700"
                  aria-label="Add capability"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Preset Capabilities */}
              <div className="flex flex-wrap gap-2">
                {capabilitiesList
                  .filter(cap => !capabilities.includes(cap))
                  .map((capability) => (
                    <button
                      key={capability}
                      type="button"
                      onClick={() => addPresetCapability(capability)}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600"
                    >
                      {capability}
                    </button>
                  ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}