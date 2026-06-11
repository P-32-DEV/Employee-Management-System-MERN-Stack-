import React, { useState, useEffect } from 'react';
import { Plus, Users, Building, Activity, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import EmployeeTable from './components/EmployeeTable';
import EmployeeFormModal from './components/EmployeeFormModal';

// Set API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [toast, setToast] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  // Load employees on mount
  useEffect(() => {
    fetchEmployees();
    checkServerHealth();
  }, []);

  // Clear toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Check backend server connection
  const checkServerHealth = async () => {
    try {
      // Extract base URL to ping the health endpoint
      const baseUrl = API_URL.replace('/api/employees', '') || 'http://localhost:5000';
      const res = await fetch(baseUrl);
      if (res.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (err) {
      setServerStatus('offline');
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch employee database.');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while loading employees.');
      showToast('error', 'Error loading employee database');
    } finally {
      setIsLoading(false);
    }
  };

  // Show customized alert toasts
  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Open modal for adding a new employee
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing employee
  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  // Handle Form Submission (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let response;
      let successMessage = '';

      if (editingEmployee) {
        // UPDATE
        response = await fetch(`${API_URL}/${editingEmployee._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        successMessage = 'Employee record updated successfully!';
      } else {
        // CREATE
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        successMessage = 'New employee registered successfully!';
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed.');
      }

      showToast('success', successMessage);
      setIsModalOpen(false);
      fetchEmployees(); // Refresh list
    } catch (err) {
      showToast('error', err.message || 'Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an employee
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee record?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete employee.');
      }

      showToast('success', 'Employee record deleted successfully');
      fetchEmployees(); // Refresh list
    } catch (err) {
      showToast('error', err.message || 'Delete failed.');
    }
  };

  // Calculate stats for dashboard cards
  const totalEmployees = employees.length;
  const uniqueDepartments = [...new Set(employees.map(emp => emp.department))].length;

  return (
    <div className="min-h-screen pb-16 px-4 md:px-8">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 ${toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
            }`}>
            {toast.type === 'success' ? (
              <Sparkles className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto pt-10">

        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Employee Hub
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-normal">
                  v1.0
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">MERN Stack CRUD Application</p>
            </div>
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
              <span className={`w-2.5 h-2.5 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                  serverStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'
                }`} />
              Server: {serverStatus === 'online' ? 'Connected' : serverStatus === 'offline' ? 'Disconnected' : 'Connecting...'}
            </div>

            <button
              onClick={fetchEmployees}
              title="Refresh Database"
              className="p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Dashboard Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Total Employees */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{isLoading ? '...' : totalEmployees}</p>
            </div>
          </div>

          {/* Card 2: Departments */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Departments</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{isLoading ? '...' : uniqueDepartments}</p>
            </div>
          </div>

          {/* Card 3: Database Connection */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">API Status</p>
              <p className="text-lg font-bold text-slate-100 mt-1.5 flex items-center gap-1.5 capitalize">
                {serverStatus === 'online' ? 'Operational' : 'Offline'}
              </p>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Management Panel</h2>
            <p className="text-xs text-slate-400 mt-0.5">Create, view, edit or remove staff records</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Database Load Errors */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Database Error</p>
              <p className="text-xs text-rose-400/80 mt-1">{error}</p>
              <button
                onClick={fetchEmployees}
                className="mt-3 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium rounded-lg text-xs transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Main Employee Database Table */}
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteEmployee}
        />

        {/* Create / Edit Form Modal Overlay */}
        <EmployeeFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          employee={editingEmployee}
          isSubmitting={isSubmitting}
        />

      </div>
    </div>
  );
}

export default App;
