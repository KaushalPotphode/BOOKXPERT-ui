import React, { useEffect, useRef } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, Title, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, Title, PointElement);

function Chart({ employees }) {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Ensure chart instance is destroyed
      }
    };
  }, []);

  const designations = [...new Set(employees.map(emp => emp.designation))];
  const salaryData = designations.map(designation => {
    return employees
      .filter(emp => emp.designation === designation)
      .reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
  });

  const chartData = {
    labels: designations,
    datasets: [
      {
        label: 'Salary by Designation',
        data: salaryData,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h5>Pie Chart</h5>
      <Pie data={chartData} ref={chartRef} />
      <h5 className="mt-4">Bar Chart</h5>
      <Bar data={chartData} ref={chartRef} />
      <h5 className="mt-4">Line Chart</h5>
      <Line data={chartData} ref={chartRef} />
    </div>
  );
}

export default Chart;
