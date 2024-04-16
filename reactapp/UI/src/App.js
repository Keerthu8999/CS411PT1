import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [formData, setForm] = useState({ fname: '', lname: '', email: '', pass: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(fd => ({
      ...fd,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Your name is: ${formData.fname} ${formData.lname} Email is: ${formData.email}`);
    try {
      const response = await axios.post('http://localhost:8000/api/post_data/', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/');
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

    fetchData();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label> Enter First Name:
          <input type="text" name="fname" value={formData.fname} onChange={handleInputChange} />
        </label>
        <br/>
        <label> Enter Last Name:
          <input type="text" name="lname" value={formData.lname} onChange={handleInputChange} />
        </label>
        <br/>
        <label> Enter Email:
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </label>
        <br/>
        <label> Enter Password:
          <input type="password" name="pass" value={formData.pass} onChange={handleInputChange} />
        </label>
        <br/>
        <input type="submit" value="Submit" />
      </form>
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
