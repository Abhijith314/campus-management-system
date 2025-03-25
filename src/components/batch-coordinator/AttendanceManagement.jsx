import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({});

  // Fetch students for the selected class
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .eq('class', selectedClass);

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare attendance records
      const attendanceRecords = students.map(student => ({
        student_id: student.id,
        date: attendanceDate,
        status: attendanceStatus[student.id] || 'absent'
      }));

      // Insert attendance records
      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) throw error;

      alert('Attendance submitted successfully');
      
      // Reset form
      setAttendanceStatus({});
      setAttendanceDate('');
    } catch (error) {
      console.error('Attendance submission error:', error);
      alert('Failed to submit attendance');
    }
  };

  return (
    <div className="attendance-management">
      <h2>Attendance Management</h2>
      <form onSubmit={submitAttendance}>
        <div>
          <label>Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            <option value="CS-2022">CS-2022</option>
            <option value="IT-2022">IT-2022</option>
          </select>
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            required
          />
        </div>
        
        {students.length > 0 && (
          <div className="student-attendance-list">
            <h3>Students in {selectedClass}</h3>
            {students.map(student => (
              <div key={student.id} className="student-attendance-item">
                <span>{student.first_name} {student.last_name}</span>
                <select
                  value={attendanceStatus[student.id] || 'absent'}
                  onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            ))}
          </div>
        )}
        
        <button type="submit" disabled={!selectedClass || !attendanceDate}>
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceManagement;