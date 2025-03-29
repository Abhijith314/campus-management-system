// src/pages/FacultyDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import FacultySidebar from "../components/faculty/FacultySidebar";
import { useAuth } from "../context/AuthContext";

const FacultyDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex">
      <FacultySidebar />
      <div className="flex-1 p-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
          <div>
            <span className="mr-4">Welcome, {user?.email}</span>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 text-white gap-5 mt-5">
          <Link
            to="/faculty/classes"
            className="p-5 bg-yellow-500 text-white rounded"
          >
            Manage Classes
          </Link>
          <Link
            to="/faculty/marks"
            className="p-5 bg-yellow-500 text-white rounded"
          >
            Manage Marks
          </Link>
          <Link
            to="/faculty/assignment"
            className="p-5 bg-yellow-500 text-white rounded"
          >
            Manage Assignments
          </Link>
          <Link
            to="/faculty/students"
            className="p-5 bg-yellow-500 text-white rounded"
          >
            View Students
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
