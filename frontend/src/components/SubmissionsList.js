import React, { useState, useEffect, useCallback } from 'react';
import './SubmissionsList.css';

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : '/api';

function SubmissionsList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [selectedListing, setSelectedListing] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, sortBy, order });
      const response = await fetch(`${API_BASE}/get?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, order]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
  };

  return (
    <div className="submissions-container">
      <h2>Property Listings</h2>
      
      <div className="controls">
        <input
          type="text"
          placeholder="Search by property code, emirate, area, building, or agent..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={fetchSubmissions} className="refresh-btn">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {sortBy === 'id' && (order === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('property_code')}>
                  Property Code {sortBy === 'property_code' && (order === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('emirate')}>
                  Emirate {sortBy === 'emirate' && (order === 'ASC' ? '↑' : '↓')}
                </th>
                <th>Area</th>
                <th>Building</th>
                <th>Type</th>
                <th>Bedrooms</th>
                <th>Purpose</th>
                <th>Price/Rent</th>
                <th>Agent</th>
                <th onClick={() => handleSort('created_at')}>
                  Date {sortBy === 'created_at' && (order === 'ASC' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">No listings found</td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>{sub.property_code || '-'}</td>
                    <td>{sub.emirate || '-'}</td>
                    <td className="truncate">{sub.area_community || '-'}</td>
                    <td className="truncate">{sub.building_name || '-'}</td>
                    <td>{sub.sub_category || '-'}</td>
                    <td>{sub.bedrooms || '-'}</td>
                    <td>{sub.purpose || '-'}</td>
                    <td>{sub.purpose === 'Sale' ? sub.sale_price : sub.asking_rent || '-'}</td>
                    <td className="truncate">{sub.agent_name || '-'}</td>
                    <td>{new Date(sub.created_at).toLocaleString()}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => setSelectedListing(sub)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedListing && (
        <div className="modal-overlay" onClick={() => setSelectedListing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedListing(null)}>×</button>
            <h3>Property Details - {selectedListing.property_code}</h3>
            
            <div className="detail-section">
              <h4>Property Classification</h4>
              <p><strong>Category:</strong> {selectedListing.category}</p>
              <p><strong>Sub Category:</strong> {selectedListing.sub_category}</p>
              <p><strong>Purpose:</strong> {selectedListing.purpose}</p>
            </div>

            <div className="detail-section">
              <h4>Property Identification</h4>
              <p><strong>Emirate:</strong> {selectedListing.emirate}</p>
              <p><strong>Area/Community:</strong> {selectedListing.area_community}</p>
              <p><strong>Building:</strong> {selectedListing.building_name}</p>
              <p><strong>Unit Number:</strong> {selectedListing.unit_number}</p>
              {selectedListing.google_pin && (
                <p><strong>Location:</strong> <a href={selectedListing.google_pin} target="_blank" rel="noopener noreferrer">View on Map</a></p>
              )}
            </div>

            <div className="detail-section">
              <h4>Specifications</h4>
              <p><strong>Bedrooms:</strong> {selectedListing.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {selectedListing.bathrooms}</p>
              <p><strong>Size:</strong> {selectedListing.size_sqft} Sq. Ft</p>
              <p><strong>Maid Room:</strong> {selectedListing.maid_room}</p>
              <p><strong>Furnishing:</strong> {selectedListing.furnishing}</p>
              <p><strong>Condition:</strong> {selectedListing.property_condition}</p>
            </div>

            {selectedListing.purpose === 'Sale' && (
              <div className="detail-section">
                <h4>Sales Details</h4>
                <p><strong>Sale Price:</strong> {selectedListing.sale_price}</p>
                <p><strong>Unit Status:</strong> {selectedListing.unit_status}</p>
                <p><strong>Commission:</strong> {selectedListing.sales_agent_commission}</p>
              </div>
            )}

            {selectedListing.purpose === 'Rent' && (
              <div className="detail-section">
                <h4>Rent Details</h4>
                <p><strong>Asking Rent:</strong> {selectedListing.asking_rent}</p>
                <p><strong>Cheques:</strong> {selectedListing.number_of_chq}</p>
                <p><strong>Security Deposit:</strong> {selectedListing.security_deposit}</p>
                <p><strong>Commission:</strong> {selectedListing.rent_agent_commission}</p>
              </div>
            )}

            <div className="detail-section">
              <h4>Viewing & Status</h4>
              <p><strong>Keys Status:</strong> {selectedListing.keys_status}</p>
              <p><strong>Viewing Status:</strong> {selectedListing.viewing_status}</p>
              {selectedListing.more_information && (
                <p><strong>Additional Info:</strong> {selectedListing.more_information}</p>
              )}
            </div>

            <div className="detail-section">
              <h4>Agent Details</h4>
              <p><strong>Agent Code:</strong> {selectedListing.agent_code}</p>
              <p><strong>Name:</strong> {selectedListing.agent_name}</p>
              <p><strong>Mobile:</strong> {selectedListing.agent_mobile}</p>
              <p><strong>Email:</strong> {selectedListing.agent_email}</p>
              <p><strong>Agency:</strong> {selectedListing.agent_agency}</p>
            </div>

            <div className="detail-section">
              <p><strong>Submitted:</strong> {new Date(selectedListing.created_at).toLocaleString()}</p>
              <p><strong>Contact Email:</strong> {selectedListing.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionsList;
