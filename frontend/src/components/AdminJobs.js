import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Comments from './Comments'
import './AdminJobs.css'

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : '/api';

function AdminJobs() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [order, setOrder] = useState('DESC')
  const [selected, setSelected] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({ emirate:'', purpose:'', furnishing:'', bedrooms:'', dateFrom:'', dateTo:'' })
  // build option lists from current data
  const emirateOptions = useMemo(() => Array.from(new Set(listings.map(l=>l.emirate).filter(Boolean))), [listings])
  const purposeOptions = useMemo(() => Array.from(new Set(listings.map(l=>l.purpose).filter(Boolean))), [listings])
  const furnishingOptions = useMemo(() => Array.from(new Set(listings.map(l=>l.furnishing).filter(Boolean))), [listings])
  const bedroomsOptions = useMemo(() => Array.from(new Set(listings.map(l=>l.bedrooms).filter(Boolean))).sort((a,b)=>Number(a)-Number(b)), [listings])
  
  // apply client-side filters for accurate view
  const filteredListings = useMemo(() => {
    return listings.filter(row => {
      if (filters.emirate && row.emirate !== filters.emirate) return false
      if (filters.purpose && row.purpose !== filters.purpose) return false
      if (filters.furnishing && row.furnishing !== filters.furnishing) return false
      if (filters.bedrooms && String(row.bedrooms) !== String(filters.bedrooms)) return false
      if (filters.dateFrom && row.created_at && new Date(row.created_at) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && row.created_at && new Date(row.created_at) > new Date(filters.dateTo)) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = [row.property_code, row.emirate, row.area_community, row.building_name, row.agent_name, row.purpose, row.sub_category]
          .filter(Boolean)
          .join(' ') // combine
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [listings, filters, search])
  
  const allSelected = filteredListings.length > 0 && selectedIds.length === filteredListings.length
  
  const clearFilters = () => setFilters({ emirate:'', purpose:'', furnishing:'', bedrooms:'', dateFrom:'', dateTo:'' })
  const [error, setError] = useState(null)
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ search, sortBy, order })
      const res = await fetch(`${API_BASE}/get?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.success) setListings(data.data)
      setSelectedIds([])
    } catch (e) {
      console.error(e)
      setError(`Failed to fetch leads (${e.message}). Ensure your backend server is running on http://localhost:8000.`)
    } finally {
      setLoading(false)
    }
  }, [search, sortBy, order])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredListings.map((r) => r.id))
    }
  }

  const toggleRowSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.length} lead(s)? This action cannot be undone.`)
    if (!confirmed) return

    try {
      const res = await fetch(`${API_BASE}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert(`Successfully deleted ${data.deleted} lead(s)`)
        setSelectedIds([])
        fetchData()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (e) {
      console.error(e)
      alert('Failed to delete leads')
    }
  }

  const handleDeleteSingle = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')
    if (!confirmed) return

    try {
      const res = await fetch(`${API_BASE}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert('Lead deleted successfully')
        setSelected(null)
        fetchData()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (e) {
      console.error(e)
      alert('Failed to delete lead')
    }
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312.webp" alt="Optimus" />
         
        </div>
        <nav className="nav">
          <a href="/admin/dashboard" className="link">Dashboard</a>
          <a href="/admin/leads" className="link active">Leads</a>
        </nav>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-content">
        <div className="admin-topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div>
            <div className="title">Leads</div>
          </div>
          <div className="actions">
            
          </div>
        </div>

        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Total Leads</div>
              <div className="stat-value">{listings.length}</div>
            </div>
          </div>
          {error && (
            <div className="error-banner" role="alert">{error}</div>
          )}
          <div className="card">
            <div className="card-header">
              <div className="tabs">
                <span className="tab active">Leads</span>
              </div>
              <div className="toolbar">
                {selectedIds.length > 0 && (
                  <button 
                    className="btn danger" 
                    onClick={handleDeleteSelected}
                    style={{ marginRight: '10px' }}
                  >
                    Delete ({selectedIds.length})
                  </button>
                )}
                <input
                  className="search"
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className="btn" value={filters.emirate} onChange={(e)=>setFilters(f=>({...f, emirate:e.target.value}))}>
                  <option value="">All Emirates</option>
                  {emirateOptions.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className="btn" value={filters.purpose} onChange={(e)=>setFilters(f=>({...f, purpose:e.target.value}))}>
                  <option value="">All Purposes</option>
                  {purposeOptions.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className="btn" value={filters.furnishing} onChange={(e)=>setFilters(f=>({...f, furnishing:e.target.value}))}>
                  <option value="">Any Furnishing</option>
                  {furnishingOptions.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className="btn" value={filters.bedrooms} onChange={(e)=>setFilters(f=>({...f, bedrooms:e.target.value}))}>
                  <option value="">Any Beds</option>
                  {bedroomsOptions.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input className="btn" type="date" value={filters.dateFrom} onChange={(e)=>setFilters(f=>({...f, dateFrom:e.target.value}))} />
                <input className="btn" type="date" value={filters.dateTo} onChange={(e)=>setFilters(f=>({...f, dateTo:e.target.value}))} />
                <select className="btn" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="created_at">Date</option>
                  <option value="id">ID</option>
                  <option value="property_code">Code</option>
                  <option value="emirate">Emirate</option>
                </select>
                <select className="btn" value={order} onChange={(e) => setOrder(e.target.value)}>
                  <option value="DESC">Desc</option>
                  <option value="ASC">Asc</option>
                </select>
                <button className="btn" onClick={clearFilters}>Clear</button>
                <button className="btn primary" onClick={fetchData}>Apply</button>
              </div>
            </div>

            <div className="table-wrap">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th className="col-select">
                        <input
                          type="checkbox"
                          aria-label="Select all leads"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Lead</th>
                      <th>Property Details</th>
                      <th>Agent</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-data">No leads found</td>
                      </tr>
                    ) : (
                      filteredListings.map((row) => (
                        <tr key={row.id} onClick={() => setSelected(row)}>
                          <td className="col-select" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="row-select"
                              aria-label="Select lead"
                              checked={selectedIds.includes(row.id)}
                              onChange={() => toggleRowSelect(row.id)}
                            />
                          </td>
                          <td>
                            <div className="job-title">
                              <span className="icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                  <path fill="#0A66C2" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V22H0zM8.98 8.98h4.78v1.78h.07c.67-1.2 2.32-2.47 4.78-2.47 5.11 0 6.06 3.36 6.06 7.73V22h-5v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.68-2.49 3.42V22h-5V8.98z"/>
                                </svg>
                              </span>
                              <div className="row-title">{row.property_code || 'No Code'}</div>
                            </div>
                            <div className="row-sub">{row.emirate || '-'}</div>
                          </td>
                          <td className="truncate">
                            <div>{row.building_name || 'N/A'}, {row.area_community || 'N/A'}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                              {row.bedrooms ? `${row.bedrooms} Bed` : ''} 
                              {row.bedrooms && row.bathrooms ? ' • ' : ''}
                              {row.bathrooms ? `${row.bathrooms} Bath` : ''}
                              {(row.bedrooms || row.bathrooms) && row.size_sqft ? ' • ' : ''}
                              {row.size_sqft ? `${row.size_sqft} sqft` : ''}
                            </div>
                          </td>
                          <td className="truncate">{row.agent_name || 'Unknown'}</td>
                          <td>
                            <span className="badge purple">{row.purpose || 'N/A'}</span>
                            {row.keys_status && <span className="badge blue">{row.keys_status}</span>}
                            {row.viewing_status && <span className="badge green">{row.viewing_status}</span>}
                          </td>
                          <td className="nowrap">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto', maxWidth: '800px' }}>
            <header>
              <strong>{(selected.property_code || 'Property') + ' • ' + (selected.sub_category || 'Details')}</strong>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn danger" 
                  onClick={() => handleDeleteSingle(selected.id)}
                  style={{ background: '#dc3545' }}
                >
                  Delete
                </button>
                <button className="btn" onClick={() => setSelected(null)}>✕</button>
              </div>
            </header>
            <div className="body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div>
                  <h4>Basic Information</h4>
                  <div className="chip">Email: {selected.email || '-'}</div>
                  <div className="chip">Source: {selected.source_of_listing || '-'}</div>
                </div>

                <div>
                  <h4>Classification</h4>
                  <div className="chip">Category: {selected.category || '-'}</div>
                  <div className="chip">Sub Category: {selected.sub_category || '-'}</div>
                  <div className="chip">Purpose: {selected.purpose || '-'}</div>
                </div>

                <div>
                  <h4>Property Identification</h4>
                  <div className="chip">Code: {selected.property_code || '-'}</div>
                  <div className="chip">Emirate: {selected.emirate || '-'}</div>
                  <div className="chip">Area/Community: {selected.area_community || '-'}</div>
                  <div className="chip">Building: {selected.building_name || '-'}</div>
                  <div className="chip">Unit Number: {selected.unit_number || '-'}</div>
                  {selected.google_pin && (
                    <div className="chip">
                      <a href={selected.google_pin} target="_blank" rel="noopener noreferrer">View on Map</a>
                    </div>
                  )}
                </div>

                <div>
                  <h4>Specifications</h4>
                  <div className="chip">Bedrooms: {selected.bedrooms || '-'}</div>
                  <div className="chip">Bathrooms: {selected.bathrooms || '-'}</div>
                  <div className="chip">Size: {selected.size_sqft || '-'} Sq. Ft</div>
                  <div className="chip">Maid Room: {selected.maid_room || '-'}</div>
                  <div className="chip">Furnishing: {selected.furnishing || '-'}</div>
                  <div className="chip">Condition: {selected.property_condition || '-'}</div>
                </div>

                {selected.purpose === 'Sale' && (
                  <div>
                    <h4>Sales Details</h4>
                    <div className="chip">Sale Price: {selected.sale_price || '-'}</div>
                    <div className="chip">Unit Status: {selected.unit_status || '-'}</div>
                    <div className="chip">Rented Details: {selected.rented_details || '-'}</div>
                    <div className="chip">Notice Given: {selected.notice_given || '-'}</div>
                    <div className="chip">Commission: {selected.sales_agent_commission || '-'}%</div>
                  </div>
                )}

                {selected.purpose === 'Rent' && (
                  <div>
                    <h4>Rent Details</h4>
                    <div className="chip">Asking Rent: {selected.asking_rent || '-'}</div>
                    <div className="chip">Cheques: {selected.number_of_chq || '-'}</div>
                    <div className="chip">Security Deposit: {selected.security_deposit || '-'}</div>
                    <div className="chip">Commission: {selected.rent_agent_commission || '-'}%</div>
                  </div>
                )}

                <div>
                  <h4>Viewing & Status</h4>
                  <div className="chip">Keys Status: {selected.keys_status || '-'}</div>
                  <div className="chip">Viewing Status: {selected.viewing_status || '-'}</div>
                  {selected.more_information && (
                    <div className="chip">Info: {selected.more_information}</div>
                  )}
                </div>

                <div>
                  <h4>Agent Details</h4>
                  <div className="chip">Code: {selected.agent_code || '-'}</div>
                  <div className="chip">Name: {selected.agent_name || '-'}</div>
                  <div className="chip">Mobile: {selected.agent_mobile || '-'}</div>
                  <div className="chip">Email: {selected.agent_email || '-'}</div>
                  <div className="chip">Agency: {selected.agent_agency || '-'}</div>
                </div>

                <div>
                  <h4>Submission</h4>
                  <div className="chip">Date: {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}</div>
                  <div className="chip">ID: {selected.id || '-'}</div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
                <Comments propertyListingId={selected.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminJobs