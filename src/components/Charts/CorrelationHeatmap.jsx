"use client";

import { useMemo, Fragment } from "react";
import correlationData from "@/Data/correlation_matrix.json";

export default function CorrelationHeatmap() {
  const { features, matrix } = correlationData;

  // Color scale helper: -1 (Blue) -> 0 (White) -> 1 (Red)
  const getColor = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "#f3f4f6"; // gray-100 for NaN
    
    // Normalize to 0-255 range
    if (value > 0) {
      // White to Red
      const intensity = Math.floor(value * 255);
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    } else {
      // White to Blue
      const intensity = Math.floor(Math.abs(value) * 255);
      return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div 
        className="grid"
        style={{
          gridTemplateColumns: `auto repeat(${features.length}, minmax(16px, 1fr))`,
          minWidth: "max-content"
        }}
      >
        {/* Header Row */}
        <div className="h-16 sm:h-20"></div> {/* Top-left empty spacer */}
        {features.map((feature, i) => (
          <div key={`col-${i}`} className="relative h-20 w-5 sm:h-24 sm:w-8">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 -rotate-90 origin-bottom-left text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap">
              {feature}
            </span>
          </div>
        ))}

        {/* Data Rows */}
        {matrix.map((row, i) => (
          <Fragment key={`row-${i}`}>
            {/* Row Label */}
            <div key={`row-label-${i}`} className="flex items-center justify-end pr-2 h-5 sm:h-8">
              <span className="text-[9px] sm:text-[10px] text-gray-500 truncate max-w-[100px]" title={features[i]}>
                {features[i]}
              </span>
            </div>

            {/* Cells */}
            {row.map((cell, j) => (
              <div
                key={`cell-${i}-${j}`}
                className="h-5 w-5 sm:h-8 sm:w-8 border-[0.5px] border-gray-50 relative group"
                style={{ backgroundColor: getColor(cell) }}
                title={`${features[i]} vs ${features[j]}: ${cell?.toFixed(4)}`}
              >
                  {/* Tooltip via simple title prop or custom group-hover if needed */}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-6 gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500"></div> -1.0
        </div>
        <div className="flex items-center gap-1">
             <div className="w-4 h-4 bg-white border border-gray-200"></div> 0
        </div>
        <div className="flex items-center gap-1">
             <div className="w-4 h-4 bg-red-500"></div> +1.0
        </div>
      </div>
    </div>
  );
}
