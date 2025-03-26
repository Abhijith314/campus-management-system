import { useState, useEffect } from "react";
import { getFaculty, toggleFacultyStatus } from "../../services/facultyService";

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        const fetchFaculty = async () => {
            const data = await getFaculty();
            setFaculty(data);
        };
        fetchFaculty();
    }, []);

    const handleToggleStatus = async (id, status) => {
        await toggleFacultyStatus(id, !status);
        setFaculty(await getFaculty());
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">Faculty Management</h2>
            <ul className="mt-5">
                {faculty.map((f) => (
                    <li key={f.id} className="flex justify-between border p-3 my-2">
                        {f.name} - {f.dept} - {f.active_status ? "Active" : "Inactive"}
                        <button onClick={() => handleToggleStatus(f.id, f.active_status)} className="bg-yellow-500 text-white px-3 py-1">
                            {f.active_status ? "Deactivate" : "Activate"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FacultyManagement;
