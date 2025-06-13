// src/components/EmployeeTable.js
import React, { useState, useEffect } from 'react';
import $ from 'jquery'; // Ensure jQuery is installed and imported correctly
import { deleteEmployee, deleteMultipleEmployees, downloadPdf, getReport } from '../services/employeeService';
import { Modal, Button } from 'react-bootstrap';
import EmployeeForm from './EmployeeForm';
import Chart from './Chart'; // Import the Chart component

function EmployeeTable({ employees, onEmployeeUpdated }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [showChartModal, setShowChartModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const recordsPerPage = 5;

  const calculateTotalSalary = () => {
    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
    $('#totalSalary').text(`Total Salary: ${totalSalary}`);
  };

  useEffect(() => {
    calculateTotalSalary();
  }, [employees]); // Removed calculateTotalSalary from dependency array

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

  const handleDeleteSelected = async () => {
    try {
      await deleteMultipleEmployees(selectedIds);
      setSelectedIds([]);
      onEmployeeUpdated();
    } catch (error) {
      console.error('Delete multiple failed:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setShowFormModal(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(employees.map(emp => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleShowChart = () => {
    setShowChartModal(true);
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await downloadPdf();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'EmployeeList.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await getReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'EmployeeReport.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  return (
    <div className="table-responsive mt-4">
      <style>
        {`
          table.employee-table thead th {
            background-color: #1565c0 !important; /* Strong blue */
            color: #fff !important;
            border-color: #1565c0 !important;
            cursor: pointer;
          }
          table.employee-table tbody tr {
            background-color: #e3f2fd !important; /* Lighter blue */
          }
        `}
      </style>
      <h5 className="mb-3">Employee List</h5>
      <Button className="mb-3" onClick={() => {
        setEditEmployee(null);
        setShowFormModal(true);
      }}>
        Add Employee
      </Button>
      <Button className="mb-3 btn-info" onClick={handleShowChart}>
        Show Chart
      </Button>
      <Button className="mb-3 btn-success" onClick={handleDownloadPdf}>
        Download PDF
      </Button>
      <Button className="mb-3 btn-secondary" onClick={handleDownloadReport}>
        Download Report
      </Button>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div id="totalSalary" className="mb-3"></div>
      <Button
        className="mb-3 btn-danger"
        onClick={handleDeleteSelected}
        disabled={selectedIds.length === 0}
      >
        Delete Selected
      </Button>
      <table className="table table-hover employee-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedIds.length === employees.length && employees.length > 0}
              />
            </th>
            <th onClick={() => handleSort('id')}>#</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('designation')}>Designation</th>
            <th onClick={() => handleSort('dateOfJoin')}>Date of Join</th>
            <th onClick={() => handleSort('salary')}>Salary</th>
            <th onClick={() => handleSort('gender')}>Gender</th>
            <th onClick={() => handleSort('state')}>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">No employees found.</td>
            </tr>
          ) : (
            paginatedEmployees.map((emp, index) => (
              <tr key={emp.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => handleSelectRow(emp.id)}
                  />
                </td>
                <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                <td
                  className="text-primary cursor-pointer"
                  onClick={() => handleEdit(emp)}
                >
                  {emp.name}
                </td>
                <td>{emp.designation}</td>
                <td>{emp.dateOfJoin?.substring(0, 10)}</td>
                <td>{emp.salary}</td>
                <td>{emp.gender}</td>
                <td>{emp.state}</td>
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
      <div className="d-flex justify-content-between mt-3">
        <Button
          className="btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          className="btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

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

      {/* Employee Form Modal */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editEmployee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm
            employee={editEmployee}
            onEmployeeUpdated={() => {
              setShowFormModal(false);
              onEmployeeUpdated();
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Chart Modal */}
      <Modal show={showChartModal} onHide={() => setShowChartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Chart employees={employees} />
        </Modal.Body>
      </Modal>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportUrl ? (
            <iframe
              src={reportUrl}
              title="Employee Report"
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          ) : (
            <p>Loading report...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeTable;
