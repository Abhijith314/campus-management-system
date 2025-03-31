// src/components/faculty/MarksEntry.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import FacultySidebar from './FacultySidebar';

const MarksEntry = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  // Fetch faculty's assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('faculty_id', user.id);

        if (error) {
          console.error('Error fetching assignments:', error);
        } else {
          setAssignments(data);
        }
      }
    };

    fetchAssignments();
  }, []);

  // Fetch students when an assignment is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedAssignment) return;

      // Get students for the subject of the selected assignment
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .eq('subject', assignments.find(a => a.id === selectedAssignment).subject);

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data);
      }
    };

    fetchStudents();
  }, [selectedAssignment, assignments]);

  const handleMarkChange = (studentId, mark) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: mark
    }));
  };

  const submitMarks = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare marks records
      const marksRecords = students.map(student => ({
        student_id: student.id,
        assignment_id: selectedAssignment,
        marks: marks[student.id] || 0
      }));

      // Insert or update marks
      const { error } = await supabase
        .from('assignment_marks')
        .upsert(marksRecords, {
          onConflict: 'student_id,assignment_id'
        });

      if (error) throw error;

      alert('Marks submitted successfully');
      
      // Reset form
      setMarks({});
      setSelectedAssignment('');
    } catch (error) {
      console.error('Marks submission error:', error);
      alert('Failed to submit marks');
    }
  };

  return (
    <div className="flex">
      <FacultySidebar />
    <div className="marks-entry">
      <h2>Assignment Marks Entry</h2>
      
      <form onSubmit={submitMarks}>
        <div>
          <label>Select Assignment</label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            required
          >
            <option value="">Select Assignment</option>
            {assignments.map(assignment => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title} - {assignment.subject}
              </option>
            ))}
          </select>
        </div>
        
        {students.length > 0 && (
          <div className="student-marks-list">
            <h3>Enter Marks for Students</h3>
            {students.map(student => (
              <div key={student.id} className="student-marks-item">
                <span>{student.first_name} {student.last_name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marks[student.id] || ''}
                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                  placeholder="Marks"
                />
              </div>
            ))}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!selectedAssignment || students.length === 0}
        >
          Submit Marks
        </button>
      </form>
    </div>
    </div>
  );
};

export default MarksEntry;