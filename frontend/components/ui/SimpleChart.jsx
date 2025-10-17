import React from 'react';

const SimpleChart = ({ data, type = 'bar', title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));

  const renderBarChart = () => (
    <div className="space-y-2">
      {data.map((item, index) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              >
                <span className="text-xs text-white font-medium">
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="relative w-full h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
            const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
            const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            cumulativePercentage += percentage;

            return (
              <path
                key={index}
                d={pathData}
                fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                stroke="white"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-700">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = maxValue > minValue ? 100 - ((item.value - minValue) / (maxValue - minValue)) * 100 : 50;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative w-full h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={points}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = maxValue > minValue ? 100 - ((item.value - minValue) / (maxValue - minValue)) * 100 : 50;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#3B82F6"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div>{item.label}</div>
              <div className="font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }}>
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </div>
      {type === 'pie' && (
        <div className="mt-4 space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleChart;
