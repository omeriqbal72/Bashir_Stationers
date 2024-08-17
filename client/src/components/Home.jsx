import React, { useState, useEffect } from 'react';
import '../css/home.css';
import { callTestAPI } from '../functions/product.js';

const Home = () => {
  const [message, setMessage] = useState(''); // State to hold the message from the API
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Function to call the API and update the state with the response
    const fetchMessage = async () => {
      try {
        const data = await callTestAPI(); // Call the API
        setMessage(data.message); // Update state with the message
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error loading message'); // Set error message in case of failure
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchMessage(); // Call the function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <>
      <div className="home-main">
        {loading ? (
          <span>Loading...</span> // Display a loading message while fetching data
        ) : (
          <span>{message}</span> // Display the message from the API
        )}
        <div className="home-main-up">
          <h1>Hello Sufian</h1>
        </div>
        <span>bfqqbe</span>
      </div>
    </>
  );
};

export default Home;
