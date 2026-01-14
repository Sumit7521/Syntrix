import React from 'react';

const Card = ({ title, value, change, accentColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-4xl font-bold text-gray-900 font-space">{value}</span>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${accentColor}-50 text-${accentColor}-600`}>
        {change}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Overview</h1>
          <p className="text-gray-500">Real-time monitoring and security insights.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            Export Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Models" value="12" change="+2 Active" accentColor="indigo" />
        <Card title="Attacks Prevented" value="843" change="+12% vs last week" accentColor="teal" />
        <Card title="Avg. Response" value="45ms" change="-5ms Improvement" accentColor="indigo" />
        <Card title="System Health" value="98.2%" change="Optimal" accentColor="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Traffic Analysis</h3>
          <p className="text-gray-400 text-sm mt-2">Real-time traffic graph placeholder</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Threat Map</h3>
          <p className="text-gray-400 text-sm mt-2">Global threat distribution placeholder</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
