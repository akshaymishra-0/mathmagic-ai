import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Maximize2 } from 'lucide-react';

const GraphVisualizer = ({ graphData }) => {
  if (!graphData || !graphData.points || graphData.points.length === 0) {
    return null;
  }

  const { type, equation, points, domain, range } = graphData;

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
    <div className="glass-effect rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
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

      <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
        <ResponsiveContainer width="100%" height={400}>
          {type === 'scatter' ? (
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis 
                type="number" 
                dataKey="x" 
                stroke="#8b5cf6"
                domain={domain ? [domain.min, domain.max] : ['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                stroke="#8b5cf6"
                domain={range ? [range.min, range.max] : ['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter 
                data={points} 
                fill="#8b5cf6" 
                line={{ stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </ScatterChart>
          ) : (
            <LineChart data={points} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis 
                dataKey="x" 
                stroke="#8b5cf6"
                domain={domain ? [domain.min, domain.max] : ['auto', 'auto']}
              />
              <YAxis 
                stroke="#8b5cf6"
                domain={range ? [range.min, range.max] : ['auto', 'auto']}
              />
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
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent-purple"></div>
          <span>X-Axis</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent-blue"></div>
          <span>Y-Axis</span>
        </div>
        <div className="flex items-center space-x-2">
          <Maximize2 className="w-3 h-3" />
          <span>{points.length} points plotted</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;