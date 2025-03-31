// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import StudentSidebar from '../components/student/StudentSidebar';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (user) {
        // Fetch student profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch attendance
        const { data: attendanceRecords, error: attendanceError } = await supabase
          .from('attendance')
          .select('*, subjects(name)')
          .eq('student_id', user.id);

        // Fetch marks
        const { data: marksRecords, error: marksError } = await supabase
          .from('internal_marks')
          .select('*, subjects(name)')
          .eq('student_id', user.id);

        if (profileData) setStudentData(profileData);
        if (attendanceRecords) setAttendanceData(attendanceRecords);
        if (marksRecords) setMarksData(marksRecords);
      }
    };

    fetchStudentData();
  }, [user]);

  return (
    <div className="flex">
      <StudentSidebar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        {/* <div>
          <span className="mr-4">Welcome, {user?.email}</span>
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div> */}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-grey shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          {studentData ? (
            <div>
              <p><strong>Name:</strong> {studentData.full_name}</p>
              <p><strong>Email:</strong> {studentData.email}</p>
              {/* Add more profile details */}
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {/* Attendance Section */}
        <div className="bg-grey shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          {attendanceData.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.subjects.name}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No attendance records found.</p>
          )}
        </div>

        {/* Marks Section */}
        <div className="bg-grey shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Internal Marks</h2>
          {marksData.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assessment</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.subjects.name}</td>
                    <td>{record.assessment_type}</td>
                    <td>{record.marks} / {record.max_marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No marks records found.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentDashboard;