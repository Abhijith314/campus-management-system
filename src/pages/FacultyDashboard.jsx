// src/pages/FacultyDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user?.email}</span>
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Link 
          to="/faculty/assignment-management" 
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <h2 className="text-xl font-semibold">Assignment Management</h2>
          <p>Create and manage assignments</p>
        </Link>

        <Link 
          to="/faculty/marks-entry" 
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <h2 className="text-xl font-semibold">Marks Entry</h2>
          <p>Enter and update student marks</p>
        </Link>

        <Link 
          to="/faculty/attendance" 
          className="bg-purple-500 text-white p-6 rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p>Mark and manage class attendance</p>
        </Link>
      </div>
    </div>
  );
};

export default FacultyDashboard;