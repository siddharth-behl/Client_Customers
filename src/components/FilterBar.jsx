import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';

const FilterBar = ({
    searchTerm, setSearchTerm,
    filterState, setFilterState,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    uniqueStates
}) => {
    return (
        <div className="filter-bar glass-card">
            <div className="search-group">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search by Name, State, or Address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-group">
                <div className="filter-item">
                    <Filter size={16} className="filter-icon" />
                    <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All States</option>
                        {uniqueStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <Calendar size={16} className="filter-icon" />
                    <span className="date-label">From:</span>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="date-input"
                    />
                </div>

                <div className="filter-item">
                    <span className="date-label">To:</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="date-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
