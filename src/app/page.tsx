'use client';

import { useState, useMemo } from 'react';
import { mockMaterials } from '@/data/mockMaterials';
import { rankMaterials, defaultWeights, type PriorityWeights } from '@/lib/prioritization';
import { calculateStats } from '@/lib/utils';
import StatsCards from '@/components/StatsCards';
import WeightControls from '@/components/WeightControls';
import MaterialsTable from '@/components/MaterialsTable';
import PriorityChart from '@/components/PriorityChart';

export default function Home() {
  const [weights, setWeights] = useState<PriorityWeights>(defaultWeights);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Calculate ranked materials based on current weights
  const rankedMaterials = useMemo(() => {
    return rankMaterials(mockMaterials, weights);
  }, [weights]);

  // Filter materials by status
  const filteredMaterials = useMemo(() => {
    if (filterStatus === 'all') return rankedMaterials;
    return rankedMaterials.filter((m) => m.status === filterStatus);
  }, [rankedMaterials, filterStatus]);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(mockMaterials), []);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section - Minimal */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#2B5FDE] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Smart Prioritization Engine
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-13">
            Intelligent ranking of AI-generated thermoelectric material candidates
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Weight Controls */}
        <div className="mt-6">
          <WeightControls weights={weights} setWeights={setWeights} />
        </div>

        {/* Priority Distribution Chart */}
        <div className="mt-6">
          <PriorityChart materials={rankedMaterials} />
        </div>

        {/* Materials Table */}
        <div className="mt-6">
          <MaterialsTable
            materials={filteredMaterials}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>
      </div>
    </main>
  );
}