import { supabase } from "./supabase";

export const getClasses = async () => {
    const { data, error } = await supabase.from("classes").select("*");
    if (error) throw error;
    return data;
};

export const addClass = async (className, dept) => {
    const { error } = await supabase.from("classes").insert([{ class_name: className, dept }]);
    if (error) throw error;
};

export const deleteClass = async (id) => {
    const { error } = await supabase.from("classes").delete().match({ id });
    if (error) throw error;
};
