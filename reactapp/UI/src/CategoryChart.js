import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryChart = ({ selectedCategory }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/papers/count?category=${selectedCategory}`); 
                const papers = response.data;
                console.log(`Paper counts:`);
                console.log(papers);

                const years = papers.map(p => p.YearUpdated);
                const counts = papers.map(p => p.TotalPapers);

                const chartData = {
                    labels: years, 
                    datasets: [
                        {
                            label: `Papers published per year in ${selectedCategory}`,
                            data: counts, 
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        }
                    ]
                };

                setData(chartData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (selectedCategory) fetchCategoryData();  
    }, [selectedCategory]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <Bar data={data} />
        </div>
    );
};

export default CategoryChart;
