import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Bus Route Guide Sysytem</h1>
      <h2>Navigate to:</h2>
      <ul>
        <li>
          <Link to="/bus-search">Bus Search</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/admin/dashboard">Admin Page</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        {/* Add more links as necessary */}
      </ul>
    </div>
  );
}

export default Home;