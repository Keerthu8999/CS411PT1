import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/');
        // Process data for chart
        const data = {
          labels: response.data.map(d => d.YearUpdated),
          datasets: [{
            label: 'Total Papers',
            data: response.data.map(d => d.TotalPapers),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }],
        };
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Paper Statistics by Year</h1>
      <Bar data={chartData} options={{ 
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Computer Science Papers Published by Year',
          },
        },
      }} />
    </div>
  );
}

export default App;
