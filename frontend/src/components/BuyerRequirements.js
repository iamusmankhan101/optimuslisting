import React, { useState, useEffect } from 'react';
import './AdminJobs.css';

const API_BASE = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : '/api');

function BuyerRequirements() {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/buyer-requirements`);
            const data = await response.json();
            
            if (data.success) {
                setRequirements(data.requirements || []);
                setError('');
            } else {
                setError(data.error || 'Failed to fetch requirements');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) return <div className="loading">Loading buyer requirements...</div>;

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="brand">
                    <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312.webp" alt="Optimus" />
                </div>
                <nav className="nav">
                    <a href="/admin/dashboard" className="link">Dashboard</a>
                    <a href="/admin/leads" className="link">Property Leads</a>
                    <a href="/admin/buyers" className="link active">Buyer Requirements</a>
                </nav>
            </aside>

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <div className="admin-content">
                <div className="admin-topbar">
                    <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                    <div>
                        <div className="title">Buyer Requirements</div>
                        <div className="subtitle">Total: {requirements.length} leads</div>
                    </div>
                    <div className="actions">
                        <button className="btn" onClick={fetchRequirements}>Refresh</button>
                    </div>
                </div>

                <div className="container">
                    {error && (
                        <div className="error-message" style={{ padding: '15px', background: '#fee', color: '#c00', borderRadius: '5px', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    {requirements.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666', background: 'white', borderRadius: '8px' }}>
                            <h3>No buyer requirements yet</h3>
                            <p>Buyer requirements will appear here once submitted</p>
                        </div>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>ID</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Name</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Contact</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Purpose</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Location</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Type</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Beds</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Budget</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Date</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#495057' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requirements.map((req, index) => (
                                            <tr key={req.id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                <td style={{ padding: '12px', color: '#212529' }}>{req.id}</td>
                                                <td style={{ padding: '12px', color: '#212529', fontWeight: '500' }}>{req.name}</td>
                                                <td style={{ padding: '12px', color: '#212529' }}>
                                                    <div>{req.email}</div>
                                                    <div style={{ fontSize: '0.85em', color: '#6c757d' }}>{req.phone}</div>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ 
                                                        padding: '4px 8px', 
                                                        borderRadius: '4px', 
                                                        fontSize: '0.85em',
                                                        background: req.purpose === 'Buy' ? '#d1f4e0' : '#d1e7ff',
                                                        color: req.purpose === 'Buy' ? '#0a6e31' : '#004085'
                                                    }}>
                                                        {req.purpose}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', color: '#212529' }}>{req.emirate}</td>
                                                <td style={{ padding: '12px', color: '#212529' }}>{req.sub_category}</td>
                                                <td style={{ padding: '12px', color: '#212529' }}>{req.bedrooms}</td>
                                                <td style={{ padding: '12px', color: '#212529', fontSize: '0.9em' }}>
                                                    <div>{formatCurrency(req.min_budget)}</div>
                                                    <div style={{ color: '#6c757d' }}>to {formatCurrency(req.max_budget)}</div>
                                                </td>
                                                <td style={{ padding: '12px', color: '#6c757d', fontSize: '0.85em' }}>
                                                    {formatDate(req.created_at)}
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <button 
                                                        onClick={() => setSelectedRequirement(req)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: '#0a4c7b',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85em'
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for viewing details */}
            {selectedRequirement && (
                <div className="modal-overlay" onClick={() => setSelectedRequirement(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedRequirement(null)}>×</button>
                        
                        <h2>Buyer Requirement Details</h2>
                        
                        <div className="modal-section">
                            <h3>Contact Information</h3>
                            <p><strong>Name:</strong> {selectedRequirement.name}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${selectedRequirement.email}`}>{selectedRequirement.email}</a></p>
                            <p><strong>Phone:</strong> <a href={`tel:${selectedRequirement.phone}`}>{selectedRequirement.phone}</a></p>
                        </div>

                        <div className="modal-section">
                            <h3>Property Requirements</h3>
                            <p><strong>Purpose:</strong> {selectedRequirement.purpose}</p>
                            <p><strong>Category:</strong> {selectedRequirement.category}</p>
                            <p><strong>Sub Category:</strong> {selectedRequirement.sub_category}</p>
                            <p><strong>Bedrooms:</strong> {selectedRequirement.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {selectedRequirement.bathrooms}</p>
                            {selectedRequirement.min_size_sqft && selectedRequirement.max_size_sqft && (
                                <p><strong>Size Range:</strong> {selectedRequirement.min_size_sqft} - {selectedRequirement.max_size_sqft} sq.ft</p>
                            )}
                            {selectedRequirement.maid_room && (
                                <p><strong>Maid Room:</strong> {selectedRequirement.maid_room}</p>
                            )}
                            {selectedRequirement.furnishing && (
                                <p><strong>Furnishing:</strong> {selectedRequirement.furnishing}</p>
                            )}
                        </div>

                        <div className="modal-section">
                            <h3>Location</h3>
                            <p><strong>Emirate:</strong> {selectedRequirement.emirate}</p>
                            {selectedRequirement.preferred_areas && (
                                <p><strong>Preferred Areas:</strong> {selectedRequirement.preferred_areas}</p>
                            )}
                        </div>

                        <div className="modal-section">
                            <h3>Budget</h3>
                            <p><strong>Budget Range:</strong> {formatCurrency(selectedRequirement.min_budget)} - {formatCurrency(selectedRequirement.max_budget)}</p>
                            {selectedRequirement.payment_method && (
                                <p><strong>Payment Method:</strong> {selectedRequirement.payment_method}</p>
                            )}
                        </div>

                        {selectedRequirement.additional_requirements && (
                            <div className="modal-section">
                                <h3>Additional Requirements</h3>
                                <p>{selectedRequirement.additional_requirements}</p>
                            </div>
                        )}

                        <div className="modal-section">
                            <p><strong>Submitted:</strong> {formatDate(selectedRequirement.created_at)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerRequirements;
