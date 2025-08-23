import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardOverview from '../components/DashboardOverview';
import RealTimeMonitoring from '../components/RealTimeMonitoring';
import AnalyticsPage from '../components/AnalyticsPage';
import ReportsPage from '../components/ReportsPage';
import SettingsPage from '../components/SettingsPage';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/monitoring" element={<RealTimeMonitoring />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;