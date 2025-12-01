import React, { useState } from 'react';
import './MultiStepForm.css';

const API_BASE = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : '/api');

function BuyerForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        purpose: '',
        category: '',
        sub_category: '',
        emirate: '',
        preferred_areas: '',
        bedrooms: '',
        bathrooms: '',
        min_size_sqft: '',
        max_size_sqft: '',
        maid_room: '',
        furnishing: '',
        min_budget: '',
        max_budget: '',
        payment_method: '',
        move_in_date: '',
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setStatus({ type: 'success', message: 'Requirements submitted successfully! We will contact you soon.' });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    purpose: '',
                    category: '',
                    sub_category: '',
                    emirate: '',
                    preferred_areas: '',
                    bedrooms: '',
                    bathrooms: '',
                    min_size_sqft: '',
                    max_size_sqft: '',
                    maid_room: '',
                    furnishing: '',
                    min_budget: '',
                    max_budget: '',
                    payment_method: '',
                    move_in_date: '',
                    additional_requirements: ''
                });
            } else {
                setStatus({ type: 'error', message: data.error || 'Submission failed' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="multi-step-form">
            <div className="form-header" style={{ position: 'relative' }}>
                <a href="/" style={{ 
                    position: 'absolute', 
                    left: '20px', 
                    top: '20px',
                    padding: '8px 16px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '5px',
                    fontSize: '14px'
                }}>
                    ← List Property
                </a>
                <h1>Property Requirements</h1>
                <p>Tell us what you're looking for</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    {/* Contact Information */}
                    <div className="form-section">
                        <div className="form-section-title">Contact Information :</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter your full name" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email <span className="required">*</span></label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="Enter email address" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number <span className="required">*</span></label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="Enter phone number" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Property Type */}
                    <div className="form-section">
                        <div className="form-section-title">Property Type :</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Purpose <span className="required">*</span></label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange} required>
                                    <option value="">Select purpose</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Buy">Buy</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Category <span className="required">*</span></label>
                                <select name="category" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select category</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
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

                    {/* Location Preferences */}
                    <div className="form-section">
                        <div className="form-section-title">Location Preferences :</div>
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
                            <label>Preferred Areas / Communities</label>
                            <textarea 
                                name="preferred_areas" 
                                value={formData.preferred_areas} 
                                onChange={handleChange} 
                                placeholder="e.g., Dubai Marina, Downtown Dubai, JBR..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Property Specifications */}
                    <div className="form-section">
                        <div className="form-section-title">Property Specifications :</div>
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
                        <div className="form-row">
                            <div className="form-group">
                                <label>Min Size (Sq. Ft)</label>
                                <input 
                                    type="number" 
                                    name="min_size_sqft" 
                                    value={formData.min_size_sqft} 
                                    onChange={handleChange} 
                                    placeholder="Minimum size" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Max Size (Sq. Ft)</label>
                                <input 
                                    type="number" 
                                    name="max_size_sqft" 
                                    value={formData.max_size_sqft} 
                                    onChange={handleChange} 
                                    placeholder="Maximum size" 
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Maid Room</label>
                                <select name="maid_room" value={formData.maid_room} onChange={handleChange}>
                                    <option value="">Select option</option>
                                    <option value="Required">Required</option>
                                    <option value="Not Required">Not Required</option>
                                    <option value="Preferred">Preferred</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Furnishing</label>
                                <select name="furnishing" value={formData.furnishing} onChange={handleChange}>
                                    <option value="">Select furnishing</option>
                                    <option value="Furnished">Furnished</option>
                                    <option value="Unfurnished">Unfurnished</option>
                                    <option value="Semi-Furnished">Semi-Furnished</option>
                                    <option value="Any">Any</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="form-section">
                        <div className="form-section-title">Budget :</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Min Budget (AED) <span className="required">*</span></label>
                                <input 
                                    type="number" 
                                    name="min_budget" 
                                    value={formData.min_budget} 
                                    onChange={handleChange} 
                                    placeholder="Minimum budget" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Max Budget (AED) <span className="required">*</span></label>
                                <input 
                                    type="number" 
                                    name="max_budget" 
                                    value={formData.max_budget} 
                                    onChange={handleChange} 
                                    placeholder="Maximum budget" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="form-row">
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
                                <label>Preferred Move-in Date</label>
                                <input 
                                    type="date" 
                                    name="move_in_date" 
                                    value={formData.move_in_date} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Requirements */}
                    <div className="form-section">
                        <div className="form-section-title">Additional Requirements :</div>
                        <div className="form-group">
                            <label>Additional Information</label>
                            <textarea 
                                name="additional_requirements" 
                                value={formData.additional_requirements} 
                                onChange={handleChange} 
                                placeholder="Any specific requirements, amenities, or preferences..."
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* Status Message */}
                    {status.message && (
                        <div className={`status-message ${status.type}`}>
                            {status.message}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="form-navigation">
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Requirements'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BuyerForm;
