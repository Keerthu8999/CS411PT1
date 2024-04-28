import React, { useState, Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    console.log(`Login page?`)

    const handleLogin = async (event) => {
        event.preventDefault();  // Prevent the form from being submitted traditionally

        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username: username,
                password: password
            });

            // Assuming the API returns the token as response.data.access
            if (response.data && response.data.token) {
                console.log(response.data)
                localStorage.setItem('token', response.data.token);  // Store the token
                localStorage.setItem('userId', JSON.parse(response.config.data).username);
                window.location.href = '/main';  // Redirect to the main app
            } else {
                setError('Failed to log in');  // Handle errors
            }
        } catch (err) {
            setError('Login error');
            console.error('Login error:', err);
        }
    };

    return (
        <Container className="vh-100">
            <Row className="auto-center">
                <Col></Col>
                <Col xs={6}>
                    <h3>PaperPilot</h3>
                    <h4>Sign in</h4>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={username} 
                            onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password} 
                            onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
