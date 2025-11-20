type MockAgentStatus = 'active' | 'inactive' | 'paused';

interface StatusDotProps {
  status: MockAgentStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  const statusClasses = {
    active: 'bg-axiom-success',
    inactive: 'bg-gray-500',
    paused: 'bg-axiom-warning'
  };

  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    paused: 'Paused'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${statusClasses[status]}`} />
      <span className="text-sm font-mono capitalize">{statusLabels[status]}</span>
    </div>
  );
}