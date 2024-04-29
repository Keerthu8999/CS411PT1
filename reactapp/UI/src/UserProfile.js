
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for making HTTP requests
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './UserProfile.css';
const UserProfilePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Make the HTTP request to fetch user information
    axios.get('http://localhost:8000/api/get_user_profile/',{'id':1})
      .then(response => {
        setUsername(response.data.username);
        setPassword(response.data.password);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
      })
      .catch(error => {
        console.error('Error fetching user information:', error);
      });
  }, []); // Empty dependency array to run effect only once when component mounts

  return (
    <div>
      {email ? ( // Check if user information has been received
        <div>
          <h1>User Information</h1>
          <p>Username: {username}</p>
          <p>Password: {password}</p>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Email: {email}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default UserProfilePage;