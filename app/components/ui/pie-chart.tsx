'use client';

import { useEffect, useRef, useState } from 'react';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
}

// Generate a color palette for the pie chart
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
  
  // If we have more data points than base colors, we'll generate additional colors
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // Generate additional colors by adjusting lightness
  const colors = [...baseColors];
  const neededExtraColors = count - baseColors.length;
  
  for (let i = 0; i < neededExtraColors; i++) {
    const baseColor = baseColors[i % baseColors.length];
    // Adjust the color slightly to create a variation
    colors.push(adjustColor(baseColor, i));
  }
  
  return colors;
};

// Helper function to adjust a color
const adjustColor = (hex: string, index: number) => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Adjust the color based on the index
  const factor = 0.8 + (index % 3) * 0.1; // This will give slight variations
  
  // Ensure values stay in valid range
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

export function PieChart({ data }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);
  
  // Filter out zero values and calculate total
  const filteredData = data.filter(item => item.value > 0);
  const total = filteredData.reduce((sum, item) => sum + item.value, 0);
  
  // If no data or total is 0, show a message
  if (filteredData.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }
  
  const colors = generateColors(filteredData.length);
  
  // Calculate the segments of the pie chart
  let startAngle = 0;
  const segments = filteredData.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const endAngle = startAngle + angle;
    
    // Calculate the SVG arc path
    const radius = Math.min(dimensions.width, dimensions.height) / 2.5;
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    
    // Determine if the arc should be drawn as a large arc (> 180 degrees)
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Create the SVG path
    const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    // Calculate position for the label
    const labelRadius = radius * 0.7;
    const labelAngle = startAngle + angle / 2;
    const labelRad = (labelAngle - 90) * Math.PI / 180;
    const labelX = labelRadius * Math.cos(labelRad);
    const labelY = labelRadius * Math.sin(labelRad);
    
    // Calculate position for the percentage label
    const percentRadius = radius * 0.85;
    const percentX = percentRadius * Math.cos(labelRad);
    const percentY = percentRadius * Math.sin(labelRad);
    
    const result = {
      path,
      color: colors[index],
      percentage,
      startAngle,
      endAngle,
      name: item.name,
      value: item.value,
      labelX,
      labelY,
      percentX,
      percentY,
    };
    
    startAngle = endAngle;
    return result;
  });
  
  return (
    <div className="relative h-80">
      <svg 
        ref={svgRef}
        className="w-full h-full"
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.path}
              fill={segment.color}
              stroke="white"
              strokeWidth="1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
            />
            
            {/* Tooltip */}
            {hoveredIndex === index && (
              <g>
                <rect
                  x={segment.labelX - 60}
                  y={segment.labelY - 30}
                  width="120"
                  height="40"
                  rx="4"
                  fill="rgba(0,0,0,0.8)"
                />
                <text
                  x={segment.labelX}
                  y={segment.labelY - 15}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                >
                  {segment.name}
                </text>
                <text
                  x={segment.labelX}
                  y={segment.labelY + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                >
                  {segment.value} {segment.value === 1 ? 'vote' : 'votes'}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {segments.map((segment, index) => (
            <div 
              key={index}
              className="flex items-center gap-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className="w-4 h-4 rounded-sm" 
                style={{ 
                  backgroundColor: segment.color,
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5
                }}
              />
              <span className="text-sm text-gray-700 font-medium">
                {segment.name} ({segment.value} {segment.value === 1 ? 'vote' : 'votes'})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
