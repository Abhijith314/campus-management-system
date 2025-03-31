import Sidebar from "../Sidebar";

const menuItems = [
    { name: "Dashboard", path: "/hod-dashboard" },
    { name: "Profile", path: "/student/profile" },
    { name: "Internals", path: "/hod/faculty" },
    { name: "Assignments", path: "/hod/students" },
    { name: "Attendence", path: "/hod/students" }
];

const StudentSidebar = () => <Sidebar role="Student" menuItems={menuItems} />;
export default StudentSidebar;
