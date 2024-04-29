import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Form, FormControl, Button} from 'react-bootstrap'

const styles = {
    card: {
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        padding: '20px',
        margin: '10px',
        maxWidth: '100%',
        minHeight: '20%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: '1px solid #ddd'
    },
    link: {
        boxShadow: '0 0.5px 0.5px 0 rgba(0, 0, 0, 0.1)',
        margin: '10px',
    },
    button:{
        margin: '10px',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: '0.65em'
    }
};

const astyle = {
    display : "inline",
    boxShadow: '10px 5px 5px white',
    border: '2px solid black',
    margin: '5px',
    padding: '0.5em'
};


const ListItem = ({ item, addToFavorites }) => {
  console.log(item)
  console.log(item.category)
  let str = item.category;
  const arr = str ? str.split(';').map(item => item.trim()) : [];
  console.log(arr);
  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.main}>{item.names}</p>
      </div>
      <div style={styles.meta}>
          {arr.map((category, index) => (
            <p key={index} style = {astyle}>{category}</p>
          ))}
          <span style={styles.date}>{item.update_date}</span>
      
      
        <button style={styles.button} onClick={() => addToFavorites(item.paper_id)}>
          Add to Favorites
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
    const [papers, setPapers] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage ] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [currentFilter, setCurrentFilter] = useState('general');
  
    const handleSearchInput = (event) => {
      setSearchText(event.target.value);
    };

  
    const fetchData = async (currentPage, value, text) => {
      setCurrentFilter(value);
      try {
        console.log(value);
        console.log(currentPage);
        const params = { val: value, text: text, currentPage: currentPage};
        const response = await axios.get('http://localhost:8000/api/get_all_papers/', {params});
        setPapers(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      fetchData(currentPage, currentFilter, searchText);
    }, [currentPage, currentFilter, searchText]);

  const addToFavorites = async (id) => {
    let userId = localStorage.getItem('userId');
    let dataObject = { user_id: userId, paper_id: id };
    console.log(dataObject)
    try {
      const response = await axios.post('http://localhost:8000/api/post_upp/', dataObject);
      console.log(response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div>
      <header>
      <Form inline>
            <FormControl
              onChange={handleSearchInput}
              value={searchText}
              type="text"
              placeholder="Enter"
              className="mr-sm-2"
            />
            </Form>
            <NavDropdown title="Search" id="basic-nav-dropdown">
              <NavDropdown.Item href="#keywordsearch" onClick={() => fetchData(currentPage, 'keyword', searchText)}>Keyword</NavDropdown.Item>
              <NavDropdown.Item href="#journalsearch" onClick={() => fetchData(currentPage, 'journal', searchText)}>Journal</NavDropdown.Item>
              <NavDropdown.Item href="#authorsearch"  onClick={() => fetchData(currentPage, 'author', searchText)}>Author</NavDropdown.Item>
              <NavDropdown.Item href="#categorysearch" onClick={() => fetchData(currentPage, 'category', searchText)}>Category</NavDropdown.Item>
            </NavDropdown> 
      </header>
      <main>
        {papers.map((item) => (
          <ListItem key={item.paper_id} item={item} addToFavorites={addToFavorites} />
        ))}

      </main>
      <footer>
        <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </footer>
    </div>
  );
};

export default Dashboard;
