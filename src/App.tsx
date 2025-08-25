
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
import PricingPage from './pages/PricingPage';
import ApiDocsPage from './pages/ApiDocsPage';
import DashboardPage from './pages/DashboardPage';
// import AIChat from './pages/Chatbot';
import AIGuardianChatDemo from './pages/Chatbot';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/docs" element={<ApiDocsPage />} />
          <Route path="/chat" element={<AIGuardianChatDemo />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;