import React, { useEffect, useState } from 'react';
import {Spinner, Container} from 'react-bootstrap';
import axios from 'axios';
import {PieChart as DCPieChart, BarChart as DCBarChart, LineChart as DCLineChart} from 'dc';
import crossfilter from 'crossfilter2';
import * as d3 from 'd3';

const getInteractiveDataFromToken = async (token) => {
    const response = await axios.get(`http://localhost:8000/api/data/interactive/user/${token}`);
    console.log(response.data.data);

    return response.data.data;
}

function DataInteractive() {
    const token = localStorage.getItem('token');
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            getInteractiveDataFromToken(token)
                .then(fetchedData => {
                    setData(fetchedData);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Error fetching data: " + err.message);
                });
        } else {
            setError("Missing token value");
        }
    }, [token]);

    useEffect(() => {
        if (data.length > 0) {
            setupCharts(data);
        }
    }, [data]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div id="pie-chart-container" />
            <div id="bar-chart-container" />
        </div>
    );
}

function setupCharts(data) {
    const ndx = crossfilter(data);

    const categoryDimension = ndx.dimension(d => d.category_name);
    const categoryGroup = categoryDimension.group().reduceCount();

    const yearDimension = ndx.dimension(d => d.year);
    const barGroup = yearDimension.group().reduceSum(d => d.paper_count);

    const pieChart = new DCPieChart("#pie-chart-container");
    pieChart.dimension(categoryDimension).group(categoryGroup).radius(150).innerRadius(50);

    const xScale = d3.scaleTime().domain([
        new Date(yearDimension.bottom(1)[0].year, 0, 1),
        new Date(yearDimension.top(1)[0].year, 11, 31)
    ]);

    const barChart = new DCBarChart("#bar-chart-container");
    barChart.dimension(yearDimension).group(barGroup).barPadding(0.2).x(xScale);

    pieChart.render();
    barChart.render();
}

export default DataInteractive;
