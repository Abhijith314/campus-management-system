// src/components/hod/ClassAssignment.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { ROLES } from '../../context/AuthContext';

const ClassAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [batchCoordinators, setBatchCoordinators] = useState([]);
  const [newClass, setNewClass] = useState({
    name: '',
    batch_year: '',
    batch_coordinator_id: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchBatchCoordinators();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*, users!classes_batch_coordinator_id_fkey(full_name, email)');

    if (error) {
      setError(error.message);
    } else {
      setClasses(data);
    }
  };

  const fetchBatchCoordinators = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', ROLES.BATCH_COORDINATOR);

    if (error) {
      setError(error.message);
    } else {
      setBatchCoordinators(data);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: newClass.name,
          batch_year: newClass.batch_year,
          batch_coordinator_id: newClass.batch_coordinator_id || null
        });

      if (error) throw error;

      // Reset form and refresh classes
      setNewClass({
        name: '',
        batch_year: '',
        batch_coordinator_id: ''
      });
      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateBatchCoordinator = async (classId, coordinatorId) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update({ batch_coordinator_id: coordinatorId })
        .eq('id', classId);

      if (error) throw error;

      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Class Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Class Creation Form */}
      <form onSubmit={handleCreateClass} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class Name
            <input
              type="text"
              value={newClass.name}
              onChange={(e) => setNewClass({...newClass, name: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Batch Year
            <input
              type="number"
              value={newClass.batch_year}
              onChange={(e) => setNewClass({...newClass, batch_year: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Batch Coordinator
            <select
              value={newClass.batch_coordinator_id}
              onChange={(e) => setNewClass({...newClass, batch_coordinator_id: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select Batch Coordinator</option>
              {batchCoordinators.map(coordinator => (
                <option key={coordinator.id} value={coordinator.id}>
                  {coordinator.full_name} ({coordinator.email})
                </option>
              ))}
            </select>
          </label>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Class
        </button>
      </form>

      {/* Class List */}
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Class Name</th>
              <th className="px-6 py-3 border-b">Batch Year</th>
              <th className="px-6 py-3 border-b">Batch Coordinator</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id}>
                <td className="px-6 py-4 border-b">{cls.name}</td>
                <td className="px-6 py-4 border-b">{cls.batch_year}</td>
                <td className="px-6 py-4 border-b">
                  <select
                    value={cls.batch_coordinator_id || ''}
                    onChange={(e) => handleUpdateBatchCoordinator(cls.id, e.target.value)}
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700"
                  >
                    <option value="">Select Coordinator</option>
                    {batchCoordinators.map(coordinator => (
                      <option key={coordinator.id} value={coordinator.id}>
                        {coordinator.full_name} ({coordinator.email})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 border-b">
                  <button 
                    onClick={() => handleDeleteClass(cls.id)}
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

export default ClassAssignment;