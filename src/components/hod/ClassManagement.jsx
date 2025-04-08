import React, { useState, useEffect } from 'react';
import { 
    getClasses, 
    addClass, 
    getFaculties, 
    getSubjectsByClass, 
    addSubject, 
    assignFacultyToSubject, 
    deleteSubject, 
    deleteClass 
} from '../../services/classService';
import HODSidebar from "./HODSidebar";

const ClassManagement = () => {
    // Class state
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({
        name: '',
        dept: '',
        batch_coordinator_id: '',
        batch_year_start: '',
        batch_year_end: ''
    });
    const [showClassModal, setShowClassModal] = useState(false);

    // Subject state
    const [selectedClass, setSelectedClass] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState('');

    // Faculty state
    const [faculties, setFaculties] = useState([]);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fetchedClasses = await getClasses();
                const fetchedFaculties = await getFaculties();
                
                if (fetchedFaculties && fetchedFaculties.length > 0) {
                    setFaculties(fetchedFaculties);
                } else {
                    console.warn('No faculties found');
                }
                
                setClasses(fetchedClasses);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch subjects when a class is selected
    useEffect(() => {
        const fetchSubjects = async () => {
            if (selectedClass) {
                const fetchedSubjects = await getSubjectsByClass(selectedClass.id);
                setSubjects(fetchedSubjects);
            }
        };
        fetchSubjects();
    }, [selectedClass]);

    // Handle class creation
    const handleCreateClass = async (e) => {
        e.preventDefault();
        // Find the selected faculty to get their name
        const selectedFaculty = faculties.find(f => f.id === newClass.batch_coordinator_id);
        
        const classData = {
            ...newClass,
            batch_coordinator_name: selectedFaculty ? selectedFaculty.name : ''
        };

        const createdClass = await addClass(classData);
        if (createdClass) {
            setClasses([...classes, createdClass]);
            setNewClass({
                name: '',
                dept: '',
                batch_coordinator_id: '',
                batch_year_start: '',
                batch_year_end: ''
            });
            setShowClassModal(false);
        }
    };

    // Handle subject creation
    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!selectedClass) {
            alert('Please select a class first');
            return;
        }

        const subjectData = {
            name: newSubject,
            class_id: selectedClass.id
        };

        const createdSubject = await addSubject(subjectData);
        if (createdSubject) {
            setSubjects([...subjects, createdSubject]);
            setNewSubject('');
        }
    };

    // Handle faculty assignment to subject
    const handleAssignFaculty = async (subjectId, facultyId) => {
        const updatedSubject = await assignFacultyToSubject(subjectId, facultyId);
        if (updatedSubject) {
            const updatedSubjects = subjects.map(subject => 
                subject.id === updatedSubject.id ? updatedSubject : subject
            );
            setSubjects(updatedSubjects);
        }
    };

    // Handle subject deletion
    const handleDeleteSubject = async (subjectId) => {
        const isDeleted = await deleteSubject(subjectId);
        if (isDeleted) {
            const filteredSubjects = subjects.filter(subject => subject.id !== subjectId);
            setSubjects(filteredSubjects);
        }
    };

    // Handle class deletion
    const handleDeleteClass = async (classId) => {
        const isDeleted = await deleteClass(classId);
        if (isDeleted) {
            const filteredClasses = classes.filter(cls => cls.id !== classId);
            setClasses(filteredClasses);
            setSelectedClass(null);
            setSubjects([]);
        }
    };

    // Get available faculties (excluding those already assigned as coordinators)
    const getAvailableFaculties = () => {
        const coordinatorIds = classes.map(cls => cls.batch_coordinator_id);
        return faculties.filter(faculty => !coordinatorIds.includes(faculty.id));
    };

    return (
        <div className="flex">
            <HODSidebar />
            
            <div className="container mx-auto p-6 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Class Management<br/></h1>
                    
                    <button 
                        onClick={() => setShowClassModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create New Class
                    </button>
                </div>

                {/* Class Creation Modal */}
                {showClassModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Create New Class</h2>
                                <button 
                                    onClick={() => setShowClassModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Class Name"
                                    value={newClass.name}
                                    onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Department"
                                    value={newClass.dept}
                                    onChange={(e) => setNewClass({...newClass, dept: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <select
                                    value={newClass.batch_coordinator_id || ''}
                                    onChange={(e) => setNewClass({...newClass, batch_coordinator_id: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Batch Coordinator</option>
                                    {getAvailableFaculties().map((faculty) => (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.name} ({faculty.dept})
                                        </option>
                                    ))}
                                </select>
                                <div className="flex space-x-4">
                                    <input
                                        type="number"
                                        placeholder="Batch Start Year"
                                        value={newClass.batch_year_start}
                                        onChange={(e) => setNewClass({...newClass, batch_year_start: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Batch End Year"
                                        value={newClass.batch_year_end}
                                        onChange={(e) => setNewClass({...newClass, batch_year_end: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowClassModal(false)}
                                        className="px-4 py-2 border rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {/* Class and Subject Management Section */}
                    <div className="bg-white text-black shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Manage Classes and Subjects</h2>
                        
                        {/* Class Selection */}
                        <div className="mb-4">
                            <select
                                value={selectedClass?.id || ''}
                                onChange={(e) => {
                                    const cls = classes.find(c => c.id === e.target.value);
                                    setSelectedClass(cls);
                                }}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select a Class to Manage</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} ({cls.dept}) - {cls.batch_year_start} to {cls.batch_year_end}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Management */}
                        {selectedClass && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold">
                                        Subjects for {selectedClass.name}
                                    </h3>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            placeholder="New Subject Name"
                                            value={newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                            className="p-2 border rounded-l"
                                        />
                                        <button 
                                            onClick={handleAddSubject}
                                            className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600"
                                        >
                                            Add Subject
                                        </button>
                                    </div>
                                </div>

                                {/* Subjects Table */}
                                {subjects.length === 0 ? (
                                    <p className="text-gray-500">No subjects added yet</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border p-2 text-left">Subject</th>
                                                    <th className="border p-2 text-left">Assigned Faculty</th>
                                                    <th className="border p-2 text-left">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subjects.map((subject) => (
                                                    <tr key={subject.id} className="border hover:bg-gray-50">
                                                        <td className="border p-2">{subject.name}</td>
                                                        <td className="border p-2">
                                                            <select
                                                                value={subject.faculty_id || ''}
                                                                onChange={(e) => handleAssignFaculty(subject.id, e.target.value)}
                                                                className="w-full p-1 border rounded"
                                                            >
                                                                <option value="">Select Faculty</option>
                                                                {faculties.map((faculty) => (
                                                                    <option key={faculty.id} value={faculty.id}>
                                                                        {faculty.name} ({faculty.dept})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="border p-2">
                                                            <button
                                                                onClick={() => handleDeleteSubject(subject.id)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Delete Class Button */}
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete ${selectedClass.name}?`)) {
                                            handleDeleteClass(selectedClass.id);
                                        }
                                    }}
                                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete This Class
                                </button>
                            </div>
                        )}
                    </div>

                    {/* All Classes List */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">All Classes</h2>
                        {classes.length === 0 ? (
                            <p className="text-gray-500">No classes created yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2 text-left">Class Name</th>
                                            <th className="border p-2 text-left">Department</th>
                                            <th className="border p-2 text-left">Batch Years</th>
                                            <th className="border p-2 text-left">Batch Coordinator</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.map((cls) => (
                                            <tr 
                                                key={cls.id} 
                                                className={`border hover:bg-gray-50 ${selectedClass?.id === cls.id ? 'bg-blue-50' : ''}`}
                                                onClick={() => setSelectedClass(cls)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td className="border p-2">{cls.name}</td>
                                                <td className="border p-2">{cls.dept}</td>
                                                <td className="border p-2">{cls.batch_year_start} - {cls.batch_year_end}</td>
                                                <td className="border p-2">{cls.batch_coordinator_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;