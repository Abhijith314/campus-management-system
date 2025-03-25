// src/components/batch-coordinator/StudentRegistration.jsx
import React, { useState } from 'react';
import { supabase } from '../../services/supabase';

const StudentRegistration = () => {
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    class: '',
    department: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleStudentRegistration = async (e) => {
    e.preventDefault();
    try {
      // Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentData.email,
        password: studentData.password
      });

      if (authError) throw authError;

      // Insert student details into users and students tables
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: studentData.email,
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          role: 'student'
        });

      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: authData.user.id,
          class: studentData.class,
          department: studentData.department
        });

      if (userError || studentError) {
        throw userError || studentError;
      }

      alert('Student registered successfully');
      
      // Reset form
      setStudentData({
        firstName: '',
        lastName: '',
        email: '',
        class: '',
        department: '',
        password: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="student-registration">
      <h2>Student Registration</h2>
      <form onSubmit={handleStudentRegistration}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={studentData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={studentData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Class</label>
          <select
            name="class"
            value={studentData.class}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Class</option>
            <option value="CS-2022">CS-2022</option>
            <option value="IT-2022">IT-2022</option>
            <option value="ENTC-2022">ENTC-2022</option>
          </select>
        </div>
        <div>
          <label>Department</label>
          <select
            name="department"
            value={studentData.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>
        <div>
          <label>Temporary Password</label>
          <input
            type="password"
            name="password"
            value={studentData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Register Student</button>
      </form>
    </div>
  );
};

export default StudentRegistration;