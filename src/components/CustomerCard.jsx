import React from 'react';
import { MessageCircle, MapPin, Phone, User } from 'lucide-react';

const CustomerCard = ({ customer, index, messageTemplate }) => {
  const address = customer.default_address || {};
  const firstName = customer.first_name || 'Unknown';
  const lastName = customer.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();

  // Phone logic: prefers address phone, clean it up
  const rawPhone = address.phone || customer.phone;
  const displayPhone = rawPhone || 'N/A';

  const state = address.province || 'Unknown State';
  const country = address.country || 'Unknown Country';

  // Address logic
  const fullAddress = [
    address.address1,
    address.address2,
    address.city,
    address.province,
    address.zip,
    address.country
  ].filter(Boolean).join(', ');

  // Date logic
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const createdAt = formatDate(customer.created_at);

  const handleWhatsApp = () => {
    if (!rawPhone) {
      alert('No phone number available for this customer');
      return;
    }

    // specific cleanup for WhatsApp link
    let cleanPhone = rawPhone.replace(/\D/g, '');
    // Heuristic: if starts with 91 (India) or length is 10, try to ensure country code
    // API data seems to have country_code "IN", so we can use that?
    // But raw phone often includes non-digits. "8950679507" -> "918950679507" if IN

    if (address.country_code === 'IN' && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    } else if (cleanPhone.length === 10) {
      // Default to India (91) if not specified or ambiguous, or just leave it
      // The user request country seems to be India mostly.
      cleanPhone = '91' + cleanPhone;
    }

    // Replace placeholders in template
    let message = messageTemplate || "Hello {name}, we noticed you are from {state}.";
    message = message.replace(/{name}/g, firstName);
    message = message.replace(/{state}/g, state);
    message = message.replace(/{phone}/g, displayPhone);

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="glass-card"
    >
      <div className="card-header">
        <div className="avatar">
          <User size={24} color="white" />
        </div>
        <div className="customer-info">
          <h3 className="customer-name">{fullName}</h3>
          <p className="customer-country">ID: {customer.id}</p>
        </div>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label" style={{ minWidth: '80px' }}>Created:</span>
          <span className="info-value">{createdAt}</span>
        </div>

        <div className="info-row highlight-row">
          <Phone size={16} className="icon" />
          <span className="info-value highlight">{displayPhone}</span>
        </div>

        <div className="info-row highlight-row">
          <MapPin size={16} className="icon" />
          <span className="info-label">State:</span>
          <span className="info-value highlight">{state}</span>
        </div>

        <div className="info-row">
          <MapPin size={16} className="icon" />
          <span className="info-value" style={{ fontSize: '0.85rem', opacity: 0.8 }}>{fullAddress || 'No Address Provided'}</span>
        </div>
      </div>

      <button className="whatsapp-btn" onClick={handleWhatsApp}>
        <MessageCircle size={20} />
        <span>Send in WhatsApp</span>
      </button>
    </div>
  );
};

export default CustomerCard;
