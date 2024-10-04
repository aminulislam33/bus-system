import React, { useState } from 'react';

function UserSearch() {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setUserData(null);

    try {
      const response = await fetch('http://localhost:8000/api/user/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 404) {
        setError('No user found with the given email.');
        return;
      }

      if (!response.ok) {
        setError('An error occurred while fetching user data. response not ok');
        return;
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError('An error occurred while fetching user data.');
    }
  };

  return (
    <div>
      <h1>Search User by Email</h1>
      <form onSubmit={handleSearch}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <button type="submit">Find User</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userData && (
        <div>
          <h3>User Details:</h3>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>
      )}
    </div>
  );
}

export default UserSearch;