'use client';

import { useEffect, useRef, useState } from 'react';

interface BarChartCategory {
  key: string;
  label: string;
}

interface BarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  categories: BarChartCategory[];
}

// Generate a color palette for the bar chart
const generateColors = (count: number) => {
  const baseColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];
  
  return baseColors.slice(0, count);
};

export function BarChart({ data, categories }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredBar, setHoveredBar] = useState<{ dataIndex: number; categoryIndex: number } | null>(null);
  
  useEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);
  
  // If no data, show a message
  if (data.length === 0 || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }
  
  const colors = generateColors(categories.length);
  
  // Chart dimensions
  const margin = { top: 20, right: 20, bottom: 120, left: 40 };
  const chartWidth = dimensions.width - margin.left - margin.right;
  const chartHeight = dimensions.height - margin.top - margin.bottom;
  
  // Calculate the maximum value for the y-axis
  const maxValue = Math.max(
    ...data.flatMap(item => 
      categories.map(category => 
        typeof item[category.key] === 'number' ? item[category.key] : 0
      )
    ),
    5 // Ensure we have a minimum scale
  );
  
  // Calculate the width of each group of bars
  // Ensure there's enough space between groups
  const groupWidth = Math.max(40, chartWidth / Math.max(1, data.length));
  const barWidth = Math.max(8, groupWidth * 0.5 / Math.max(1, categories.length)); // 50% of the group width for bars
  const barSpacing = barWidth * 0.3; // 30% of bar width as spacing between bars
  const groupPadding = groupWidth * 0.25; // 25% padding on each side
  
  // Y-axis ticks
  const yTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];
  
  // Scale a value to the chart height
  const scaleY = (value: number) => chartHeight * (1 - value / maxValue);
  
  return (
    <div className="relative h-80">
      <svg 
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Y-axis */}
          <line 
            x1="0" 
            y1="0" 
            x2="0" 
            y2={chartHeight} 
            stroke="#e5e7eb" 
            strokeWidth="1"
          />
          
          {/* Y-axis ticks and grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line 
                x1="-5" 
                y1={scaleY(tick)} 
                x2="0" 
                y2={scaleY(tick)} 
                stroke="#9ca3af" 
                strokeWidth="1"
              />
              <text 
                x="-10" 
                y={scaleY(tick)} 
                textAnchor="end" 
                dominantBaseline="middle" 
                className="text-xs text-gray-500"
              >
                {tick.toFixed(1)}
              </text>
              <line 
                x1="0" 
                y1={scaleY(tick)} 
                x2={chartWidth} 
                y2={scaleY(tick)} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
            </g>
          ))}
          
          {/* X-axis */}
          <line 
            x1="0" 
            y1={chartHeight} 
            x2={chartWidth} 
            y2={chartHeight} 
            stroke="#e5e7eb" 
            strokeWidth="1"
          />
          
          {/* Bars */}
          {data.map((item, dataIndex) => (
            <g key={dataIndex} transform={`translate(${dataIndex * groupWidth + groupPadding}, 0)`}>
              {/* X-axis labels */}
              <text 
                x={groupWidth / 2 - groupPadding} 
                y={chartHeight + 25} 
                textAnchor="end" 
                transform={`rotate(-40, ${groupWidth / 2 - groupPadding}, ${chartHeight + 25})`}
                className="text-xs text-gray-500"
                style={{ fontSize: '10px' }}
              >
                {item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name}
              </text>
              
              {/* Bars for each category */}
              {categories.map((category, categoryIndex) => {
                const value = typeof item[category.key] === 'number' ? item[category.key] : 0;
                const barHeight = Math.max(0, chartHeight - scaleY(value));
                const isHovered = hoveredBar?.dataIndex === dataIndex && hoveredBar?.categoryIndex === categoryIndex;
                
                return (
                  <g key={categoryIndex}>
                    <g>
                      <rect 
                        x={categoryIndex * (barWidth + barSpacing)} 
                        y={scaleY(value)} 
                        width={Math.max(0, barWidth)} 
                        height={Math.max(0, barHeight)}
                        fill={colors[categoryIndex]}
                        stroke={isHovered ? '#000' : 'none'}
                        strokeWidth={isHovered ? 1 : 0}
                        rx="2"
                        className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                        onMouseEnter={() => setHoveredBar({ dataIndex, categoryIndex })}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                      
                      {/* Tooltip */}
                      {isHovered && (
                        <g>
                          <rect
                            x={categoryIndex * (barWidth + barSpacing) - 50}
                            y={scaleY(value) - 40}
                            width="100"
                            height="35"
                            rx="4"
                            fill="rgba(0,0,0,0.8)"
                          />
                          <text
                            x={categoryIndex * (barWidth + barSpacing)}
                            y={scaleY(value) - 25}
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                          >
                            {item.name}
                          </text>
                          <text
                            x={categoryIndex * (barWidth + barSpacing)}
                            y={scaleY(value) - 10}
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                          >
                            {category.label}: {value.toFixed(1)}
                          </text>
                        </g>
                      )}
                    </g>
                    
                    {/* Value label on top of the bar */}
                    {barHeight > 20 && (
                      <text 
                        x={categoryIndex * (barWidth + barSpacing) + barWidth / 2} 
                        y={scaleY(value) + 15} 
                        textAnchor="middle" 
                        className="text-xs text-white font-medium"
                      >
                        {value.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-sm" 
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm text-gray-700 font-medium">
                {category.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
