// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleSignup = async (event) => {
        event.preventDefault();

        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/signup/', {
                username: username,
                password: password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.username);
                window.location.href = '/main/dashboard';
            } else {
                setError('Failed to sign up');
            }
        } catch (err) {
            setError('Signup error');
            console.error('Signup error:', err);
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordsMatch(event.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordsMatch(event.target.value === password);
    };

    return (
        <Container className="vh-100">
            <Row className="auto-center">
                <Col></Col>
                <Col xs={6}>
                    <h3>PaperPilot</h3>
                    <h4>Sign up</h4>
                    <Form onSubmit={handleSignup}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={username} 
                                onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password} 
                                onChange={handlePasswordChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} 
                                onChange={handleConfirmPasswordChange} />
                            {!passwordsMatch && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Sign up
                        </Button>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
};

export default SignupPage;