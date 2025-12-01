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

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const response = await fetch(`${API_BASE}/buyer-requirements`);
            const data = await response.json();
            
            if (data.success) {
                setRequirements(data.requirements);
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
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) return <div className="loading">Loading buyer requirements...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="brand">
                    <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312.webp" alt="Optimus" />
                </div>
                <nav className="nav">
                    <a href="/admin/dashboard" className="link">Dashboard</a>
                    <a href="/admin/leads" className="link">Property Leads</a>
                    <a href="/admin/buyers" className="link active">Buyer Requirements</a>
                </nav>
            </aside>

            <div className="admin-content">
                <div className="admin-topbar">
                    <div>
                        <div className="title">Buyer Requirements</div>
                        <div className="subtitle">Total: {requirements.length} requirements</div>
                    </div>
                </div>

                <div className="container">

                    <div className="jobs-grid">
                        {requirements.map((req) => (
                    <div key={req.id} className="job-card" onClick={() => setSelectedRequirement(req)}>
                        <div className="job-header">
                            <h3>{req.name}</h3>
                            <span className={`status-badge ${req.status?.toLowerCase()}`}>
                                {req.status || 'New'}
                            </span>
                        </div>
                        
                        <div className="job-details">
                            <div className="detail-row">
                                <span className="label">Purpose:</span>
                                <span className="value">{req.purpose}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Property Type:</span>
                                <span className="value">{req.sub_category}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Location:</span>
                                <span className="value">{req.emirate}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Bedrooms:</span>
                                <span className="value">{req.bedrooms}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Budget:</span>
                                <span className="value">
                                    {formatCurrency(req.min_budget)} - {formatCurrency(req.max_budget)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Contact:</span>
                                <span className="value">{req.phone}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Submitted:</span>
                                <span className="value">{formatDate(req.created_at)}</span>
                            </div>
                        </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedRequirement && (
                <div className="modal-overlay" onClick={() => setSelectedRequirement(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedRequirement(null)}>×</button>
                        
                        <h2>Buyer Requirement Details</h2>
                        
                        <div className="modal-section">
                            <h3>Contact Information</h3>
                            <p><strong>Name:</strong> {selectedRequirement.name}</p>
                            <p><strong>Email:</strong> {selectedRequirement.email}</p>
                            <p><strong>Phone:</strong> {selectedRequirement.phone}</p>
                        </div>

                        <div className="modal-section">
                            <h3>Property Requirements</h3>
                            <p><strong>Purpose:</strong> {selectedRequirement.purpose}</p>
                            <p><strong>Category:</strong> {selectedRequirement.category}</p>
                            <p><strong>Sub Category:</strong> {selectedRequirement.sub_category}</p>
                            <p><strong>Bedrooms:</strong> {selectedRequirement.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {selectedRequirement.bathrooms}</p>
                            {selectedRequirement.min_size_sqft && (
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
                            <h3>Budget & Timeline</h3>
                            <p><strong>Budget Range:</strong> {formatCurrency(selectedRequirement.min_budget)} - {formatCurrency(selectedRequirement.max_budget)}</p>
                            {selectedRequirement.payment_method && (
                                <p><strong>Payment Method:</strong> {selectedRequirement.payment_method}</p>
                            )}
                            {selectedRequirement.move_in_date && (
                                <p><strong>Move-in Date:</strong> {formatDate(selectedRequirement.move_in_date)}</p>
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
                            <p><strong>Status:</strong> {selectedRequirement.status || 'New'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerRequirements;
