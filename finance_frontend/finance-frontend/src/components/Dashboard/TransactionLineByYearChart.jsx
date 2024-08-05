import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const SalesChart = ({ transactionData }) => {
  // Extract and prepare data for the chart
  const debitsData = transactionData.debits || [];
  const creditsData = transactionData.credits || [];

  // Define labels for each month
  const xLabels = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map month names to their numerical equivalents for comparison
  const monthMapping = {
    January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
    July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
  };

  // Prepare data for the chart
  const debitsAmounts = xLabels.map(month => {
    const item = debitsData.find(d => monthMapping[month] === d.date.split('-')[1]);
    return item ? item.total : 0;
  });

  const creditsAmounts = xLabels.map(month => {
    const item = creditsData.find(c => monthMapping[month] === c.date.split('-')[1]);
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
