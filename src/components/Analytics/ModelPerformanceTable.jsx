"use client";

import React from 'react';

const metrics = [
  { model: 'Random Forest', accuracy: '99.8%', precision: '99.7%', recall: '99.8%', f1: '99.7%' },
  { model: 'XGBoost', accuracy: '99.5%', precision: '99.4%', recall: '99.6%', f1: '99.5%' },
  { model: 'Decision Tree', accuracy: '98.2%', precision: '98.0%', recall: '98.4%', f1: '98.2%' },
  { model: 'AdaBoost', accuracy: '96.5%', precision: '96.1%', recall: '97.0%', f1: '96.5%' },
];

export default function ModelPerformanceTable() {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Model</th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Accuracy</th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Precision</th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">Recall</th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">F1 Score</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((item, index) => (
            <tr key={item.model} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{item.model}</td>
              <td className="px-6 py-4 text-gray-600">{item.accuracy}</td>
              <td className="px-6 py-4 text-gray-600">{item.precision}</td>
              <td className="px-6 py-4 text-gray-600">{item.recall}</td>
              <td className="px-6 py-4 text-gray-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                  {item.f1}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
