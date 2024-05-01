import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [categories, setCategories] = useState([]);
  const [papers, setPapers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchPrefCat();
    fetchPrefPapers();
  }, []);

  const fetchProfile = async () => {
    let id = localStorage.getItem('token');
    try {
      const params = { id: id };
      const response = await axios.get('http://localhost:8000/api/get_user_profile/', { params });
      setUsername(response.data.username);
      setPassword(response.data.password);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const fetchPrefCat = async () => {
    let id = localStorage.getItem('token');
    try {
      const params = { id: id };
      const response = await axios.get('http://localhost:8000/api/user_pref_categories/', { params });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching user categories:', error);
    }
  };

  const fetchPrefPapers = async () => {
    let id = localStorage.getItem('token');
    try {
      const params = { id: id };
      const response = await axios.get('http://localhost:8000/api/user_pref_papers/', { params });
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching user papers:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setShowCheckboxes(true);
  };

  const handleCheckboxChange = (paperId) => {
    if (selectedPapers.includes(paperId)) {
        console.log("current selections");
        console.log(selectedPapers);
        setSelectedPapers(selectedPapers.filter(id => id !== paperId));
        console.log("new selections");
        console.log(selectedPapers);
      } else {
        setSelectedPapers([...selectedPapers, paperId]);
        console.log("new additions");
        console.log(paperId);
        console.log(selectedPapers);
      }
  };

  const handleConfirmDeletion = async () => {
    let id = localStorage.getItem('token');
    try {
    //   const params = { id: id };
      const data = { papers: selectedPapers };
      await axios.put(`http://localhost:8000/api/delete_papers/${id}/`, data);
      // Refresh the paper list after deletion
      await fetchPrefPapers();
      // Reset selectedPapers and hide checkboxes
      setSelectedPapers([]);
      setShowCheckboxes(false);
    } catch (error) {
      console.error('Error deleting papers:', error);
    }
  };

  const handleSubmit = async () => {
    let id = localStorage.getItem('token');
    const data = {
      id: id,
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      email: email
    };
    try {
      await axios.put('http://localhost:8000/api/update_user_profile/', data);
    } catch (error) {
      console.error('Error updating user information:', error);
    }
    setIsEditing(false);
  };

  return (
    <div>
      <Container className="vh-100">
        <Row className="auto-center">
          <Col xs={6}>
            {!isEditing && (<Button onClick={handleEditClick} className="mb-3">Edit Details</Button>)}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} readOnly={!isEditing} onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} readOnly={!isEditing} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" value={firstName} readOnly={!isEditing} onChange={(e) => setFirstName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" value={lastName} readOnly={!isEditing} onChange={(e) => setLastName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} readOnly={!isEditing} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              {isEditing && (
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Preferred Categories</Form.Label>
                <Form.Control type="categories" value={categories.map(obj => obj.category_name).join(', ')} readOnly={true}  />
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <h2>List of Papers</h2>
            {!showCheckboxes&& (<Button onClick={handleDeleteClick} className="mb-3">Delete Papers</Button>)}
            <div style={{ height: '400px', overflowY: 'scroll' }}>
              <ul>
                {papers.map((paper) => (
                  <li key={paper.id}>
                    {showCheckboxes && (
                      <input
                        type="checkbox"
                        checked={selectedPapers.includes(paper.id)}
                        onChange={() => handleCheckboxChange(paper.id)}
                      />
                    )}
                    <a href={paper.link} id={paper.paper_id}>{paper.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <br></br>
            {showCheckboxes && (
              <Button onClick={handleConfirmDeletion} className="mb-3">Confirm Deletion</Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserProfilePage;
