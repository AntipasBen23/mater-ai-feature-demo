'use client';

import { ScoredMaterial } from '@/lib/prioritization';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface PriorityChartProps {
  materials: ScoredMaterial[];
}

export default function PriorityChart({ materials }: PriorityChartProps) {
  // Prepare data for chart - top 10 materials
  const chartData = materials
    .filter((m) => m.status === 'Queued')
    .slice(0, 10)
    .map((material) => ({
      name: material.id,
      score: material.priorityScore,
      fullName: material.name,
    }));

  // Color based on score
  const getBarColor = (score: number) => {
    if (score >= 8) return '#10B981'; // green
    if (score >= 6) return '#3B82F6'; // blue
    if (score >= 4) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.fullName}</p>
          <p className="text-xs text-gray-600 mt-1">ID: {payload[0].payload.name}</p>
          <p className="text-sm font-bold text-blue-600 mt-2">
            Priority Score: {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Top 10 Priority Candidates
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Materials ranked by priority score (Queued status only)
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">No queued materials to display</p>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis
                label={{ value: 'Priority Score', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 12 } }}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                domain={[0, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                content={() => (
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-gray-600">High (8-10)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span className="text-gray-600">Good (6-8)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-gray-600">Medium (4-6)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-gray-600">Low (<4)</span>
                    </div>
                  </div>
                )}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Highest Score</p>
            <p className="text-lg font-bold text-green-600">
              {chartData.length > 0 ? chartData[0].score.toFixed(2) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Average Score</p>
            <p className="text-lg font-bold text-blue-600">
              {chartData.length > 0
                ? (chartData.reduce((sum, m) => sum + m.score, 0) / chartData.length).toFixed(2)
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Candidates Shown</p>
            <p className="text-lg font-bold text-gray-900">
              {chartData.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}