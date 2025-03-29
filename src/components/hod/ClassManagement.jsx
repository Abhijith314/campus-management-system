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
                
                // Debug log to check fetched faculties
                console.log('Fetched Faculties:', fetchedFaculties);
                
                setClasses(fetchedClasses);
                setFaculties(fetchedFaculties);
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
        const createdClass = await addClass(newClass);
        if (createdClass) {
            setClasses([...classes, createdClass]);
            setNewClass({
                name: '',
                dept: '',
                batch_coordinator_id: '',
                batch_year_start: '',
                batch_year_end: ''
            });
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

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Creation Section */}
                <div className="bg-black shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Create New Class</h2>
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
                            {faculties.map((faculty) => (
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
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Create Class
                        </button>
                    </form>
                </div>

                {/* Class and Subject Management Section */}
                <div className="bg-black shadow-md rounded-lg p-6">
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
                            <option value="">Select a Class</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} ({cls.dept})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject Management */}
                    {selectedClass && (
                        <div>
                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="Add Subject"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="flex-grow p-2 border rounded-l"
                                />
                                <button 
                                    onClick={handleAddSubject}
                                    className="bg-green-500 text-white p-2 rounded-r"
                                >
                                    Add Subject
                                </button>
                            </div>

                            {/* Subjects List */}
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-2">Subjects</h3>
                                {subjects.length === 0 ? (
                                    <p className="text-gray-500">No subjects added yet</p>
                                ) : (
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-black-200">
                                                <th className="border p-2">Subject</th>
                                                <th className="border p-2">Assigned Faculty</th>
                                                <th className="border p-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjects.map((subject) => (
                                                <tr key={subject.id} className="border">
                                                    <td className="border p-2">{subject.name}</td>
                                                    <td className="border p-2">
                                                        <select
                                                            value={subject.faculty_id || ''}
                                                            onChange={(e) => handleAssignFaculty(subject.id, e.target.value)}
                                                            className="w-full p-1"
                                                        >
                                                            <option value="">Assign Faculty</option>
                                                            {faculties.map((faculty) => (
                                                                <option key={faculty.id} value={faculty.id}>
                                                                    {faculty.name} ({faculty.dept})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={() => handleDeleteSubject(subject.id)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Delete Class Button */}
                            <button
                                onClick={() => handleDeleteClass(selectedClass.id)}
                                className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                            >
                                Delete Class
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;