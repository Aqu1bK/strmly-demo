import { Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">STRMLY</Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-indigo-200">Feed</Link>
          <Link to="/upload" className="flex items-center hover:text-indigo-200">
            <FaUpload className="mr-1" /> Upload
          </Link>
          <Link to="/auth" className="hover:text-indigo-200">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;