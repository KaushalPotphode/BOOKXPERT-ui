// src/App.js
import React, { useEffect, useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import { getEmployees } from './services/employeeService';

function App() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📘 BookXpert Employee Management</h2>
      <p className="text-muted text-center">Use the form below to add employees and view the list below.</p>
      <EmployeeForm onEmployeeAdded={fetchEmployees} />
      <hr />
      <EmployeeTable employees={employees} onEmployeeUpdated={fetchEmployees} />
    </div>
  );
}

export default App;
