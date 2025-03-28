import { useState, useEffect } from "react";
import { getClasses, getFaculty, assignFacultyToClass } from "../../services/facultyService";
import HODSidebar from "./HODSidebar";

const AssignFaculty = () => {
    const [classes, setClasses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setClasses(await getClasses());
            setFaculty(await getFaculty());
        };
        fetchData();
    }, []);

    const handleAssign = async () => {
        if (!selectedClass || !selectedFaculty) return alert("Please select both a class and a faculty.");
        await assignFacultyToClass(selectedClass, selectedFaculty);
        alert("Faculty assigned successfully!");
    };

    return (
        <div className="flex">
            <HODSidebar />
            <div className="p-5">
            <h2 className="text-2xl font-bold">Assign Faculty to Class</h2>
            <div className="mt-3 space-y-3">
                <select onChange={(e) => setSelectedClass(e.target.value)} className="border p-2 w-full">
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedFaculty(e.target.value)} className="border p-2 w-full">
                    <option value="">Select Faculty</option>
                    {faculty.map((fac) => (
                        <option key={fac.id} value={fac.id}>{fac.name} ({fac.dept})</option>
                    ))}
                </select>
                <button onClick={handleAssign} className="bg-green-500 text-white px-4 py-2">Assign Faculty</button>
            </div>
        </div>
        </div>
    );
};

export default AssignFaculty;
