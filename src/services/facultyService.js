import { supabase, supabaseAdmin } from "./supabase";

export const addFaculty = async (facultyData) => {
    try {
        const { name, email, phone, dept } = facultyData;
        const initialPassword = "faculty@123";

        // Step 1: Check if faculty exists in users table
        const { data: existingUser, error: userCheckError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userCheckError && userCheckError.code !== 'PGRST116') { // Ignore "No rows found" error
            throw new Error("User check error: " + userCheckError.message);
        }
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        // Step 2: Create auth user
        const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: initialPassword,
            user_metadata: { role: "Faculty", name, phone, dept },
            email_confirm: true, // Skip email confirmation
        });

        if (authError) throw new Error("Auth error: " + authError.message);

        const userId = user?.user?.id;
        if (!userId) throw new Error("User ID not returned.");

        // Step 3: Insert into users table
        const { error: usersInsertError } = await supabase
            .from("users")
            .insert([{ 
                id: userId,
                email, 
                full_name: name, 
                role: "Faculty", 
                department: dept,
                created_at: new Date().toISOString()
            }]);

        if (usersInsertError) throw new Error("Users insert error: " + usersInsertError.message);

        // Step 4: Insert into faculty table
        const { data: faculty, error: facultyError } = await supabase
            .from("faculty")
            .insert([{ 
                id: userId,
                name, 
                email, 
                phone, 
                dept, 
                activeStatus: true 
            }])
            .select(); // Ensures the inserted data is returned

        if (facultyError) throw new Error("Faculty insert error: " + facultyError.message);

        return { 
            success: true, 
            faculty: faculty[0],
            initialPassword: initialPassword 
        };
    } catch (error) {
        console.error("Error adding faculty:", error.message);
        return { success: false, error: error.message };
    }
};

// Update toggle status to use correct role
export const toggleFacultyStatus = async (id, status) => {
    try {
        // Update users table
        const { error: userUpdateError } = await supabase
            .from("users")
            .update({ role: status ? "Faculty" : "Student" }) // Adjust fallback role as needed
            .eq("id", id);

        if (userUpdateError) throw userUpdateError;

        // Update faculty table
        const { error } = await supabase
            .from("faculty")
            .update({ activeStatus: status })
            .eq("id", id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error updating status:", error.message);
        return { success: false, error: error.message };
    }
};

export const getFaculty = async () => {
    try {
        const { data, error } = await supabase
            .from("faculty")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching faculty:", error.message);
        return [];
    }
};