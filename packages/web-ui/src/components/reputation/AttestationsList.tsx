'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Shield } from 'lucide-react';

// Mock attestation data
const mockAttestations = [
  {
    id: '1',
    type: 'verification',
    status: 'verified',
    issuer: 'Community Validator',
    date: '2023-06-15T10:30:00Z',
    description: 'Verified agent performance metrics'
  },
  {
    id: '2',
    type: 'endorsement',
    status: 'pending',
    issuer: 'Trusted Partner',
    date: '2023-06-12T14:22:00Z',
    description: 'Endorsement for quality service'
  },
  {
    id: '3',
    type: 'verification',
    status: 'verified',
    issuer: 'Network Authority',
    date: '2023-06-10T09:15:00Z',
    description: 'Security audit passed successfully'
  },
  {
    id: '4',
    type: 'endorsement',
    status: 'rejected',
    issuer: 'Community Member',
    date: '2023-06-08T16:45:00Z',
    description: 'Complaint about service quality'
  },
  {
    id: '5',
    type: 'verification',
    status: 'verified',
    issuer: 'Technical Review Board',
    date: '2023-06-05T12:30:00Z',
    description: 'Technical competency assessment'
  },
];

export function AttestationsList() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

  const filteredAttestations = mockAttestations.filter(attestation => {
    if (filter === 'all') return true;
    return attestation.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-axiom-success" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-axiom-warning" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-axiom-error" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-axiom-success/20 text-axiom-success border-axiom-success/30';
      case 'pending':
        return 'bg-axiom-warning/20 text-axiom-warning border-axiom-warning/30';
      case 'rejected':
        return 'bg-axiom-error/20 text-axiom-error border-axiom-error/30';
      default:
        return 'bg-gray-700/20 text-gray-400 border-gray-700/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="glass-panel p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Attestations</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-axiom-cyan text-axiom-dark'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'verified'
                ? 'bg-axiom-success/20 text-axiom-success border border-axiom-success/30'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'pending'
                ? 'bg-axiom-warning/20 text-axiom-warning border border-axiom-warning/30'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'rejected'
                ? 'bg-axiom-error/20 text-axiom-error border border-axiom-error/30'
                : 'bg-axiom-dark-lighter text-gray-300 hover:bg-gray-700'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAttestations.length > 0 ? (
          filteredAttestations.map((attestation) => (
            <div
              key={attestation.id}
              className="p-4 bg-axiom-dark-lighter rounded-lg border border-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getStatusIcon(attestation.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white capitalize">{attestation.type}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusClass(attestation.status)}`}>
                        {attestation.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">{attestation.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{attestation.issuer}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatDate(attestation.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-white"
                  aria-label="View attestation details"
                >
                  <Shield className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No attestations found for the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}