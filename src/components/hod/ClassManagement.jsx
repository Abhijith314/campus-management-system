import { useState, useEffect } from "react";
import { getClasses, addClass, deleteClass } from "../../services/classService";

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [className, setClassName] = useState("");
    const [dept, setDept] = useState("");

    useEffect(() => {
        const fetchClasses = async () => {
            const data = await getClasses();
            setClasses(data);
        };
        fetchClasses();
    }, []);

    const handleAddClass = async () => {
        if (!className || !dept) return;
        await addClass(className, dept);
        setClassName("");
        setDept("");
        setClasses(await getClasses()); // Refresh class list
    };

    const handleDelete = async (id) => {
        await deleteClass(id);
        setClasses(await getClasses());
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">Class Management</h2>
            <div className="mt-3">
                <input
                    type="text"
                    placeholder="Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button onClick={handleAddClass} className="bg-blue-500 text-white px-4 py-2">Add Class</button>
            </div>
            <ul className="mt-5">
                {classes.map((c) => (
                    <li key={c.id} className="flex justify-between border p-3 my-2">
                        {c.class_name} - {c.dept}
                        <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-3 py-1">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassManagement;
