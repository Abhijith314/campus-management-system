// src/components/student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch student profile
        const { data: profileData, error: profileError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch assignments for student's class/department
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select('*')
          .eq('department', profileData.department);

        // Fetch attendance
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('*')
          .eq('student_id', user.id);

        // Fetch marks
        const { data: marksData, error: marksError } = await supabase
          .from('assignment_marks')
          .select('*, assignments(*)')
          .eq('student_id', user.id);

        if (profileError || assignmentError || attendanceError || marksError) {
          console.error('Error fetching data:', 
            profileError || assignmentError || attendanceError || marksError
          );
          return;
        }

        setStudentData(profileData);
        setAssignments(assignmentData);
        setAttendance(attendanceData);
        setMarks(marksData);
      }
    };

    fetchStudentData();
  }, []);

  if (!studentData) return <div>Loading...</div>;

  return (
    <div className="student-dashboard">
      <h1>Welcome, {studentData.first_name} {studentData.last_name}</h1>
      
      <section className="student-info">
        <h2>Student Information</h2>
        <p>Department: {studentData.department}</p>
        <p>Class: {studentData.class}</p>
      </section>
      
      <section className="assignments">
        <h2>Assignments</h2>
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-item">
            <h3>{assignment.title}</h3>
            <p>Subject: {assignment.subject}</p>
            <p>Due Date: {assignment.due_date}</p>
          </div>
        ))}
      </section>
      
      <section className="attendance">
        <h2>Attendance</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="marks">
        <h2>Assignment Marks</h2>
        <table>
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {marks.map(mark => (
              <tr key={mark.id}>
                <td>{mark.assignments.title}</td>
                <td>{mark.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default StudentDashboard;