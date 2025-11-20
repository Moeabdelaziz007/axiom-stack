'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash, Play, Pause, Copy } from 'lucide-react';

interface AgentActionsMenuProps {
  agentId: string;
  agentStatus: 'active' | 'inactive' | 'paused';
  onEdit: (agentId: string) => void;
  onDelete: (agentId: string) => void;
  onToggleStatus: (agentId: string) => void;
  onDuplicate: (agentId: string) => void;
}

export function AgentActionsMenu({
  agentId,
  agentStatus,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate
}: AgentActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    onEdit(agentId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(agentId);
    setIsOpen(false);
  };

  const handleToggleStatus = () => {
    onToggleStatus(agentId);
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate(agentId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
        aria-label="Agent actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-axiom-dark-lighter rounded-lg shadow-lg z-10 border border-gray-700">
          <div className="py-1">
            <button
              onClick={handleEdit}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={handleDuplicate}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </button>
            
            <button
              onClick={handleToggleStatus}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {agentStatus === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </button>
            
            <hr className="border-gray-700 my-1" />
            
            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2 text-sm text-axiom-error hover:bg-axiom-error/20"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}