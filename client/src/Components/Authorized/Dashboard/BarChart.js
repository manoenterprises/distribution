import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data }) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (!data || !data.length) return;

    const labels = data.map(item => item.name);
    const values = data.map(item => item.stock);

    const ctx = document.getElementById('pie-chart');

    if (chart) chart.destroy();

    setChart(new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#8C9EFF',
            '#4DB6AC',
            '#FF8A80',
            '#81C784'
          ],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            fontColor: '#333',
            fontSize: 14
          }
        }
      }
    }));

  }, [data]);

  return (
    <canvas id="pie-chart"></canvas>
  );
}

export default PieChart;
