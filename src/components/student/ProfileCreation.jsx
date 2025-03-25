// src/components/student/ProfileCreation.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const ProfileCreation = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    contact: '',
    address: '',
    department: '',
    class: ''
  });

  const [userId, setUserId] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Fetch existing profile data
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfileData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            dateOfBirth: data.date_of_birth || '',
            email: user.email || '',
            contact: data.contact || '',
            address: data.address || '',
            department: data.department || '',
            class: data.class || ''
          });
        }
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    
    try {
      // Update user profile
      const { error } = await supabase
        .from('students')
        .upsert({
          id: userId,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          date_of_birth: profileData.dateOfBirth,
          contact: profileData.contact,
          address: profileData.address,
          department: profileData.department,
          class: profileData.class
        }, { onConflict: 'id' });

      if (error) throw error;

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="profile-creation">
      <h2>Create/Update Student Profile</h2>
      
      <form onSubmit={submitProfile}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={profileData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            disabled
          />
        </div>
        
        <div>
          <label>Contact Number</label>
          <input
            type="tel"
            name="contact"
            value={profileData.contact}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Address</label>
          <textarea
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Department</label>
          <select
            name="department"
            value={profileData.department}
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
          <label>Class</label>
          <select
            name="class"
            value={profileData.class}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Class</option>
            <option value="CS-2022">CS-2022</option>
            <option value="IT-2022">IT-2022</option>
            <option value="ENTC-2022">ENTC-2022</option>
          </select>
        </div>
        
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileCreation;