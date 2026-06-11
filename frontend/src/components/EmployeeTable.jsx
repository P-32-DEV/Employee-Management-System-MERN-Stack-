import React, { useState } from 'react';
import { Edit2, Trash2, Search, Users, Briefcase, Mail } from 'lucide-react';

const EmployeeTable = ({ employees, isLoading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to render department badge styling
  const getDeptBadgeClass = (dept) => {
    const d = dept.toLowerCase();
    if (d.includes('eng') || d.includes('tech') || d.includes('dev')) {
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    } else if (d.includes('design') || d.includes('ui') || d.includes('ux') || d.includes('art')) {
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    } else if (d.includes('hr') || d.includes('peop') || d.includes('talent')) {
      return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
    } else if (d.includes('sale') || d.includes('mark') || d.includes('biz')) {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    } else if (d.includes('fin') || d.includes('acc')) {
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* Search Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Employees List
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total count: {filteredEmployees.length} {filteredEmployees.length !== employees.length && `(filtered from ${employees.length})`}
          </p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-950/40 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="border-b border-slate-800/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full shimmer-effect"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-4 rounded shimmer-effect"></div>
                        <div className="w-48 h-3 rounded shimmer-effect"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-6 rounded shimmer-effect"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="w-8 h-8 rounded-lg shimmer-effect"></div>
                      <div className="w-8 h-8 rounded-lg shimmer-effect"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredEmployees.length > 0 ? (
              // Active Employees Rows
              filteredEmployees.map((employee) => (
                <tr 
                  key={employee._id}
                  className="hover:bg-slate-800/30 transition-colors duration-200"
                >
                  {/* Name and Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Icon */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-sm shadow-inner">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200 hover:text-white transition-colors">
                          {employee.name}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {employee.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getDeptBadgeClass(employee.department)}`}>
                      <Briefcase className="w-3 h-3 opacity-80" />
                      {employee.department}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        title="Edit Employee"
                        className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(employee._id)}
                        title="Delete Employee"
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Users className="w-12 h-12 mb-3 text-slate-600 stroke-[1.5]" />
                    <p className="text-base font-medium text-slate-400">No employees found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchTerm ? 'Try adjusting your search query' : 'Get started by creating a new employee'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
