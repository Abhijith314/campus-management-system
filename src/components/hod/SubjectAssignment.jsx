// src/components/hod/SubjectAssignment.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { ROLES } from '../../context/AuthContext';

const SubjectAssignment = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: '',
    class_id: '',
    faculty_id: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchFaculties();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*, classes(name), users!subjects_faculty_id_fkey(full_name, email)');

    if (error) {
      setError(error.message);
    } else {
      setSubjects(data);
    }
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*');

    if (error) {
      setError(error.message);
    } else {
      setClasses(data);
    }
  };

  const fetchFaculties = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', ROLES.FACULTY);

    if (error) {
      setError(error.message);
    } else {
      setFaculties(data);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name: newSubject.name,
          class_id: newSubject.class_id,
          faculty_id: newSubject.faculty_id || null
        });

      if (error) throw error;

      // Reset form and refresh subjects
      setNewSubject({
        name: '',
        class_id: '',
        faculty_id: ''
      });
      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateFaculty = async (subjectId, facultyId) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update({ faculty_id: facultyId })
        .eq('id', subjectId);

      if (error) throw error;

      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;

      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subject Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Subject Creation Form */}
      <form onSubmit={handleCreateSubject} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subject Name
            <input
              type="text"
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class
            <select
              value={newSubject.class_id}
              onChange={(e) => setNewSubject({...newSubject, class_id: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.batch_year}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Faculty
            <select
              value={newSubject.faculty_id}
              onChange={(e) => setNewSubject({...newSubject, faculty_id: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.full_name} ({faculty.email})
                </option>
              ))}
            </select>
          </label>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Subject
        </button>
      </form>

      {/* Subject List */}
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Subject Name</th>
              <th className="px-6 py-3 border-b">Class</th>
              <th className="px-6 py-3 border-b">Faculty</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject.id}>
                <td className="px-6 py-4 border-b">{subject.name}</td>
                <td className="px-6 py-4 border-b">{subject.classes.name}</td>
                <td className="px-6 py-4 border-b">
                  <select
                    value={subject.faculty_id || ''}
                    onChange={(e) => handleUpdateFaculty(subject.id, e.target.value)}
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.full_name} ({faculty.email})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 border-b">
                  <button 
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectAssignment;