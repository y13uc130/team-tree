import React from 'react';
import './styles.scss';
import EmployeeCard from './EmployeeCard';

const EmployeeList = ({ employees, allTeams, onSearch, onFilter, teamFilter, search }) => {

    return (
        <div className='elist-container'>
            <div className="input-select-container">
                <input
                    type="text"
                    placeholder="Search by name, designation, team"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />

                <select value={teamFilter} onChange={(e) => onFilter(e.target.value)}>
                    <option value="">All Teams</option>
                    {allTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>
            </div>

            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>
                        <EmployeeCard data={emp} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
