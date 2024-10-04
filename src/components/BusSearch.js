import React, { useState, useEffect } from 'react';

function BusSearch() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [busRoutes, setBusRoutes] = useState([]);
  const [error, setError] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const fetchSourceSuggestions = async (q) => {
    if (!q) {
      setSourceSuggestions([]);
      return;
    }
    const token = localStorage.getItem('token');
    if(!token){
      return setError('token expired, please login');
    }

    try {
      const response = await fetch('http://localhost:8000/api/bus/suggest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q }),
      });

      if (!response.ok) {
        setError('response is not ok while fetching source suggestions.');
        return;
      }

      const data = await response.json();
      setSourceSuggestions(data);
    } catch (err) {
      setError('An ERROR occurred while fetching source suggestions.');
    }
  };

  const fetchDestinationSuggestions = async (q) => {
    if (!q) {
      setDestinationSuggestions([]);
      return;
    }
    const token = localStorage.getItem('token');
    if(!token){
      return setError('token expired, please login');
    }

    try {
      const response = await fetch('http://localhost:8000/api/bus/suggest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q }),
      });

      if (!response.ok) {
        setError('response is not ok while fetching destination suggestions.');
        return;
      }

      const data = await response.json();
      setDestinationSuggestions(data);
    } catch (err) {
      setError('An ERROR occurred while fetching destination suggestions.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setBusRoutes([]);

    const token = localStorage.getItem('token');
    if(!token){
      return setError('token expired, please login');
    }

    try {
      const response = await fetch('http://localhost:8000/api/bus/find', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, destination }),
      });

      if (!response.ok) {
        setError('An error occurred while fetching bus routes.');
        return;
      }

      const data = await response.json();
      if (data.length === 0) {
        setError('No bus routes found for the given source and destination.');
      } else {
        setBusRoutes(data);
      }
    } catch (err) {
      setError('An error occurred while fetching bus routes.');
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSourceSuggestions(source);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [source]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDestinationSuggestions(destination);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [destination]);

  return (
    <div>
      <h1>Find Buses by Source and Destination</h1>
      <form onSubmit={handleSearch}>
        <div>
          <label>Source:</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source stop"
            required
          />
          {sourceSuggestions.length > 0 && (
            <ul>
              {sourceSuggestions.map((suggestion) => (
                <li key={suggestion} onClick={() => setSource(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination stop"
            required
          />
          {destinationSuggestions.length > 0 && (
            <ul>
              {destinationSuggestions.map((suggestion) => (
                <li key={suggestion} onClick={() => setDestination(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Find Buses</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Available Buses</h2>
      <ul>
        {busRoutes.map((route) => (
          <li key={route._id}>
            <h3>Route Number: {route.routeNu}</h3>
            <p>Stops: {route.stops.join(', ')}</p>
            {route.busImg && <img src={route.busImg} alt="Bus" style={{ width: '200px' }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BusSearch;