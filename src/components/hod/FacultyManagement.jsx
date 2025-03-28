import { useState, useEffect } from "react";
import { getFaculty, toggleFacultyStatus } from "../../services/facultyService";
import HODSidebar from "./HODSidebar";

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
        <div className="flex">
            <HODSidebar />
            <div className="p-5 w-full">
                <h2 className="text-2xl font-bold">Faculty Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 mt-3 rounded-md">
                    Add Faculty
                </button>

                <h5 className="text-2xl font-bold mt-5">Assigned Faculties</h5>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-black-200">
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Department</th>
                                <th className="border p-3">Status</th>
                                <th className="border p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.map((f) => (
                                <tr key={f.id} className="border">
                                    <td className="border p-3">{f.name}</td>
                                    <td className="border p-3">{f.dept}</td>
                                    <td className="border p-3">{f.active_status ? "Active" : "Inactive"}</td>
                                    <td className="border p-3">
                                        <button
                                            onClick={() => handleToggleStatus(f.id, f.active_status)}
                                            className={`px-3 py-1 text-white rounded-md ${
                                                f.active_status ? "bg-red-500" : "bg-green-500"
                                            }`}
                                        >
                                            {f.active_status ? "Deactivate" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FacultyManagement;
