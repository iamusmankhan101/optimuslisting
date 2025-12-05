import React, { useState } from 'react';
import './MultiStepForm.css';

// API endpoint
const API_BASE = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : '/api');

function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(1);
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
        property_images: '',
        documents: '',
        agent_code: '',
        agent_name: '',
        agent_mobile: '',
        agent_email: '',
        agent_agency: ''
    });
    const [propertyImages, setPropertyImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const steps = [
        { number: 1, title: 'PROPERTY INFO', subtitle: 'Basic information and source' },
        { number: 2, title: 'PRICING', subtitle: 'Classification and pricing details' },
        { number: 3, title: 'LOCATION', subtitle: 'Property location and identification' },
        { number: 4, title: 'SPECIFICATIONS', subtitle: 'Features, viewing & file uploads' },
        { number: 5, title: 'AGENT DETAILS', subtitle: 'Agent information' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Helper function to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve({
                    name: file.name,
                    data: base64,
                    mimeType: file.type,
                    size: file.size
                });
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            let driveUrls = { images: [], documents: [] };
            
            // Upload files to Google Drive if any (optional, won't block submission)
            if (propertyImages.length > 0 || documents.length > 0) {
                try {
                    setStatus({ type: 'info', message: 'Uploading files to Google Drive...' });
                    
                    const driveUploadUrl = process.env.REACT_APP_GOOGLE_DRIVE_UPLOAD_URL;
                    
                    if (!driveUploadUrl || driveUploadUrl.includes('YOUR_DEPLOYMENT_ID')) {
                        console.warn('Google Drive upload URL not configured, skipping file upload');
                        formData.property_images = propertyImages.map(f => f.name).join(', ');
                        formData.documents = documents.map(f => f.name).join(', ');
                    } else {
                        // Convert files to base64
                        const imageFiles = await Promise.all(propertyImages.map(fileToBase64));
                        const documentFiles = await Promise.all(documents.map(fileToBase64));
                        
                        const driveResponse = await fetch(driveUploadUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                property_code: formData.property_code || 'NO_CODE',
                                property_images: imageFiles,
                                documents: documentFiles
                            })
                        });
                        
                        const driveData = await driveResponse.json();
                        
                        if (driveData.success) {
                            driveUrls = {
                                folderUrl: driveData.folderUrl,
                                images: driveData.files.filter(f => f.type === 'image').map(f => f.url),
                                documents: driveData.files.filter(f => f.type === 'document').map(f => f.url)
                            };
                            
                            // Update formData with Drive URLs
                            formData.property_images = driveUrls.images.join(', ');
                            formData.documents = driveUrls.documents.join(', ');
                        } else {
                            console.warn('Google Drive upload failed:', driveData.error);
                            // Store file names instead
                            formData.property_images = propertyImages.map(f => f.name).join(', ');
                            formData.documents = documents.map(f => f.name).join(', ');
                        }
                    }
                } catch (driveError) {
                    console.error('Google Drive upload error:', driveError);
                    // Continue with submission, just store file names
                    formData.property_images = propertyImages.map(f => f.name).join(', ');
                    formData.documents = documents.map(f => f.name).join(', ');
                }
            }
            
            setStatus({ type: 'info', message: 'Submitting property listing...' });
            
            console.log('Submitting to:', `${API_BASE}/submit`);
            
            const response = await fetch(`${API_BASE}/submit`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.success) {
                let successMessage = 'Property listing submitted successfully!';
                if (driveUrls.images.length > 0 || driveUrls.documents.length > 0) {
                    successMessage += ` ${driveUrls.images.length + driveUrls.documents.length} files uploaded to Google Drive.`;
                }
                setStatus({ type: 'success', message: successMessage });
                setFormData({
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
                    property_images: '',
                    documents: '',
                    agent_code: '',
                    agent_name: '',
                    agent_mobile: '',
                    agent_email: '',
                    agent_agency: ''
                });
                setPropertyImages([]);
                setDocuments([]);
                setCurrentStep(1);
            } else {
                setStatus({ type: 'error', message: data.error || 'Submission failed' });
            }
        } catch (error) {
            const errorMsg = window.location.hostname === 'localhost' 
                ? `Network error: ${error.message}. Ensure backend is running on http://localhost:8000`
                : `Network error: ${error.message}. Please check your internet connection.`;
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="form-section">
                            <div className="form-section-title">Basic Information :</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Email <span className="required">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                                </div>
                                <div className="form-group">
                                    <label>Source of Listing</label>
                                    <input type="text" name="source_of_listing" value={formData.source_of_listing} onChange={handleChange} placeholder="Enter listing source" />
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <div className="form-section">
                            <div className="form-section-title">Property Classification :</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category <span className="required">*</span></label>
                                    <select name="category" value={formData.category} onChange={handleChange}>
                                        <option value="">Select category</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Sub Category <span className="required">*</span></label>
                                    <select name="sub_category" value={formData.sub_category} onChange={handleChange}>
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
                            <div className="form-group">
                                <label>Purpose <span className="required">*</span></label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange}>
                                    <option value="">Select purpose</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Sale">Sale</option>
                                </select>
                            </div>
                        </div>
                        {(formData.purpose === 'Sale' || formData.purpose === 'Both') && (
                            <div className="form-section">
                                <div className="form-section-title">Sales Details :</div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Sale Price (AED) <span className="required">*</span></label>
                                        <input type="text" name="sale_price" value={formData.sale_price} onChange={handleChange} placeholder="Enter sale price" />
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Status <span className="required">*</span></label>
                                        <select name="unit_status" value={formData.unit_status} onChange={handleChange}>
                                            <option value="">Select status</option>
                                            <option value="Owner Occupied">Owner Occupied</option>
                                            <option value="Vacant">Vacant</option>
                                            <option value="Rented">Rented</option>
                                            <option value="Vacant on Transfer">Vacant on Transfer</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Rented Details</label>
                                        <input type="text" name="rented_details" value={formData.rented_details} onChange={handleChange} placeholder="Enter rented details" />
                                    </div>
                                    <div className="form-group">
                                        <label>Notice Given</label>
                                        <select name="notice_given" value={formData.notice_given} onChange={handleChange}>
                                            <option value="">Select option</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Agent Commission</label>
                                    <select name="sales_agent_commission" value={formData.sales_agent_commission} onChange={handleChange}>
                                        <option value="">Select option</option>
                                        <option value="Covered">Covered</option>
                                        <option value="Not Covered">Not Covered</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {(formData.purpose === 'Rent' || formData.purpose === 'Both') && (
                            <div className="form-section">
                                <div className="form-section-title">Rent Details :</div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Asking Rent (AED) <span className="required">*</span></label>
                                        <input type="text" name="asking_rent" value={formData.asking_rent} onChange={handleChange} placeholder="Enter asking rent" />
                                    </div>
                                    <div className="form-group">
                                        <label>Number of Cheques <span className="required">*</span></label>
                                        <select name="number_of_chq" value={formData.number_of_chq} onChange={handleChange}>
                                            <option value="">Select number of cheques</option>
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
                                        <label>Security Deposit (AED)</label>
                                        <input type="text" name="security_deposit" value={formData.security_deposit} onChange={handleChange} placeholder="Enter security deposit" />
                                    </div>
                                    <div className="form-group">
                                        <label>Agent Commission (%)</label>
                                        <input type="text" name="rent_agent_commission" value={formData.rent_agent_commission} onChange={handleChange} placeholder="Enter commission percentage" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );

            case 3:
                return (
                    <>
                        <div className="form-section">
                            <div className="form-section-title">Property Identification :</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Property Code <span className="required">*</span></label>
                                    <input type="text" name="property_code" value={formData.property_code} onChange={handleChange} placeholder="Enter property code" />
                                </div>
                                <div className="form-group">
                                    <label>Emirate <span className="required">*</span></label>
                                    <select name="emirate" value={formData.emirate} onChange={handleChange}>
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
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Area / Community <span className="required">*</span></label>
                                    <input type="text" name="area_community" value={formData.area_community} onChange={handleChange} placeholder="Enter area or community" />
                                </div>
                                <div className="form-group">
                                    <label>Building Name / Villa Community <span className="required">*</span></label>
                                    <input type="text" name="building_name" value={formData.building_name} onChange={handleChange} placeholder="Enter building or villa community name" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Unit Number / Villa Number <span className="required">*</span></label>
                                    <input type="text" name="unit_number" value={formData.unit_number} onChange={handleChange} placeholder="Enter unit or villa number" />
                                </div>
                                <div className="form-group">
                                    <label>Google Pin (URL)</label>
                                    <input type="url" name="google_pin" value={formData.google_pin} onChange={handleChange} placeholder="https://maps.google.com/..." />
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 4:
                return (
                    <>
                        <div className="form-section">
                            <div className="form-section-title">Property Specifications :</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Bedrooms <span className="required">*</span></label>
                                    <select name="bedrooms" value={formData.bedrooms} onChange={handleChange}>
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
                                    <select name="bathrooms" value={formData.bathrooms} onChange={handleChange}>
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
                                    <label>Size (Sq. Ft) <span className="required">*</span></label>
                                    <input type="text" name="size_sqft" value={formData.size_sqft} onChange={handleChange} placeholder="Enter size in square feet" />
                                </div>
                                <div className="form-group">
                                    <label>Maid Room <span className="required">*</span></label>
                                    <select name="maid_room" value={formData.maid_room} onChange={handleChange}>
                                        <option value="">Select option</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Furnishing <span className="required">*</span></label>
                                    <select name="furnishing" value={formData.furnishing} onChange={handleChange}>
                                        <option value="">Select furnishing</option>
                                        <option value="Furnished">Furnished</option>
                                        <option value="Unfurnished">Unfurnished</option>
                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Condition <span className="required">*</span></label>
                                    <select name="property_condition" value={formData.property_condition} onChange={handleChange}>
                                        <option value="">Select condition</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Average">Average</option>
                                        <option value="Needs Renovation">Needs Renovation</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-section">
                            <div className="form-section-title">Viewing & Status :</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Keys Status <span className="required">*</span></label>
                                    <select name="keys_status" value={formData.keys_status} onChange={handleChange}>
                                        <option value="">Select keys status</option>
                                        <option value="With Agent">With Agent</option>
                                        <option value="Opened">Opened</option>
                                        <option value="At Reception">At Reception</option>
                                        <option value="Under Matt">Under Matt</option>
                                        <option value="With Owner">With Owner</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Viewing Status <span className="required">*</span></label>
                                    <select name="viewing_status" value={formData.viewing_status} onChange={handleChange}>
                                        <option value="">Choose</option>
                                        <option value="Easy / Direct Access">Easy / Direct Access</option>
                                        <option value="24 Hours- Notice">24 Hours- Notice</option>
                                        <option value="Tenant Occupied">Tenant Occupied</option>
                                        <option value="Vacant">Vacant</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>More Information About Property</label>
                                <textarea name="more_information" rows="3" value={formData.more_information} onChange={handleChange} placeholder="Enter additional property details" />
                            </div>
                            <div className="form-group">
                                <label>Upload Property Images</label>
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf" 
                                    multiple 
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files).slice(0, 10);
                                        setPropertyImages(files);
                                        setFormData({...formData, property_images: files.map(f => f.name).join(', ')});
                                    }}
                                />
                                <small style={{display: 'block', marginTop: '5px', color: '#666'}}>
                                    Upload up to 10 supported files: PDF, document, or image. Max 10 MB per file.
                                </small>
                                {propertyImages.length > 0 && (
                                    <div style={{marginTop: '10px'}}>
                                        <strong>Selected files ({propertyImages.length}):</strong>
                                        <ul style={{marginTop: '5px', paddingLeft: '20px'}}>
                                            {propertyImages.map((file, idx) => (
                                                <li key={idx}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Add Documents / More Pictures</label>
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf,.doc,.docx" 
                                    multiple 
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files).slice(0, 10);
                                        setDocuments(files);
                                        setFormData({...formData, documents: files.map(f => f.name).join(', ')});
                                    }}
                                />
                                <small style={{display: 'block', marginTop: '5px', color: '#666'}}>
                                    Upload up to 10 supported files: PDF, document, or image. Max 10 MB per file.
                                </small>
                                {documents.length > 0 && (
                                    <div style={{marginTop: '10px'}}>
                                        <strong>Selected files ({documents.length}):</strong>
                                        <ul style={{marginTop: '5px', paddingLeft: '20px'}}>
                                            {documents.map((file, idx) => (
                                                <li key={idx}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );

            case 5:
                return (
                    <>
                        <div className="form-section">
                            <div className="form-section-title">Agent & Source Details :</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Agent Code <span className="required">*</span></label>
                                    <input type="text" name="agent_code" value={formData.agent_code} onChange={handleChange} placeholder="Enter agent code" />
                                </div>
                                <div className="form-group">
                                    <label>Agent Name <span className="required">*</span></label>
                                    <input type="text" name="agent_name" value={formData.agent_name} onChange={handleChange} placeholder="Enter agent name" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Agent Mobile Number <span className="required">*</span></label>
                                    <input type="tel" name="agent_mobile" value={formData.agent_mobile} onChange={handleChange} placeholder="Enter mobile number" />
                                </div>
                                <div className="form-group">
                                    <label>Agent Email <span className="required">*</span></label>
                                    <input type="email" name="agent_email" value={formData.agent_email} onChange={handleChange} placeholder="Enter email address" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Agent Agency <span className="required">*</span></label>
                                <input type="text" name="agent_agency" value={formData.agent_agency} onChange={handleChange} placeholder="Enter agency name" />
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="multistep-container">
            <div className="top-header">
                <div className="header-logo">
                    <img src="/images/Logo-v1-white-background-1-2-2048x624-1-1-1024x312 (1).webp" alt="Optimus Logo" className="logo-image" />
                </div>
            </div>



            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 className="page-title">Property Listing</h1>
                    <a href="/buyer" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Looking to Buy/Rent? Click Here
                    </a>
                </div>

                <div className="stepper-container">
                    <div className="stepper-line">
                        <div className="stepper-progress" style={{ width: `${progressWidth}%` }}></div>
                    </div>
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                        >
                            <div className="step-circle">
                                {currentStep > step.number ? '✓' : step.number}
                            </div>
                            <div className="step-label">{step.title}</div>
                        </div>
                    ))}
                </div>

                <div className="form-card">
                    <div className="section-title">{steps[currentStep - 1].title}</div>
                    <div className="required-note"><span>*</span> are required fields</div>

                    {renderStepContent()}

                    {status.message && (
                        <div className={`status ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="form-actions">
                        {currentStep > 1 && (
                            <button className="back-btn" onClick={prevStep}>
                                ← Back
                            </button>
                        )}
                        {currentStep < steps.length ? (
                            <button className="next-btn" onClick={nextStep}>
                                Continue →
                            </button>
                        ) : (
                            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Listing →'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer">
                © OPTIMUS PROPERTIES. ALL RIGHTS RESERVED.
            </div>
        </div>
    );
}

export default MultiStepForm;
