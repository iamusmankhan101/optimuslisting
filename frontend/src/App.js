import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MultiStepForm from './components/MultiStepForm';
import SubmissionsList from './components/SubmissionsList';
import AdminJobs from './components/AdminJobs';
import AdminDashboard from './components/AdminDashboard';
import Comments from './components/Comments';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <BrowserRouter>
      <div className="app">
        {activeTab === 'list' && (
          <header>
            <h1>Property Listings</h1>
            <nav>
              <button 
                className="active"
                onClick={() => setActiveTab('form')}
              >
                ← Back to Form
              </button>
              <button onClick={() => setActiveTab('admin')}>Admin Page</button>
            </nav>
          </header>
        )}
        
        <main className={activeTab === 'form' ? 'no-padding' : ''}>
          <Routes>
            <Route path="/" element={<MultiStepForm />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leads" element={<AdminJobs />} />
            <Route path="/leads" element={<SubmissionsList />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
