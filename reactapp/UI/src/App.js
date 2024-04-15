import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [authors, setAuthors] = useState([]); // State to hold author data

  useEffect(() => {
    // Function to fetch author data from the Django backend
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/'); // Adjust the URL based on your setup
        setAuthors(response.data); // Set author data to state
      } catch (error) {
        console.error('Error fetching author data:', error);
      }
    };

    fetchAuthors(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Authors</h1>
      <ul>
        {authors.map((author) => (
          <li key={author.author_id}>
            {author.name} - {author.email} ({author.organization})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
