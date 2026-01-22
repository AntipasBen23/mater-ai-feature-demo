import { formatCurrency } from '@/lib/utils';

interface StatsCardsProps {
  stats: {
    queued: number;
    inSynthesis: number;
    testing: number;
    validated: number;
    total: number;
    avgZT: number;
    avgCost: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Materials in Queue',
      value: stats.queued,
      sublabel: 'Ready for synthesis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'In Synthesis',
      value: stats.inSynthesis,
      sublabel: 'Active lab work',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      label: 'Testing Phase',
      value: stats.testing,
      sublabel: 'Under validation',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    },
    {
      label: 'Avg. Predicted ZT',
      value: stats.avgZT.toFixed(2),
      sublabel: 'Industry standard: 1.0',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-green-50 text-green-600 border-green-100',
    },
    {
      label: 'Avg. Synthesis Cost',
      value: formatCurrency(stats.avgCost),
      sublabel: 'Per material',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      label: 'Total Candidates',
      value: stats.total,
      sublabel: 'AI-generated',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-gray-50 text-gray-600 border-gray-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500">{card.sublabel}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color} border`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}