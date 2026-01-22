'use client';

import { ScoredMaterial } from '@/lib/prioritization';
import {
  formatCurrency,
  formatRelativeTime,
  getPriorityColor,
  getStatusColor,
  getComplexityColor,
  getLabPartnerColor,
  calculateStats,
} from '@/lib/utils';
import { calculateROI } from '@/lib/prioritization';

interface MaterialDetailModalProps {
  material: ScoredMaterial | null;
  onClose: () => void;
}

export default function MaterialDetailModal({
  material,
  onClose,
}: MaterialDetailModalProps) {
  if (!material) return null;

  const roi = calculateROI(material);

  // Score breakdown for visualization
  const scoreBreakdown = [
    { label: 'Efficiency (ZT)', value: material.breakdown.efficiency, weight: 0.25 },
    { label: 'Cost', value: material.breakdown.cost, weight: 0.15 },
    { label: 'Synthesis Complexity', value: material.breakdown.synthesisComplexity, weight: 0.15 },
    { label: 'Toxicity', value: material.breakdown.toxicity, weight: 0.10 },
    { label: 'Availability', value: material.breakdown.availability, weight: 0.10 },
    { label: 'Novelty', value: material.breakdown.novelty, weight: 0.10 },
    { label: 'Commercial Viability', value: material.breakdown.commercialViability, weight: 0.10 },
    { label: 'Synthesis Time', value: material.breakdown.synthesisTime, weight: 0.05 },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {material.name}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(
                  material.priorityScore
                )}`}
              >
                Score: {material.priorityScore.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-mono text-gray-600">{material.formula}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{material.id}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Generated {formatRelativeTime(material.generatedDate)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  material.status
                )}`}
              >
                {material.status}
              </span>
              {material.labPartner && (
                <p className={`mt-2 text-xs px-2 py-1 rounded inline-block ${getLabPartnerColor(material.labPartner)}`}>
                  {material.labPartner}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Predicted ZT</p>
              <p className="text-2xl font-bold text-gray-900">{material.predictedZT.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Industry std: 1.0</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Synthesis Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(material.estimatedCost)}</p>
              <p className="text-xs text-gray-500 mt-1">Per synthesis</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Synthesis Time</p>
              <p className="text-2xl font-bold text-gray-900">{material.estimatedSynthesisTime}</p>
              <p className="text-xs text-gray-500 mt-1">Days</p>
            </div>
          </div>

          {/* Properties Section */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Material Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Thermal Conductivity</span>
                <span className="text-sm font-semibold text-gray-900">{material.thermalConductivity} W/mK</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Electrical Conductivity</span>
                <span className="text-sm font-semibold text-gray-900">{material.electricalConductivity.toLocaleString()} S/m</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Toxicity Score</span>
                <span className="text-sm font-semibold text-gray-900">{material.toxicityScore}/10 (lower is better)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Synthesis Complexity</span>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded ${getComplexityColor(material.synthesisComplexity)}`}>
                  {material.synthesisComplexity}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Material Availability</span>
                <span className="text-sm font-semibold text-gray-900">{material.availabilityScore}/10</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Novelty Score</span>
                <span className="text-sm font-semibold text-gray-900">{material.noveltyScore}/10</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Commercial Viability</span>
                <span className="text-sm font-semibold text-gray-900">{material.commercialViability}/10</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">ROI Metric</span>
                <span className="text-sm font-semibold text-green-600">{roi.toFixed(2)} ZT/£1k</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Priority Score Breakdown</h3>
            <div className="space-y-3">
              {scoreBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{item.label}</span>
                      <span className="text-xs text-gray-500">(Weight: {(item.weight * 100).toFixed(0)}%)</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(item.value / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Score Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Final Priority Score</span>
                <span
                  className={`text-2xl font-bold px-4 py-2 rounded-lg border ${getPriorityColor(
                    material.priorityScore
                  )}`}
                >
                  {material.priorityScore.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`rounded-lg p-4 border ${
            material.priorityScore >= 7
              ? 'bg-green-50 border-green-200'
              : material.priorityScore >= 5
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex gap-3">
              <svg
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  material.priorityScore >= 7
                    ? 'text-green-600'
                    : material.priorityScore >= 5
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    material.priorityScore >= 7
                      ? 'text-green-900'
                      : material.priorityScore >= 5
                      ? 'text-yellow-900'
                      : 'text-red-900'
                  }`}
                >
                  {material.priorityScore >= 7
                    ? 'High Priority - Recommended for Synthesis'
                    : material.priorityScore >= 5
                    ? 'Medium Priority - Consider for Next Round'
                    : 'Low Priority - Review Criteria'}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    material.priorityScore >= 7
                      ? 'text-green-700'
                      : material.priorityScore >= 5
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  }`}
                >
                  {material.priorityScore >= 7
                    ? 'This material shows strong potential across multiple criteria and should be prioritized for lab synthesis.'
                    : material.priorityScore >= 5
                    ? 'This material has moderate potential. Consider synthesizing after higher-priority candidates.'
                    : 'This material may require further optimization or should be deprioritized in favor of stronger candidates.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={material.status !== 'Queued'}
            >
              {material.status === 'Queued' ? 'Send to Lab Queue' : 'Already in Progress'}
            </button>
            <button
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {material.notes && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{material.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}