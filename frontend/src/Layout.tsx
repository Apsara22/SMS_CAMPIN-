// components/Layout.tsx
import { FaTachometerAlt, FaBullhorn, FaChevronDown, FaUpload, FaPaperPlane, FaCheckCircle, FaChartBar, FaCog } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [campaignsOpen, setCampaignsOpen] = useState(true);

  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 h-full bg-black text-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold">SMS Campaign</h3>
          <p className="text-gray-400 text-sm">Marketing Dashboard</p>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/"
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 ${isActive('/') ? 'bg-gray-800' : ''}`}
          >
            <FaTachometerAlt className="mr-3" />
            <span>Dashboard</span>
          </Link>

          {/* Campaigns Group */}
          <div className="border-b border-gray-700">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800"
              onClick={() => setCampaignsOpen(!campaignsOpen)}
            >
              <div className="flex items-center">
                <FaBullhorn className="mr-3" />
                <span>Campaigns</span>
              </div>
              <FaChevronDown className={`transition-transform ${campaignsOpen ? 'transform rotate-180' : ''}`} />
            </div>

            {campaignsOpen && (
              <div className="pl-12">
                <Link
                  to="/new-campaign"
                  className={`block p-3 cursor-pointer hover:bg-gray-800 ${isActive('/new-campaign') ? 'bg-gray-800' : ''}`}
                >
                  New Campaign
                </Link>
                <Link
                  to="/all-campaigns"
                  className={`block p-3 cursor-pointer hover:bg-gray-800 ${isActive('/all-campaigns') ? 'bg-gray-800' : ''}`}
                >
                  All Campaigns
                </Link>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          {[
            { icon: <FaUpload className="mr-3" />, path: '/upload-contacts', text: 'Upload Contacts' },
            { icon: <FaPaperPlane className="mr-3" />, path: '/send-sms', text: 'Send SMS' },
            { icon: <FaCheckCircle className="mr-3" />, path: '/submissions', text: 'Submissions' },
            { icon: <FaChartBar className="mr-3" />, path: '/analytics', text: 'Analytics' },
            { icon: <FaCog className="mr-3" />, path: '#', text: 'Settings' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 ${isActive(item.path) ? 'bg-gray-800' : ''}`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default Layout;