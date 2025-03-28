import { supabase } from "./supabase";

// export const getFaculty = async () => {
//     const { data, error } = await supabase.from("faculty").select("*");
//     if (error) throw error;
//     return data;
// };

export const toggleFacultyStatus = async (id, status) => {
    const { error } = await supabase.from("faculty").update({ active_status: status }).match({ id });
    if (error) throw error;
};
export const getClasses = async () => {
    const { data, error } = await supabase.from("classes").select("*");
    if (error) throw error;
    return data;
};

export const getFaculty = async () => {
    const { data, error } = await supabase.from("faculty").select("*").eq("active_status", true);
    if (error) throw error;
    return data;
};

export const assignFacultyToClass = async (classId, facultyId) => {
    const { error } = await supabase.from("subjects").insert([{ class_id: classId, faculty_id: facultyId }]);
    if (error) throw error;
};