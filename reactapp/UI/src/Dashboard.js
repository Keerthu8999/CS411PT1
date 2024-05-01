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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      border: '1px solid #ddd',
      maxWidth: '100%',
      width: '2048px'
  },
  content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
  },
  title: {
      marginBottom: '5px',
      fontWeight: 'bold',
      fontSize: '1.5em',
  },
  main: {
      marginBottom: '5px',
      fontSize: '1em',
  },
  categories: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: '5px'
  },
  astyle: {
      boxShadow: '0 5px 5px rgba(0, 0, 0, 0.1)',
      border: '2px solid black',
      margin: '5px',
      padding: '0.5em',
      alignItems: 'center'
  },
  date: {
      marginBottom: '5px',
  },
  link: {
      textDecoration: 'none',
      color: '#1a0dab',
      fontWeight: '500',
  },
  button: {
      padding: '10px 20px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1em',
      borderRadius: '5px',
      marginLeft: '10px',
      marginBottom: '0.5em'
  },
  rightAlign: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
  }
};


const buttons = {
  margin: '10px',
  justifyContent:'center',
  alignItems: 'center',
  padding: '0.65em'
};

const header = {
  display: 'flex',
  justifyContent: 'flexStart',
  marginTop: '1em'
}

const searchBar = {
  marginLeft: '0.8em'
}


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
              <div style={styles.categories}>
                  {arr.map((category, index) => (
                      <p key={index} style={styles.astyle}>{category}</p>
                  ))}
              </div>
              <span style={styles.date}>Last Updated : {item.update_date.split('T')[0]}</span>
          </div>
          <div style={styles.rightAlign}>
              {/* <a href={item.link} style={styles.link}>Link to paper</a>
              <button style={styles.button} onClick={item.link}>
                  View Paper
              </button> */}
              <Link to={item.link} className="btn btn-primary" style={styles.button}>View Paper</Link>
              {!item.is_fav && <button style={styles.button} onClick={() => addToFavorites(item.paper_id)}>
                  Add to Favorites
              </button>}
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
        console.log(localStorage.getItem("userId"));
        const params = { val: value, text: text, currentPage: currentPage, uname: localStorage.getItem("token")};
        const response = await axios.get('http://localhost:8000/api/get_all_papers/', {params});
        setPapers(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      fetchData(currentPage, currentFilter, searchText);
    }, [currentPage, currentFilter]);

  const addToFavorites = async (id) => {
    let uToken = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    let dataObject = { user_id: userId, paper_id: id };
    console.log(dataObject)
    try {
      const response = await axios.post('http://localhost:8000/api/post_upp/', dataObject);
      console.log(response.data);
      alert("Success!");
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div>
      <header style={header}>
      <Form inline>
            <FormControl
              onChange={handleSearchInput}
              value={searchText}
              type="text"
              placeholder="Enter"
              className="mr-sm-2"
            />
            </Form>
            <NavDropdown title="Search" id="basic-nav-dropdown" style={searchBar}>
              <NavDropdown.Item href="#keywordsearch" onClick={() => fetchData(1, 'keyword', searchText)}>Keyword</NavDropdown.Item>
              {/* <NavDropdown.Item href="#journalsearch" onClick={() => fetchData(1, 'journal', searchText)}>Journal</NavDropdown.Item> */}
              <NavDropdown.Item href="#authorsearch"  onClick={() => fetchData(1, 'author', searchText)}>Author</NavDropdown.Item>
              <NavDropdown.Item href="#categorysearch" onClick={() => fetchData(1, 'category', searchText)}>Category</NavDropdown.Item>
            </NavDropdown> 
      </header>
      <main>
        {papers.map((item) => (
          <ListItem key={item.paper_id} item={item} addToFavorites={addToFavorites} />
        ))}

      </main>
      <footer>
        <button onClick={() => setCurrentPage(currentPage - 1)} style = {buttons}>Previous</button>
        <button onClick={() => setCurrentPage(currentPage + 1)} style = {buttons}>Next</button>
      </footer>
    </div>
  );
};

export default Dashboard;
