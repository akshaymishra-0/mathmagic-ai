import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { TrendingUp, Maximize2 } from 'lucide-react';

const GraphVisualizer = ({ graphData }) => {
  if (!graphData || !graphData.points || graphData.points.length === 0) {
    return null;
  }

  const { type, equation, points, domain, range } = graphData;

  // Sort points by x value for proper line drawing
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  // Calculate domains that include 0 and show all 4 quadrants
  const calculateAxisDomain = (dataPoints, providedDomain, isX = false) => {
    if (providedDomain) {
      // Ensure domain includes 0 and extends to both sides
      const min = Math.min(providedDomain.min, 0);
      const max = Math.max(providedDomain.max, 0);
      // Extend the range to show more of the quadrants
      const range = max - min;
      const extension = Math.max(range * 0.2, 2); // Extend by 20% or at least 2 units
      return [min - extension, max + extension];
    }

    // Auto-calculate domain from data points
    const values = isX ? dataPoints.map(p => p.x) : dataPoints.map(p => p.y);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Always include 0 and extend to show all quadrants
    const absMax = Math.max(Math.abs(min), Math.abs(max), 5); // Minimum range of 10 units
    return [-absMax, absMax];
  };

  const xDomain = calculateAxisDomain(sortedPoints, domain, true);
  const yDomain = calculateAxisDomain(sortedPoints, range, false);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect px-3 py-2 rounded-lg shadow-xl">
          <p className="text-sm">
            <span className="text-accent-blue">x:</span> {payload[0].payload.x.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className="text-accent-green">y:</span> {payload[0].payload.y.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-effect rounded-2xl p-3 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent-orange" />
            <h2 className="text-xl font-semibold">Graph Visualization</h2>
          </div>
          {equation && (
            <p className="text-sm text-gray-400">
              Equation: <code className="text-accent-blue font-mono">{equation}</code>
            </p>
          )}
        </div>
        <div className="topic-badge from-accent-orange to-accent-purple">
          {type || 'Graph'}
        </div>
      </div>

      <div className="bg-dark-card rounded-xl p-3 md:p-6 border border-dark-border">
        <ResponsiveContainer width="100%" height={450}>
          {type === 'scatter' ? (
            <ScatterChart margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis 
                type="number" 
                dataKey="x" 
                stroke="#3b82f6"
                domain={xDomain}
                axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                tickLine={{ stroke: '#3b82f6' }}
                tick={{ fill: '#3b82f6', fontSize: 12 }}
                label={{ value: 'X-Axis', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#3b82f6', fontSize: '14px', fontWeight: 'bold' } }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                stroke="#10b981"
                domain={yDomain}
                axisLine={{ stroke: '#10b981', strokeWidth: 2 }}
                tickLine={{ stroke: '#10b981' }}
                tick={{ fill: '#10b981', fontSize: 12 }}
                label={{ value: 'Y-Axis', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#10b981', fontSize: '14px', fontWeight: 'bold' } }}
              />
              <ReferenceLine x={0} stroke="#3b82f6" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter 
                data={sortedPoints} 
                fill="#8b5cf6" 
              />
            </ScatterChart>
          ) : (
            <LineChart data={sortedPoints} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis 
                dataKey="x" 
                stroke="#3b82f6"
                domain={xDomain}
                axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                tickLine={{ stroke: '#3b82f6' }}
                tick={{ fill: '#3b82f6', fontSize: 12 }}
                label={{ value: 'X-Axis', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#3b82f6', fontSize: '14px', fontWeight: 'bold' } }}
              />
              <YAxis 
                stroke="#10b981"
                domain={yDomain}
                axisLine={{ stroke: '#10b981', strokeWidth: 2 }}
                tickLine={{ stroke: '#10b981' }}
                tick={{ fill: '#10b981', fontSize: 12 }}
                label={{ value: 'Y-Axis', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#10b981', fontSize: '14px', fontWeight: 'bold' } }}
              />
              <ReferenceLine x={0} stroke="#3b82f6" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="url(#colorGradient)" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent-blue"></div>
          <span>X-Axis</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent-green"></div>
          <span>Y-Axis</span>
        </div>
        <div className="flex items-center space-x-2">
          <Maximize2 className="w-3 h-3" />
          <span>{sortedPoints.length} points plotted</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;