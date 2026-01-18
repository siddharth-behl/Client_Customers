import { useState, useEffect, useMemo } from 'react';
import CustomerCard from './components/CustomerCard';
import MessageEditor from './components/MessageEditor';
import FilterBar from './components/FilterBar';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Customization State
  const [messageTemplate, setMessageTemplate] = useState(
    "Hello {name}, we noticed you are from {state}. We have a special offer for you!"
  );

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api');
        const data = await response.json();
        if (data && data.customers) {
          setCustomers(data.customers);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute Unique States
  const uniqueStates = useMemo(() => {
    const states = new Set(customers.map(c => c.default_address?.province).filter(Boolean));
    return [...states].sort();
  }, [customers]);

  // Filter Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const address = customer.default_address || {};
      const state = address.province || 'Unknown State';

      // Search Filter (Name, State, Address)
      const term = searchTerm.toLowerCase();
      const searchTarget = [
        customer.first_name,
        customer.last_name,
        state,
        address.city,
        address.address1,
        address.zip
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = !term || searchTarget.includes(term);

      // State Filter
      const matchesState = !filterState || state === filterState;

      // Date Filter
      let matchesDate = true;
      if (dateFrom || dateTo) {
        const createdDate = new Date(customer.created_at);
        createdDate.setHours(0, 0, 0, 0);

        if (dateFrom) {
          const start = new Date(dateFrom);
          if (createdDate < start) matchesDate = false;
        }
        if (dateTo) {
          const end = new Date(dateTo);
          if (createdDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesState && matchesDate;
    });
  }, [customers, searchTerm, filterState, dateFrom, dateTo]);

  return (
    <div className="main-container">
      <header className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <p className="subtitle">{filteredCustomers.length} Customers Found</p>
      </header>

      <MessageEditor
        template={messageTemplate}
        onSave={setMessageTemplate}
      />

      <FilterBar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterState={filterState} setFilterState={setFilterState}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        uniqueStates={uniqueStates}
      />

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Customers...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : (
        <div className="customer-grid">
          {filteredCustomers.map((customer, index) => (
            <CustomerCard
              key={customer.id || index}
              customer={customer}
              index={index}
              messageTemplate={messageTemplate}
            />
          ))}
          {filteredCustomers.length === 0 && (
            <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
              <p>No customers match your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
