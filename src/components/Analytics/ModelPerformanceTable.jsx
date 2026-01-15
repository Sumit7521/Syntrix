"use client";

import React from 'react';

const metrics = [
  {
    model: 'Random Forest',
    accuracy: '99.9%',
    precision: '99.9%',
    recall: '99.9%',
    f1: '99.9%',
  },
  {
    model: 'XGBoost',
    accuracy: '99.9%',
    precision: '99.9%',
    recall: '99.9%',
    f1: '99.9%',
  },
  {
    model: 'Decision Tree',
    accuracy: '96.6%',
    precision: '96.7%',
    recall: '96.6%',
    f1: '96.6%',
  },
  {
    model: 'AdaBoost',
    accuracy: '97.7%',
    precision: '97.7%',
    recall: '97.7%',
    f1: '97.7%',
  },
];

export default function ModelPerformanceTable() {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-left text-xs sm:text-sm whitespace-nowrap">
        <thead className="uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
          <tr>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 font-semibold text-gray-700">Model</th>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 font-semibold text-gray-700">Accuracy</th>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 font-semibold text-gray-700">Precision</th>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 font-semibold text-gray-700">Recall</th>
            <th scope="col" className="px-3 py-3 sm:px-6 sm:py-4 font-semibold text-gray-700">F1 Score</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((item, index) => (
            <tr key={item.model} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-gray-900">{item.model}</td>
              <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-600">{item.accuracy}</td>
              <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-600">{item.precision}</td>
              <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-600">{item.recall}</td>
              <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-600">
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
