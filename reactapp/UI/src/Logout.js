import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
        <Button variant="outline-info" onClick={handleLogout}>Logout</Button>{' '}
        </>
    );
};

export default LogoutButton;
