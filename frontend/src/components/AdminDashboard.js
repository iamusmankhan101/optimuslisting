import React, { useEffect, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import './AdminJobs.css'

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : '/api';

function AdminDashboard() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/get`)
      const data = await res.json()
      if (data.success) setListings(data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312.webp" alt="Optimus" />
        </div>
        <nav className="nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => `link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/admin/leads" className={({isActive}) => `link${isActive ? ' active' : ''}`}>Property Leads</NavLink>
          <NavLink to="/admin/buyers" className={({isActive}) => `link${isActive ? ' active' : ''}`}>Buyer Requirements</NavLink>
        </nav>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-content">
        <div className="admin-topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div>
            <div className="title">Dashboard</div>
            <div className="subtitle">Overview of your leads</div>
          </div>
          <div className="actions">
            <button className="btn" onClick={fetchData}>Refresh</button>
          </div>
        </div>

        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Total Leads</div>
              <div className="stat-value">{loading ? '…' : listings.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard