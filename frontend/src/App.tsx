// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

import Dashboard from './pages/Dashboard';
import NewCampaign from './pages/Campaigns/NewCampaign';
import AllCampaigns from './pages/Campaigns/AllCampaigns';
import UploadContacts from './pages/UploadContacts';
import SendSMS from './pages/SendSMS';
import Submissions from './pages/Submissions';
import Analytics from './pages/Analytics';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/new-campaign" element={<Layout><NewCampaign /></Layout>} />
        <Route path="/all-campaigns" element={<Layout><AllCampaigns /></Layout>} />
        <Route path="/upload-contacts" element={<Layout><UploadContacts /></Layout>} />
        <Route path="/send-sms" element={<Layout><SendSMS /></Layout>} />
        <Route path="/submissions" element={<Layout><Submissions /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
      
        
      </Routes>
    </Router>
  );
}

export default App;