import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const styles = {
  // Add your styles here
};

const ListItem = ({ item, addToFavorites }) => {
    console.log(item)
  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.main}>{item.submitter}</p>
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
  const [papers, setPapers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_all_papers/');
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
        {/* Your header content */}
      </header>
      <main>
        {papers.map((item) => (
          <ListItem key={item.paper_id} item={item} addToFavorites={addToFavorites} />
        ))}
      </main>
      <footer>
        {/* Your footer content */}
      </footer>
    </div>
  );
};

export default Dashboard;
