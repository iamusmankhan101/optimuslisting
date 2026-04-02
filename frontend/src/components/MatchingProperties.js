import React from 'react';
import './MatchingProperties.css';

function MatchingProperties({ properties, requirements, onBack }) {
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        const numAmount = typeof amount === 'string' ? amount.replace(/[^0-9]/g, '') : amount;
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
        <div className="matching-container">
            <div className="matching-header">
                <div className="header-logo">
                    <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312 (1).webp" alt="Optimus Logo" className="logo-image" />
                </div>
            </div>

            <div className="matching-content">
                <div className="results-header">
                    <div>
                        <h1 className="results-title">🏠 Matching Properties</h1>
                        <p className="results-subtitle">
                            Found <strong>{properties.length}</strong> {properties.length === 1 ? 'property' : 'properties'} matching your requirements
                        </p>
                    </div>
                    <button onClick={onBack} className="btn-back">
                        ← New Search
                    </button>
                </div>

                <div className="requirements-summary">
                    <h3>📋 Your Requirements</h3>
                    <div className="requirements-grid">
                        <div className="req-item">
                            <span className="req-label">Purpose</span>
                            <span className="req-value">{requirements.purpose}</span>
                        </div>
                        <div className="req-item">
                            <span className="req-label">Location</span>
                            <span className="req-value">{requirements.emirate}</span>
                        </div>
                        <div className="req-item">
                            <span className="req-label">Bedrooms</span>
                            <span className="req-value">{requirements.bedrooms}+</span>
                        </div>
                        <div className="req-item">
                            <span className="req-label">Bathrooms</span>
                            <span className="req-value">{requirements.bathrooms}+</span>
                        </div>
                        <div className="req-item">
                            <span className="req-label">Budget Range</span>
                            <span className="req-value">{formatCurrency(requirements.min_budget)} - {formatCurrency(requirements.max_budget)}</span>
                        </div>
                    </div>
                </div>

                {properties.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h2>No Matching Properties Found</h2>
                        <p>
                            We couldn't find any properties matching your exact requirements at the moment.
                            <br />
                            Try adjusting your search criteria or check back later for new listings.
                        </p>
                    </div>
                ) : (
                    <div className="properties-grid">
                        {properties.map((property) => {
                            const price = property.purpose === 'Sale' || property.purpose === 'Both' 
                                ? property.sale_price 
                                : property.asking_rent;
                            
                            return (
                                <div key={property.id} className="property-card">
                                    <div className="property-image">
                                        🏢
                                        <span className="property-badge">{property.purpose}</span>
                                    </div>
                                    
                                    <div className="property-content">
                                        <h3 className="property-title">
                                            {property.sub_category} in {property.area_community}
                                        </h3>
                                        
                                        <div className="property-location">
                                            📍 {property.emirate} - {property.building_name}
                                        </div>

                                        <div className="property-specs">
                                            <div className="spec-item">
                                                <span className="spec-value">🛏️ {property.bedrooms}</span>
                                                <span className="spec-label">Bedrooms</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-value">🚿 {property.bathrooms}</span>
                                                <span className="spec-label">Bathrooms</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="spec-value">📐 {property.size_sqft}</span>
                                                <span className="spec-label">Sq. Ft</span>
                                            </div>
                                        </div>

                                        <div className="property-price">
                                            {formatCurrency(price)}
                                        </div>

                                        <div className="property-features">
                                            <span className="feature-tag">{property.furnishing || 'Unfurnished'}</span>
                                            {property.maid_room === 'Yes' && (
                                                <span className="feature-tag">Maid Room</span>
                                            )}
                                            <span className="feature-tag">{property.property_condition || 'Good'}</span>
                                        </div>

                                        {property.agent_name && (
                                            <div className="property-agent">
                                                <div className="agent-name">
                                                    👤 {property.agent_name}
                                                </div>
                                                {property.agent_mobile && (
                                                    <div className="agent-contact">
                                                        <a 
                                                            href={`tel:${property.agent_mobile}`} 
                                                            className="contact-btn"
                                                        >
                                                            📞 Call
                                                        </a>
                                                        <a 
                                                            href={`https://wa.me/${property.agent_mobile.replace(/[^0-9]/g, '')}`} 
                                                            className="contact-btn"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            💬 WhatsApp
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
                                            Listed: {formatDate(property.created_at)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MatchingProperties;
