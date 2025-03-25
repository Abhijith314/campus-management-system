import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const AssignmentManagement = () => {
  const [assignment, setAssignment] = useState({
    subject: '',
    title: '',
    description: '',
    dueDate: '',
    maxMarks: ''
  });

  const [assignments, setAssignments] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch current user and their assignments
  useEffect(() => {
    const fetchUserAndAssignments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Fetch assignments for this faculty
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

    fetchUserAndAssignments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          faculty_id: userId,
          subject: assignment.subject,
          title: assignment.title,
          description: assignment.description,
          due_date: assignment.dueDate,
          max_marks: assignment.maxMarks
        });

      if (error) throw error;

      // Refresh assignments list
      const { data: updatedAssignments } = await supabase
        .from('assignments')
        .select('*')
        .eq('faculty_id', userId);

      setAssignments(updatedAssignments);

      // Reset form
      setAssignment({
        subject: '',
        title: '',
        description: '',
        dueDate: '',
        maxMarks: ''
      });

      alert('Assignment created successfully');
    } catch (error) {
      console.error('Assignment creation error:', error);
      alert('Failed to create assignment');
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      // Remove assignment from local state
      setAssignments(prev => 
        prev.filter(assignment => assignment.id !== assignmentId)
      );

      alert('Assignment deleted successfully');
    } catch (error) {
      console.error('Assignment deletion error:', error);
      alert('Failed to delete assignment');
    }
  };

  return (
    <div className="assignment-management">
      <h2>Assignment Management</h2>
      
      <form onSubmit={createAssignment}>
        <div>
          <label>Subject</label>
          <select
            name="subject"
            value={assignment.subject}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
          </select>
        </div>
        
        <div>
          <label>Assignment Title</label>
          <input
            type="text"
            name="title"
            value={assignment.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={assignment.description}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={assignment.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Max Marks</label>
          <input
            type="number"
            name="maxMarks"
            value={assignment.maxMarks}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit">Create Assignment</button>
      </form>

      <div className="assignments-list">
        <h3>Your Assignments</h3>
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-item">
            <h4>{assignment.title}</h4>
            <p>Subject: {assignment.subject}</p>
            <p>Due Date: {assignment.due_date}</p>
            <p>Max Marks: {assignment.max_marks}</p>
            <button onClick={() => deleteAssignment(assignment.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentManagement;