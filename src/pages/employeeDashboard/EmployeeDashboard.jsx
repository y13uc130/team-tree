import React, { useEffect, useState, useMemo } from 'react';
import EmployeeList from '../../components/employee/EmployeeList';
import './styles.scss';
import TreeContainer from '../tree/TreeContainer';

const EmployeeDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [teamFilter, setTeamFilter] = useState('');


    useEffect(() => {
        setTimeout(() => {
            try {
                fetch('/api/employees')
                    .then(res => res.json())
                    .then(setEmployees)
                    .catch(console.error);
            } catch (err) {
                console.log(err);
            }
        }, 200);
    }, []);


    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchSearch = [emp.title, emp.subtitle, emp.team]
                .some(field => field.toLowerCase().includes(search.toLowerCase()));
            const matchTeam = teamFilter ? emp.team === teamFilter : true;
            return matchSearch && matchTeam;
        });
    }, [search, teamFilter, employees]);

    const allTeams = useMemo(() => {
        return [...new Set(employees.map(e => e.team))];
    }, [employees]);


    return (
        <div className='emp-dashboard-container' >
            <EmployeeList
                employees={filteredEmployees}
                onSearch={setSearch}
                onFilter={setTeamFilter}
                teamFilter={teamFilter}
                allTeams={allTeams}
                search={search}
            />
            {filteredEmployees?.length ?
                <div className="employee-tree-container">
                    <TreeContainer updateEmployees={(employees) => { setEmployees(employees) }} allEmployees={employees} filteredData={filteredEmployees} />
                </div> : null
            }
        </div>
    );
};

export default EmployeeDashboard;
