import React, { useState } from 'react';
import './Form.css';

const API_BASES = ['/backend', 'http://localhost:8000/backend', 'http://localhost/backend'];

function Form() {
    const [formData, setFormData] = useState({
        email: '',
        source_of_listing: '',
        category: '',
        sub_category: '',
        purpose: '',
        property_code: '',
        emirate: '',
        area_community: '',
        building_name: '',
        unit_number: '',
        google_pin: '',
        bedrooms: '',
        bathrooms: '',
        size_sqft: '',
        maid_room: '',
        furnishing: '',
        property_condition: '',
        sale_price: '',
        unit_status: '',
        rented_details: '',
        notice_given: '',
        sales_agent_commission: '',
        asking_rent: '',
        number_of_chq: '',
        security_deposit: '',
        rent_agent_commission: '',
        keys_status: '',
        viewing_status: '',
        more_information: '',
        agent_code: '',
        agent_name: '',
        agent_mobile: '',
        agent_email: '',
        agent_agency: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            let submission = null;
            for (const base of API_BASES) {
                try {
                    const response = await fetch(`${base}/submit.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    if (!response.ok) continue;
                    const data = await response.json();
                    submission = data;
                    break;
                } catch (err) {
                    continue;
                }
            }

            if (!submission) throw new Error('All endpoints failed');

            if (submission.success) {
                setStatus({ type: 'success', message: 'Property listing submitted successfully!' });
            } else {
                setStatus({ type: 'error', message: submission.error || 'Submission failed' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Network error. Please ensure your backend is running on http://localhost (Apache/XAMPP) or http://localhost:8000 (PHP CLI).' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Property Listing Form</h2>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="source_of_listing">1. Source of Listing</label>
                    <input type="text" id="source_of_listing" name="source_of_listing" value={formData.source_of_listing} onChange={handleChange} />
                </div>

                <div className="section-header">🔹 Section 1 — Property Classification</div>

                <div className="form-group">
                    <label htmlFor="category">2. Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="sub_category">3. Sub Category</label>
                    <select id="sub_category" name="sub_category" value={formData.sub_category} onChange={handleChange}>
                        <option value="">Select Sub Category</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Office">Office</option>
                        <option value="Shop">Shop</option>
                        <option value="Warehouse">Warehouse</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="purpose">4. Purpose</label>
                    <select id="purpose" name="purpose" value={formData.purpose} onChange={handleChange}>
                        <option value="">Select Purpose</option>
                        <option value="Sale">Sale</option>
                        <option value="Rent">Rent</option>
                    </select>
                </div>

                <div className="section-header">🔹 Section 2 — Property Identification</div>

                <div className="form-group">
                    <label htmlFor="property_code">5. Property Code</label>
                    <input type="text" id="property_code" name="property_code" value={formData.property_code} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="emirate">6. Emirate</label>
                    <select id="emirate" name="emirate" value={formData.emirate} onChange={handleChange}>
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
                    <label htmlFor="area_community">7. Area / Community</label>
                    <input type="text" id="area_community" name="area_community" value={formData.area_community} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="building_name">8. Building Name / Villa Community</label>
                    <input type="text" id="building_name" name="building_name" value={formData.building_name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="unit_number">9. Unit Number / Villa Number</label>
                    <input type="text" id="unit_number" name="unit_number" value={formData.unit_number} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="google_pin">10. Google Pin (URL)</label>
                    <input type="url" id="google_pin" name="google_pin" value={formData.google_pin} onChange={handleChange} placeholder="https://maps.google.com/..." />
                </div>

                <div className="section-header">🔹 Section 3 — Property Specifications</div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="bedrooms">11. Bedrooms</label>
                        <select id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange}>
                            <option value="">Select</option>
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
                        <label htmlFor="bathrooms">12. Bathrooms</label>
                        <select id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange}>
                            <option value="">Select</option>
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
                        <label htmlFor="size_sqft">13. Size Sq. Ft</label>
                        <input type="text" id="size_sqft" name="size_sqft" value={formData.size_sqft} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maid_room">14. Maid Room (Y/N)</label>
                        <select id="maid_room" name="maid_room" value={formData.maid_room} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="furnishing">15. Furnishing</label>
                        <select id="furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Furnished">Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="property_condition">16. Condition</label>
                        <select id="property_condition" name="property_condition" value={formData.property_condition} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Needs Renovation">Needs Renovation</option>
                        </select>
                    </div>
                </div>

                {formData.purpose === 'Sale' && (
                    <>
                        <div className="section-header">Sales Details</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="sale_price">17. Sale Price</label>
                                <input type="text" id="sale_price" name="sale_price" value={formData.sale_price} onChange={handleChange} placeholder="AED" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="unit_status">18. Unit Status</label>
                                <select id="unit_status" name="unit_status" value={formData.unit_status} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Vacant">Vacant</option>
                                    <option value="Occupied">Occupied</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="rented_details">19. Rented details</label>
                            <input type="text" id="rented_details" name="rented_details" value={formData.rented_details} onChange={handleChange} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="notice_given">20. Notice Given</label>
                                <input type="text" id="notice_given" name="notice_given" value={formData.notice_given} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sales_agent_commission">21. Agent Commission</label>
                                <input type="text" id="sales_agent_commission" name="sales_agent_commission" value={formData.sales_agent_commission} onChange={handleChange} placeholder="%" />
                            </div>
                        </div>
                    </>
                )}

                {formData.purpose === 'Rent' && (
                    <>
                        <div className="section-header">Rent Details</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="asking_rent">17. Asking Rent</label>
                                <input type="text" id="asking_rent" name="asking_rent" value={formData.asking_rent} onChange={handleChange} placeholder="AED" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="number_of_chq">18. Number of Chq</label>
                                <select id="number_of_chq" name="number_of_chq" value={formData.number_of_chq} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="6">6</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="security_deposit">19. Security Deposit</label>
                                <input type="text" id="security_deposit" name="security_deposit" value={formData.security_deposit} onChange={handleChange} placeholder="AED" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="rent_agent_commission">20. Agent Commission</label>
                                <input type="text" id="rent_agent_commission" name="rent_agent_commission" value={formData.rent_agent_commission} onChange={handleChange} placeholder="%" />
                            </div>
                        </div>
                    </>
                )}

                <div className="section-header">🔹 Section 4 — Viewing & Status</div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="keys_status">26. Keys Status</label>
                        <select id="keys_status" name="keys_status" value={formData.keys_status} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                            <option value="With Owner">With Owner</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="viewing_status">27. Viewing Status</label>
                        <select id="viewing_status" name="viewing_status" value={formData.viewing_status} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Easy to View">Easy to View</option>
                            <option value="Appointment Required">Appointment Required</option>
                            <option value="Difficult">Difficult</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="more_information">28. More Information About Property</label>
                    <textarea id="more_information" name="more_information" rows="4" value={formData.more_information} onChange={handleChange} />
                </div>

                <div className="section-header">🔹 Section 5 — Agent & Source Details</div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="agent_code">Agent Code</label>
                        <input type="text" id="agent_code" name="agent_code" value={formData.agent_code} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="agent_name">Agent Name</label>
                        <input type="text" id="agent_name" name="agent_name" value={formData.agent_name} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="agent_mobile">Agent Mobile Number</label>
                        <input type="tel" id="agent_mobile" name="agent_mobile" value={formData.agent_mobile} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="agent_email">Agent Email</label>
                        <input type="email" id="agent_email" name="agent_email" value={formData.agent_email} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="agent_agency">Agent Agency</label>
                    <input type="text" id="agent_agency" name="agent_agency" value={formData.agent_agency} onChange={handleChange} />
                </div>

                {status.message && (
                    <div className={`status ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Property Listing'}
                </button>
            </form>
        </div>
    );
}

export default Form;
