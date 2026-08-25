import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts";

const GraphVisualizer = ({ graphData }) => {
  if (!graphData || !graphData.points || graphData.points.length === 0) {
    return null;
  }

  const { type, equation, points, domain, range } = graphData;

  // Sort points so the line draws correctly
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  // Calculate axis range, always including 0 to show all quadrants
  const getAxisDomain = (dataPoints, provided, isX = false) => {
    if (provided) {
      const min = Math.min(provided.min, 0);
      const max = Math.max(provided.max, 0);
      const span = max - min;
      const padding = Math.max(span * 0.2, 2);
      return [min - padding, max + padding];
    }

    const values = isX ? dataPoints.map((p) => p.x) : dataPoints.map((p) => p.y);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const absMax = Math.max(Math.abs(min), Math.abs(max), 5);
    return [-absMax, absMax];
  };

  const xDomain = getAxisDomain(sortedPoints, domain, true);
  const yDomain = getAxisDomain(sortedPoints, range, false);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect px-3 py-2 rounded-lg text-sm">
          <p><span className="text-accent-blue">x:</span> {payload[0].payload.x.toFixed(2)}</p>
          <p><span className="text-accent-green">y:</span> {payload[0].payload.y.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const axisStyle = {
    x: {
      stroke: "#3b82f6",
      tick: { fill: "#3b82f6", fontSize: 12 },
      axisLine: { stroke: "#3b82f6", strokeWidth: 2 },
      tickLine: { stroke: "#3b82f6" },
    },
    y: {
      stroke: "#10b981",
      tick: { fill: "#10b981", fontSize: 12 },
      axisLine: { stroke: "#10b981", strokeWidth: 2 },
      tickLine: { stroke: "#10b981" },
    },
  };

  return (
    <div className="glass-effect rounded-2xl p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Graph</h2>
        {equation && (
          <p className="text-sm text-gray-400 mt-1">
            Equation: <code className="text-accent-blue font-mono">{equation}</code>
          </p>
        )}
      </div>

      <div className="bg-dark-card rounded-xl p-3 border border-dark-border">
        <ResponsiveContainer width="100%" height={400}>
          {type === "scatter" ? (
            <ScatterChart margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis
                type="number"
                dataKey="x"
                domain={xDomain}
                {...axisStyle.x}
                label={{ value: "X", position: "insideBottom", offset: -5, fill: "#3b82f6" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={yDomain}
                {...axisStyle.y}
                label={{ value: "Y", angle: -90, position: "insideLeft", fill: "#10b981" }}
              />
              <ReferenceLine x={0} stroke="#3b82f6" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={sortedPoints} fill="#8b5cf6" />
            </ScatterChart>
          ) : (
            <LineChart data={sortedPoints} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis
                dataKey="x"
                domain={xDomain}
                {...axisStyle.x}
                label={{ value: "X", position: "insideBottom", offset: -5, fill: "#3b82f6" }}
              />
              <YAxis
                domain={yDomain}
                {...axisStyle.y}
                label={{ value: "Y", angle: -90, position: "insideLeft", fill: "#10b981" }}
              />
              <ReferenceLine x={0} stroke="#3b82f6" strokeWidth={2} />
              <ReferenceLine y={0} stroke="#10b981" strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#8b5cf6" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-blue inline-block" /> X-Axis
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green inline-block" /> Y-Axis
        </span>
        <span>{sortedPoints.length} points</span>
      </div>
    </div>
  );
};

export default GraphVisualizer;
