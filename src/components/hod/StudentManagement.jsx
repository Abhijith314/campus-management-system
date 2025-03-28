import { useState, useEffect } from "react";
import { getStudents } from "../../services/studentService";
import { getClasses } from "../../services/classService";
import HODSidebar from "./HODSidebar";

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    useEffect(() => {
        const fetchClasses = async () => {
            const classData = await getClasses();
            setClasses(classData);
            if (classData.length > 0) {
                setSelectedClass(classData[0].id); // Set first class as default
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (selectedClass) {
                const data = await getStudents(selectedClass);
                setStudents(data);
            }
        };
        fetchStudents();
    }, [selectedClass]);

    return (
        <div className="flex">
            <HODSidebar />
            <div className="p-5 w-full">
                <h2 className="text-2xl font-bold">Student Management</h2>

                {/* Class Selection Dropdown */}
                <label className="block mt-3 font-semibold">Select Class:</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border p-2 mt-1 rounded-md"
                >
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name}
                        </option>
                    ))}
                </select>

                {/* Students Table */}
                <h5 className="text-2xl font-bold mt-5">Students of Class</h5>
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-black-200">
                                <th className="border p-3">Reg No</th>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Marks</th>
                                <th className="border p-3">Attendance (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.id} className="border">
                                    <td className="border p-3">{s.reg_no}</td>
                                    <td className="border p-3">{s.nameOfStudent}</td>
                                    <td className="border p-3">{s.marks || "N/A"}</td>
                                    <td className="border p-3">{s.attendance || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
