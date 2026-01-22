'use client';

import { type PriorityWeights, defaultWeights } from '@/lib/prioritization';

interface WeightControlsProps {
  weights: PriorityWeights;
  setWeights: (weights: PriorityWeights) => void;
}

export default function WeightControls({ weights, setWeights }: WeightControlsProps) {
  const handleWeightChange = (key: keyof PriorityWeights, value: number) => {
    setWeights({
      ...weights,
      [key]: value,
    });
  };

  const resetWeights = () => {
    setWeights(defaultWeights);
  };

  const weightConfigs = [
    {
      key: 'efficiency' as keyof PriorityWeights,
      label: 'Efficiency (ZT)',
      description: 'Predicted thermoelectric figure of merit',
      color: 'bg-green-500',
    },
    {
      key: 'cost' as keyof PriorityWeights,
      label: 'Cost',
      description: 'Lower synthesis cost preferred',
      color: 'bg-blue-500',
    },
    {
      key: 'synthesisComplexity' as keyof PriorityWeights,
      label: 'Synthesis Complexity',
      description: 'Lower complexity preferred',
      color: 'bg-purple-500',
    },
    {
      key: 'toxicity' as keyof PriorityWeights,
      label: 'Toxicity',
      description: 'Lower toxicity preferred',
      color: 'bg-red-500',
    },
    {
      key: 'availability' as keyof PriorityWeights,
      label: 'Material Availability',
      description: 'Precursor material availability',
      color: 'bg-yellow-500',
    },
    {
      key: 'novelty' as keyof PriorityWeights,
      label: 'Novelty',
      description: 'Uniqueness of material structure',
      color: 'bg-pink-500',
    },
    {
      key: 'commercialViability' as keyof PriorityWeights,
      label: 'Commercial Viability',
      description: 'Market readiness potential',
      color: 'bg-indigo-500',
    },
    {
      key: 'synthesisTime' as keyof PriorityWeights,
      label: 'Synthesis Time',
      description: 'Shorter synthesis time preferred',
      color: 'bg-orange-500',
    },
  ];

  // Calculate if weights sum to 1.0
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const isBalanced = Math.abs(totalWeight - 1.0) < 0.01;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Prioritization Weights
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Adjust weights to customize material ranking criteria
          </p>
        </div>
        <button
          onClick={resetWeights}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {/* Weight Total Indicator */}
      <div className={`mb-6 p-3 rounded-lg border ${
        isBalanced 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Total Weight Sum:
          </span>
          <span className={`text-sm font-bold ${
            isBalanced ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {totalWeight.toFixed(2)} {isBalanced ? '✓' : '(should equal 1.00)'}
          </span>
        </div>
      </div>

      {/* Weight Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weightConfigs.map((config) => (
          <div key={config.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label
                  htmlFor={config.key}
                  className="block text-sm font-medium text-gray-700"
                >
                  {config.label}
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  {config.description}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900 ml-4">
                {(weights[config.key] * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                id={config.key}
                min="0"
                max="1"
                step="0.05"
                value={weights[config.key]}
                onChange={(e) =>
                  handleWeightChange(config.key, parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, ${config.color.replace('bg-', 'rgb(var(--')})} 0%, ${config.color.replace('bg-', 'rgb(var(--')})} ${weights[config.key] * 100}%, #e5e7eb ${weights[config.key] * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">
              How it works
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Each material is scored on a 0-10 scale for every criterion. The weights determine how much each criterion contributes to the final priority score. Materials are then ranked from highest to lowest priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}