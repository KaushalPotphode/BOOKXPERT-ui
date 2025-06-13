// src/components/EmployeeTable.js
import React, { useState } from 'react';
import { deleteEmployee } from '../services/employeeService';
import { Modal, Button } from 'react-bootstrap';

function EmployeeTable({ employees, onEmployeeUpdated }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteEmployee(selectedEmployeeId);
      setShowConfirm(false);
      setSelectedEmployeeId(null);
      onEmployeeUpdated();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="table-responsive mt-4">
      <h5 className="mb-3">Employee List</h5>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Date of Join</th>
            <th>Salary</th>
            <th>Gender</th>
            <th>State</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">No employees found.</td>
            </tr>
          ) : (
            employees.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.designation}</td>
                <td>{emp.dateOfJoin?.substring(0, 10)}</td>
                <td>{emp.salary}</td>
                <td>{emp.gender}</td>
                <td>{emp.state}</td>
                <td>{emp.dateOfBirth?.substring(0, 10)}</td>
                <td>{emp.dateOfBirth ? new Date().getFullYear() - new Date(emp.dateOfBirth).getFullYear() : ''}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setSelectedEmployeeId(emp.id);
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this employee?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
// comment for test

export default EmployeeTable;
