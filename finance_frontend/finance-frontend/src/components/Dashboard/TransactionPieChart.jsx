import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const PieActiveArc = ({ chartData }) => {
  // Transform the data to the format required by the PieChart
  const formattedData = chartData.map(item => ({
    label: item.transaction_category__description,
    value: item.total_income,
  }));

  return (
    <PieChart
      series={[
        {
          data: formattedData,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={300}
    />
  );
};

export default PieActiveArc;