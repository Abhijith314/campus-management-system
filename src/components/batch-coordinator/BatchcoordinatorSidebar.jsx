import Sidebar from "../Sidebar";

const menuItems = [
    { name: "Dashboard", path: "/batch-coordinator-dashboard" },
    { name: "Manage Student", path: "/batch-coordinator/student-registration" },
    { name: "Marks", path: "/faculty/marks" },
    { name: "Assignment", path: "/faculty/assignment" },
    { name: "Attendence", path: "/faculty/students" }
];

const BatchcoordinatorSidebar = () => <Sidebar role="Batch coordinator" menuItems={menuItems} />;
export default BatchcoordinatorSidebar;
