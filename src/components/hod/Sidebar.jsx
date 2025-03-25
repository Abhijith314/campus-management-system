import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6">HOD Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/hod-dashboard/home" className="hover:bg-gray-700 p-2 rounded">Home</Link>
        <Link to="/hod-dashboard/classes" className="hover:bg-gray-700 p-2 rounded">Classes</Link>
        <Link to="/hod-dashboard/faculty" className="hover:bg-gray-700 p-2 rounded">Faculty</Link>
        <Link to="/hod-dashboard/students" className="hover:bg-gray-700 p-2 rounded">Students</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
