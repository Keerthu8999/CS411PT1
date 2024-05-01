import React, { useEffect, useState } from 'react';
import {Spinner, Container, Row, Col} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

const getDataFromToken = async (token) => {
    const response = await axios.get(`http://localhost:8000/api/data/user/${token}`);
    console.log(response.data.data);

    return response.data.data;
}

function DataInsights() {
    const token = localStorage.getItem('token');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            getDataFromToken(token).then(setData);
            setLoading(false);
        }else {
            setError("Missing token value");
        }
    }, [token]);

    if (loading){
        return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
        );
    }

    if (error){
        return <p>Error: {error}</p>
    }

    return (
        <Container>
            Top Authors and Keywords based on favourites
            <Accordion>
                {data.map((i, idx) => (
                    <Accordion.Item eventKey={idx} key={idx}>
                        <Accordion.Header>{i.category_description}</Accordion.Header>
                        <Accordion.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <ListGroup>
                                            Top Authors with paper count
                                            {i.top_authors.map((i1, idx1) => (
                                                <ListGroup.Item key={idx1}>{i1.author_name}: {i1.paper_count}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                    <Col>
                                        <ListGroup>
                                            Top keywords with paper count
                                            {i.top_keywords.map((i2, idx2) => (
                                                <ListGroup.Item key={idx2}>{i2.keyword}: {i2.occurrence_count}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Container>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    );
};

export default DataInsights;