import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BusSearch from './components/BusSearch';
import UserSearch from './components/UserSearch';
import AdminPage from './AdminPage';
import Login from './LoginPage';
import Home from './HomePage';
import AdminLogin from './AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/bus-search">Bus Search</Link>
            </li>
            <li>
              <Link to="/user-search">User Search</Link>
            </li>
            <li>
              <Link to="/admin/dashboard">Admin Page</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bus-search" element={<BusSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-search" element={<UserSearch />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;