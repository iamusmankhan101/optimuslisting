import React, { useState } from 'react';
import './MultiStepForm.css';
import MatchingProperties from './MatchingProperties';

const API_BASE = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8001' 
    : '/api');

function BuyerFormSingle() {
    const [showResults, setShowResults] = useState(false);
    const [matchingProperties, setMatchingProperties] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        sub_category: '',
        emirate: '',
        preferred_areas: '',
        bedrooms: '',
        bathrooms: '',
        min_budget: '',
        payment_method: '',
        additional_requirements: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_BASE}/buyer-requirements`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const savedFormData = { ...formData };
                setStatus({ type: 'info', message: 'Finding matching properties...' });
                
                try {
                    const matchResponse = await fetch(`${API_BASE}/match-properties`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(savedFormData)
                    });

                    if (matchResponse.ok) {
                        const matchData = await matchResponse.json();
                        if (matchData.success) {
                            setMatchingProperties(matchData.matches || []);
                            setShowResults(true);
                            return;
                        }
                    }
                } catch (matchError) {
                    console.log('Property matching error:', matchError);
                }
                
                setStatus({ type: 'success', message: 'Requirements submitted successfully! We will contact you soon.' });
                setFormData({
                    name: '', email: '', phone: '', category: '', sub_category: '',
                    emirate: '', preferred_areas: '', bedrooms: '', bathrooms: '',
                    min_budget: '', payment_method: '', additional_requirements: ''
                });
            } else {
                setStatus({ type: 'error', message: data.error || 'Submission failed' });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus({ type: 'error', message: `Error: ${error.message}. Please try again.` });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToForm = () => {
        setShowResults(false);
        setMatchingProperties([]);
        setFormData({
            name: '', email: '', phone: '', category: '', sub_category: '',
            emirate: '', preferred_areas: '', bedrooms: '', bathrooms: '',
            min_budget: '', payment_method: '', additional_requirements: ''
        });
        setStatus({ type: '', message: '' });
    };

    if (showResults) {
        return (
            <MatchingProperties 
                properties={matchingProperties} 
                requirements={formData}
                onBack={handleBackToForm}
            />
        );
    }

    return (
        <div className="multistep-container">
            <div className="top-header">
                <div className="header-logo">
                    <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312 (1).webp" alt="Optimus Logo" className="logo-image" />
                </div>
            </div>

            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 className="page-title">Buyer Requirements</h1>
                    <a href="/" className="btn-secondary" style={{ 
                        textDecoration: 'none',
                        backgroundColor: '#0a4c7b',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none'
                    }}>
                        List Property Instead
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name <span className="required">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
                            </div>
                            <div className="form-group">
                                <label>Email <span className="required">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number <span className="required">*</span></label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-group">
                            <label>Category <span className="required">*</span></label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select category</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Sub Category <span className="required">*</span></label>
                            <select name="sub_category" value={formData.sub_category} onChange={handleChange} required>
                                <option value="">Select sub category</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Townhouse">Townhouse</option>
                                <option value="Penthouse">Penthouse</option>
                                <option value="Office">Office</option>
                                <option value="Shop">Shop</option>
                                <option value="Warehouse">Warehouse</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Emirate <span className="required">*</span></label>
                                <select name="emirate" value={formData.emirate} onChange={handleChange} required>
                                    <option value="">Select Emirate</option>
                                    <option value="Dubai">Dubai</option>
                                    <option value="Abu Dhabi">Abu Dhabi</option>
                                    <option value="Sharjah">Sharjah</option>
                                    <option value="Ajman">Ajman</option>
                                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                                    <option value="Fujairah">Fujairah</option>
                                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Preferred Areas</label>
                                <input type="text" name="preferred_areas" value={formData.preferred_areas} onChange={handleChange} placeholder="e.g., Dubai Marina, Downtown..." />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Bedrooms <span className="required">*</span></label>
                                <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} required>
                                    <option value="">Select bedrooms</option>
                                    <option value="Studio">Studio</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6+">6+</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Bathrooms <span className="required">*</span></label>
                                <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} required>
                                    <option value="">Select bathrooms</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5+">5+</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="form-section">
                        <div className="form-group">
                            <label>Budget (AED) <span className="required">*</span></label>
                            <input type="number" name="min_budget" value={formData.min_budget} onChange={handleChange} placeholder="Enter budget" required />
                        </div>
                        <div className="form-group">
                            <label>Payment Method</label>
                            <select name="payment_method" value={formData.payment_method} onChange={handleChange}>
                                <option value="">Select payment method</option>
                                <option value="Cash">Cash</option>
                                <option value="Mortgage">Mortgage</option>
                                <option value="Installment">Installment</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Additional Requirements</label>
                            <textarea 
                                name="additional_requirements" 
                                value={formData.additional_requirements} 
                                onChange={handleChange} 
                                placeholder="Any specific requirements, amenities, or preferences..."
                                rows="4"
                            />
                        </div>
                    </div>

                    {status.message && (
                        <div className={`status-message ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="form-navigation">
                        <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Submitting...' : 'Submit Requirements'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BuyerFormSingle;
