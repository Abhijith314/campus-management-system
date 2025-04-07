import { supabase } from './supabase';

export const getFacultyClasses = async (facultyId) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('class_id, classes(id, name)')
      .eq('faculty_id', facultyId);

    if (error) throw error;
    return Array.from(new Set(data.map(item => item.classes)));
  } catch (error) {
    console.error("Error fetching faculty classes:", error);
    throw error;
  }
};

export const getClassStudents = async (classId) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, reg_no, name_of_student')
      .eq('class_id', classId)
      .order('name_of_student');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching class students:", error);
    throw error;
  }
};

export const getInternalMarks = async (subjectId, assessmentType) => {
  try {
    const { data, error } = await supabase
      .from('internal_marks')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('assessment_type', assessmentType);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching internal marks:", error);
    throw error;
  }
};

export const upsertMarks = async (marksData, maxMarks, assessmentType) => {
    try {
      const upsertData = marksData.map(mark => ({
        student_id: mark.student_id,
        subject_id: mark.subject_id,
        assessment_type: assessmentType,
        max_marks: maxMarks,
        [assessmentType === 'internal1' ? 'internal1_marks' : 'internal2_marks']: mark.marks
      }));
  
      const { data, error } = await supabase
        .from('internal_marks')
        .upsert(upsertData, { 
          onConflict: 'student_id,subject_id,assessment_type'
        })
        .select();
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving marks:", error);
      throw error;
    }
  };