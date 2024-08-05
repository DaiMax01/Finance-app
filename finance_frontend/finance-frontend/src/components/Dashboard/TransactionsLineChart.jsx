import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const SalesChart = ({ transactionData }) => {
  // Extract and prepare data for the chart
  const debitsData = transactionData.debits || [];
  const creditsData = transactionData.credits || [];

  // Create arrays for the x-axis (dates) and y-axis (amounts)
  const xLabels = Array.from(new Set([...debitsData, ...creditsData].map(item => item.date))).sort();

  const debitsAmounts = xLabels.map(date => {
    const item = debitsData.find(d => d.date === date);
    return item ? item.total : 0;
  });

  const creditsAmounts = xLabels.map(date => {
    const item = creditsData.find(c => c.date === date);
    return item ? item.total : 0;
  });

  return (
    <LineChart
      height={300}
      series={[
        { curve: "linear", data: creditsAmounts, label: 'Credits' },
        { curve: "linear", data: debitsAmounts, label: 'Debits' },
      ]}
      grid={{ vertical: true, horizontal: true }}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    />
  );
};

export default SalesChart;
