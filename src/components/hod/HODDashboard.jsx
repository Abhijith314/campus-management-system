import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Sidebar from "../components/hod/Sidebar";

const HODDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            let { data, error } = await supabase.from("users").select("id, email, role");
            if (error) console.error("Error fetching users: ", error);
            else setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">HOD Dashboard</h1>
                    <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded">Logout</button>
                </div>
                <div className="mt-6">
                    <table className="w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HODDashboard;
