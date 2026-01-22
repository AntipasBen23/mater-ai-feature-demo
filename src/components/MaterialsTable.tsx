'use client';

import { useState } from 'react';
import { ScoredMaterial } from '@/lib/prioritization';
import {
  formatCurrency,
  formatRelativeTime,
  getPriorityColor,
  getStatusColor,
  getComplexityColor,
  getLabPartnerColor,
} from '@/lib/utils';
import MaterialDetailModal from '@/components/MaterialDetailModal';

interface MaterialsTableProps {
  materials: ScoredMaterial[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export default function MaterialsTable({
  materials,
  filterStatus,
  setFilterStatus,
}: MaterialsTableProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<ScoredMaterial | null>(null);
  const [sortField, setSortField] = useState<keyof ScoredMaterial>('priorityScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle sorting
  const handleSort = (field: keyof ScoredMaterial) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort materials
  const sortedMaterials = [...materials].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const statusOptions = [
    { value: 'all', label: 'All Materials' },
    { value: 'Queued', label: 'Queued' },
    { value: 'In Synthesis', label: 'In Synthesis' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Validated', label: 'Validated' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const SortIcon = ({ field }: { field: keyof ScoredMaterial }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Material Candidates
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {sortedMaterials.length} materials • Click any row for details
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priorityScore')}
              >
                <div className="flex items-center gap-2">
                  Rank
                  <SortIcon field="priorityScore" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Material
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('predictedZT')}
              >
                <div className="flex items-center gap-2">
                  ZT
                  <SortIcon field="predictedZT" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estimatedCost')}
              >
                <div className="flex items-center gap-2">
                  Cost
                  <SortIcon field="estimatedCost" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Complexity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estimatedSynthesisTime')}
              >
                <div className="flex items-center gap-2">
                  Time
                  <SortIcon field="estimatedSynthesisTime" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedMaterials.map((material, index) => (
              <tr
                key={material.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedMaterial(material)}
              >
                {/* Priority Score */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">
                      #{index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                        material.priorityScore
                      )}`}
                    >
                      {material.priorityScore.toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Material Name */}
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {material.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {material.formula}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {material.id}
                    </p>
                  </div>
                </td>

                {/* Predicted ZT */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {material.predictedZT.toFixed(1)}
                    </span>
                    {material.predictedZT >= 1.5 && (
                      <span className="ml-2 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                </td>

                {/* Cost */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {formatCurrency(material.estimatedCost)}
                  </span>
                </td>

                {/* Complexity */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityColor(
                      material.synthesisComplexity
                    )}`}
                  >
                    {material.synthesisComplexity}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        material.status
                      )}`}
                    >
                      {material.status}
                    </span>
                    {material.labPartner && (
                      <p className={`mt-1 text-xs px-2 py-0.5 rounded inline-block ${getLabPartnerColor(material.labPartner)}`}>
                        {material.labPartner}
                      </p>
                    )}
                  </div>
                </td>

                {/* Synthesis Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {material.estimatedSynthesisTime}d
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMaterial(material);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedMaterials.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-sm">No materials match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}