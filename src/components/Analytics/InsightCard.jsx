"use client";

import React from 'react';

export default function InsightCard({ title, value, delta, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        {icon && (
          <div className="p-2 bg-gray-50 text-black rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {delta && (
        <div className="flex items-center text-xs">
          <span className={`font-medium ${delta.isPositive ? 'text-black' : 'text-gray-500'}`}>
            {delta.value}
          </span>
          <span className="text-gray-400 ml-1.5">vs last training</span>
        </div>
      )}
    </div>
  );
}
