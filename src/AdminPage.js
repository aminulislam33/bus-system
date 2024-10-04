import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  

function AdminPage() {
  const [busRoutes, setBusRoutes] = useState([]);
  const [routeNu, setRouteNu] = useState('');
  const [stops, setStops] = useState('');
  const [busImg, setBusImg] = useState('');
  const [editingRouteNu, setEditingRouteNu] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchBusRoutes();
  }, []);

  const fetchBusRoutes = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/bus', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setBusRoutes(data);
    } catch (err) {
      console.error('Failed to fetch bus routes:', err);
      setError('Failed to fetch bus routes');
    }
  };

  const handleAddOrUpdateBusRoute = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const stopsArray = stops.split(',').map(stop => stop.trim());
    const token = localStorage.getItem('token');

    try {
      if (editingRouteNu) {
        const response = await fetch(`http://localhost:8000/api/bus/update/${editingRouteNu}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newRouteNu: routeNu || undefined,
            stops: stopsArray,
            busImg: busImg || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update bus route');
        }

        setSuccess('Bus route updated successfully');
      } else {
        const response = await fetch('http://localhost:8000/api/bus/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            routeNu,
            stops: stopsArray,
            busImg,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create bus route');
        }

        setSuccess('Bus route created successfully');
      }

      setRouteNu('');
      setStops('');
      setBusImg('');
      setEditingRouteNu(null);
      fetchBusRoutes();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEdit = (route) => {
    setRouteNu(route.routeNu);
    setStops(route.stops.join(', '));
    setBusImg(route.busImg);
    setEditingRouteNu(route.routeNu);
  };

  const handleDelete = async (routeNu) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8000/api/bus/delete/${routeNu}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete bus route');
      }

      setSuccess('Bus route deleted successfully');
      fetchBusRoutes();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  
    navigate('/admin/login');
  };

  return (
    <div>
      <h1>Admin Page - Manage Bus Routes</h1>
      <button onClick={handleLogout}>Logout</button>  {/* Logout button */}

      <form onSubmit={handleAddOrUpdateBusRoute}>
        <div>
          <label>Route Number:</label>
          <input
            type="text"
            value={routeNu}
            onChange={(e) => setRouteNu(e.target.value)}
            placeholder="Enter route number"
            required
          />
        </div>
        <div>
          <label>Stops (comma-separated):</label>
          <input
            type="text"
            value={stops}
            onChange={(e) => setStops(e.target.value)}
            placeholder="Enter stops"
            required
          />
        </div>
        <div>
          <label>Bus Image URL:</label>
          <input
            type="text"
            value={busImg}
            onChange={(e) => setBusImg(e.target.value)}
            placeholder="Enter bus image URL"
          />
        </div>
        <button type="submit">{editingRouteNu ? 'Update Bus Route' : 'Add Bus Route'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h2>Existing Bus Routes</h2>
      <ul>
        {busRoutes.map((route) => (
          <li key={route._id}>
            <h3>Route Number: {route.routeNu}</h3>
            <p>Stops: {route.stops.join(', ')}</p>
            {route.busImg && <img src={route.busImg} alt="Bus" style={{ width: '200px' }} />}
            <button onClick={() => handleEdit(route)}>Edit</button>
            <button onClick={() => handleDelete(route.routeNu)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;