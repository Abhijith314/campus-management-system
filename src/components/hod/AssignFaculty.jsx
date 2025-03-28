import { useState } from "react";
import { supabase } from "../../supabaseClient"; // Ensure Supabase is initialized
import HODSidebar from "./HODSidebar";

const AddFaculty = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !password) {
            alert("Please fill all fields.");
            return;
        }

        setLoading(true);

        // Insert into the faculty table
        const { data: facultyData, error: facultyError } = await supabase
            .from("faculty")
            .insert([{ name, email, phone, activeStatus: true }])
            .select();

        if (facultyError) {
            alert("Error adding faculty: " + facultyError.message);
            setLoading(false);
            return;
        }

        // Insert into the user table for authentication
        const { error: userError } = await supabase
            .from("users")
            .insert([{ email, password, role: "faculty" }]);

        if (userError) {
            alert("Error creating faculty account: " + userError.message);
        } else {
            alert("Faculty added successfully!");
        }

        setLoading(false);
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
    };

    return (
        <div className="flex">
            <HODSidebar />
            <div className="p-5 w-full">
                <h2 className="text-2xl font-bold">Add Faculty</h2>
                <form onSubmit={handleAddFaculty} className="mt-5 space-y-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Initial Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Faculty"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddFaculty;
