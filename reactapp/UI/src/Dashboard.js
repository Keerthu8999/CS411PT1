import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

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
        alignItems: 'flex-end'
    }
};

const ListItem = ({ item, addToFavorites }) => {
    console.log(item)
  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.main}>{item.names}</p>
      </div>
      <div style={styles.meta}>
          <Link to={``} style={styles.link}>
            {item.category}
          </Link>
          <span style={styles.date}>{item.update_date}</span>
        </div>
      <div style={styles.actions}>
        <button style={styles.button} onClick={() => addToFavorites(item.paper_id)}>
          Add to Favorites
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  let userId = localStorage.getItem('userId');
  let dataObject = { user_id: userId };
  const [papers, setPapers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_all_papers/', dataObject);
        setPapers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const addToFavorites = async (id) => {
    let userId = localStorage.getItem('userId');
    let dataObject = { user_id: userId, paper_id: id };

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
      </header>
      <main>
        {papers.map((item) => (
          <ListItem key={item.paper_id} item={item} addToFavorites={addToFavorites} />
        ))}
      </main>
      <footer>
      </footer>
    </div>
  );
};

export default Dashboard;
