'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    contact: '',
    address: '',
    class: ''
  });
  
  
  const [students, setStudents] = useState([]);
  
  
  const [editingId, setEditingId] = useState(null);
  
  
  const [errors, setErrors] = useState({});
  
  
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
  
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  
  const validateForm = () => {
    const newErrors = {};
    
  
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    
  
    if (formData.contact && !/^\d{10}$/.test(formData.contact.trim())) {
      newErrors.contact = 'Contact must be a 10-digit number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (editingId) {
  
        await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
  
        await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
  
      setFormData({
        name: '',
        grade: '',
        contact: '',
        address: '',
        class: ''
      });
      setEditingId(null);
      
  
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      grade: student.grade,
      contact: student.contact,
      address: student.address,
      class: student.class
    });
    setEditingId(student._id);
    
  
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    setIsLoading(true);
    try {
      await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      
  
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleReset = () => {
    setFormData({
      name: '',
      grade: '',
      contact: '',
      address: '',
      class: ''
    });
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
          Student Management Dashboard
        </h1>
        
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
            
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter student name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
            
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade*
                </label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.grade ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter grade"
                />
                {errors.grade && <p className="mt-1 text-sm text-red-500">{errors.grade}</p>}
              </div>
              
            
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number*
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.contact ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter 10-digit contact number"
                />
                {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
              </div>
              
            
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class*
                </label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.class ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter class"
                />
                {errors.class && <p className="mt-1 text-sm text-red-500">{errors.class}</p>}
              </div>
            </div>
            
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'
                }`}
                placeholder="Enter address"
              ></textarea>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Processing...' : editingId ? 'Update Student' : 'Add Student'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Students List</h2>
          
          {isLoading && !students.length ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No students found. Add a new student above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{student.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{student.grade}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{student.class}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{student.contact}</td>
                      <td className="px-4 py-3">{student.address}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center py-6 text-gray-500 text-sm">
        Student Management Dashboard © {new Date().getFullYear()}
      </footer>
    </div>
  );
}