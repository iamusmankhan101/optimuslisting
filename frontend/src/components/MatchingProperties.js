import React from 'react';
import './AdminJobs.css';

function MatchingProperties({ properties, requirements, onBack }) {
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        const numAmount = typeof amount === 'string' ? amount.replace(/[^0-9]/g, '') : amount;
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0
        }).format(numAmount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="multistep-container">
            <div className="top-header">
                <div className="header-logo">
                    <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312 (1).webp" alt="Optimus Logo" className="logo-image" />
                </div>
            </div>

            <div className="main-content">
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h1 className="page-title">Matching Properties</h1>
                            <p style={{ color: '#666', marginTop: '10px' }}>
                                Found {properties.length} properties matching your requirements
                            </p>
                        </div>
                        <button onClick={onBack} className="btn-secondary">
                            ← Back to Search
                        </button>
                    </div>

                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Your Requirements:</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
                            <div><strong>Purpose:</strong> {requirements.purpose}</div>
                            <div><strong>Location:</strong> {requirements.emirate}</div>
                            <div><strong>Bedrooms:</strong> {requirements.bedrooms}+</div>
                            <div><strong>Bathrooms:</strong> {requirements.bathrooms}+</div>
                            {requirements.min_size_sqft && requirements.max_size_sqft && (
                                <div><strong>Size:</strong> {requirements.min_size_sqft} - {requirements.max_size_sqft} sq.ft</div>
                            )}
                            <div><strong>Budget:</strong> {formatCurrency(requirements.min_budget)} - {formatCurrency(requirements.max_budget)}</div>
                        </div>
                    </div>
                </div>

                {properties.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <h2 style={{ color: '#666', marginBottom: '10px' }}>No Matching Properties Found</h2>
                        <p style={{ color: '#999' }}>
                            We don't have any properties matching your exact requirements at the moment.
                            <br />
                            Try adjusting your search criteria or check back later.
                        </p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {properties.map((property) => (
                            <div key={property.id} className="job-card">
                                <div className="job-header">
                                    <h3>{property.sub_category} in {property.area_community}</h3>
                                    <span className="status-badge new">
                                        {property.purpose}
                                    </span>
                                </div>
                                
                                <div className="job-details">
                                    <div className="detail-row">
                                        <span className="label">Property Code:</span>
                                        <span className="value">{property.property_code || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Location:</span>
                                        <span className="value">{property.emirate} - {property.area_community}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Building:</span>
                                        <span className="value">{property.building_name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Bedrooms:</span>
                                        <span className="value">{property.bedrooms}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Bathrooms:</span>
                                        <span className="value">{property.bathrooms}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Size:</span>
                                        <span className="value">{property.size_sqft} sq.ft</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Furnishing:</span>
                                        <span className="value">{property.furnishing}</span>
                                    </div>
                                    {property.maid_room === 'Yes' && (
                                        <div className="detail-row">
                                            <span className="label">Maid Room:</span>
                                            <span className="value">✓ Yes</span>
                                        </div>
                                    )}
                                    <div className="detail-row" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                                        <span className="label">
                                            {property.purpose === 'Sale' || property.purpose === 'Both' ? 'Sale Price:' : 'Rent:'}
                                        </span>
                                        <span className="value" style={{ fontWeight: 'bold', color: '#007bff' }}>
                                            {property.purpose === 'Sale' || property.purpose === 'Both' 
                                                ? formatCurrency(property.sale_price)
                                                : formatCurrency(property.asking_rent)}
                                        </span>
                                    </div>
                                    {property.purpose === 'Both' && property.asking_rent && (
                                        <div className="detail-row">
                                            <span className="label">Rent:</span>
                                            <span className="value" style={{ fontWeight: 'bold', color: '#28a745' }}>
                                                {formatCurrency(property.asking_rent)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span className="label">Listed:</span>
                                        <span className="value">{formatDate(property.created_at)}</span>
                                    </div>
                                    {property.agent_name && (
                                        <div className="detail-row" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                                            <span className="label">Agent:</span>
                                            <span className="value">{property.agent_name}</span>
                                        </div>
                                    )}
                                    {property.agent_mobile && (
                                        <div className="detail-row">
                                            <span className="label">Contact:</span>
                                            <span className="value">
                                                <a href={`tel:${property.agent_mobile}`} style={{ color: '#007bff' }}>
                                                    {property.agent_mobile}
                                                </a>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MatchingProperties;
