import { useState, useEffect } from "react";
import { getStudents } from "../../services/studentService";

const StudentManagement = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">Student Management</h2>
            <ul className="mt-5">
                {students.map((s) => (
                    <li key={s.id} className="border p-3 my-2">
                        {s.reg_no} - {s.nameOfStudent} - {s.class_id}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentManagement;
