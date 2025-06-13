// src/components/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import { getStates, createEmployee, updateEmployee } from '../services/employeeService';

function EmployeeForm({ employee, onEmployeeUpdated }) {
  const [form, setForm] = useState({
    name: '',
    designation: '',
    dateOfJoin: '',
    salary: '',
    gender: '',
    state: '',
    dateOfBirth: '',
    age: ''
  });
  const [states, setStates] = useState([]);

  useEffect(() => {
    getStates().then(res => setStates(res.data)).catch(err => console.error(err));
    if (employee) {
      const formattedDateOfBirth = employee.dateOfBirth?.substring(0, 10); // Extract YYYY-MM-DD
      const calculatedAge = calculateAge(formattedDateOfBirth);
      setForm({
        name: employee.name || '',
        designation: employee.designation || '',
        dateOfJoin: employee.dateOfJoin?.substring(0, 10) || '', // Extract YYYY-MM-DD
        salary: employee.salary || '',
        gender: employee.gender || '',
        state: employee.state || '',
        dateOfBirth: formattedDateOfBirth || '',
        age: calculatedAge || ''
      });
    }
  }, [employee]);

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    if (name === 'dateOfBirth') {
      updatedForm.age = calculateAge(value);
    }
    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await updateEmployee(employee.id, form);
      } else {
        await createEmployee(form);
      }
      onEmployeeUpdated();
      setForm({ name: '', designation: '', dateOfJoin: '', salary: '', gender: '', state: '', dateOfBirth: '', age: '' });
    } catch (err) {
      console.error('Failed to save employee:', err);
    }
  };

  const handleClearForm = () => {
    setForm({ name: '', designation: '', dateOfJoin: '', salary: '', gender: '', state: '', dateOfBirth: '', age: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-4 mb-2">
          <label>Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-4 mb-2">
          <label>Designation</label>
          <input name="designation" className="form-control" value={form.designation} onChange={handleChange} required />
        </div>
        <div className="col-md-4 mb-2">
          <label>Date of Join</label>
          <input type="date" name="dateOfJoin" className="form-control" value={form.dateOfJoin} onChange={handleChange} required />
        </div>
        <div className="col-md-4 mb-2">
          <label>Salary</label>
          <input type="number" name="salary" className="form-control" value={form.salary} onChange={handleChange} required />
        </div>
        <div className="col-md-4 mb-2">
          <label>Gender</label>
          <select name="gender" className="form-control" value={form.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <label>State</label>
          <select name="state" className="form-control" value={form.state} onChange={handleChange} required>
            <option value="">Select</option>
            {states.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" className="form-control" value={form.dateOfBirth} onChange={handleChange} required />
        </div>
        <div className="col-md-4 mb-2">
          <label>Age</label>
          <input type="text" readOnly className="form-control bg-white" value={form.age} />
        </div>
      </div>
      <div className="mt-3">
        <button type="submit" className="btn btn-primary me-2">{employee ? 'Update' : 'Submit'}</button>
        <button type="button" className="btn btn-secondary" onClick={handleClearForm}>Clear Form</button>
      </div>
    </form>
  );
}

export default EmployeeForm;
