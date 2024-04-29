import React, { useEffect, useState } from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

const getDataFromToken = async (token) => {
    const response = await axios.get(`http://localhost:8000/api/data/user/${token}`);
    console.log(response.data.data);

    return response.data.data;
}

function DataViz() {
    const token = localStorage.getItem('token');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (token) {
            getDataFromToken(token).then(setData);
        }
    }, [token]);

    return (
        <Accordion>
            {data.map((i, idx) => (
                <Accordion.Item eventKey={idx} key={idx}>
                    <Accordion.Header>{i.category_description}</Accordion.Header>
                    <Accordion.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <ListGroup>
                                        {i.top_authors.map((i1, idx1) => (
                                            <ListGroup.Item key={idx1}>{i1.author_name}: {i1.paper_count}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Col>
                                <Col>
                                    <ListGroup>
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
    );


/*    return (
        <Accordion>
            {data.map(i, idx =>{
                <Accordion.Item eventKey={idx}>
                    <Accordion.Header>{i.category_description}</Accordion.Header>
                    <Accordion.Body>
                        <Container>
                            <Row>
                                <Col>
                                <ListGroup>
                                    {i.top_authors.map(i1=>{
                                        <ListGroup.Item>{i1.author_name}: {i1.paper_count}</ListGroup.Item>
                                    })}
                                </ListGroup>
                                </Col>
                                <Col>
                                <ListGroup>
                                    {i.top_keywords.map(i2=>{
                                        <ListGroup.Item>{i2.keyword}: {i2.occurence_count}</ListGroup.Item>
                                    })}
                                </ListGroup>
                                </Col>
                            </Row>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>
            })}
        </Accordion>
    )*/
};

export default DataViz;