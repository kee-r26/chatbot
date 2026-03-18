import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload } from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [csvDataType, setCsvDataType] = useState('Timetable');
  const [formDataType, setFormDataType] = useState('Timetable');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadMethod, setUploadMethod] = useState(null); // 'csv' or 'form'

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadCSV = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
    console.log(`Uploading ${csvDataType}:`, selectedFile);
    // Add API call here
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitting ${formDataType}:`, formData);
    // Add API call here
  };

  const handleFormReset = () => {
    setFormData({});
  };

  const renderFormFields = () => {
    switch (formDataType) {
      case 'Timetable':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <input type="text" name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Enter department" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Day</label>
              <input type="text" name="day" value={formData.day || ''} onChange={handleFormChange} placeholder="Enter day" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input type="text" name="subject" value={formData.subject || ''} onChange={handleFormChange} placeholder="Enter subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime || ''} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
              <input type="time" name="endTime" value={formData.endTime || ''} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
          </>
        );
      case 'Exam Schedule':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <input type="text" name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Enter department" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input type="text" name="subject" value={formData.subject || ''} onChange={handleFormChange} placeholder="Enter subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exam Date</label>
              <input type="date" name="examDate" value={formData.examDate || ''} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exam Time</label>
              <input type="time" name="examTime" value={formData.examTime || ''} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
          </>
        );
      case 'Fees':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <input type="text" name="department" value={formData.department || ''} onChange={handleFormChange} placeholder="Enter department" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Semester</label>
              <input type="text" name="semester" value={formData.semester || ''} onChange={handleFormChange} placeholder="Enter semester" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Semester Fee</label>
              <input type="number" name="semesterFee" value={formData.semesterFee || ''} onChange={handleFormChange} placeholder="Enter semester fee" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exam Fee</label>
              <input type="number" name="examFee" value={formData.examFee || ''} onChange={handleFormChange} placeholder="Enter exam fee" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-slate-800 p-8">
      {/* Top Right Logout Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-600 hover:text-red-700 py-2 px-4 rounded-xl font-medium transition-all border border-red-600/50"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage and add data to the system</p>
      </div>



      {/* Upload Method Selection Cards */}
      {!uploadMethod && (
        <div className="flex justify-center gap-8 mb-12">
          <div
            className="w-80 p-8 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => setUploadMethod('csv')}
          >
            <Upload className="text-[#6366F1] w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-center text-slate-800 mb-2">Upload CSV File</h2>
            <p className="text-center text-slate-600">Upload data in bulk using a CSV file.</p>
          </div>
          <div
            className="w-80 p-8 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => setUploadMethod('form')}
          >
            <Upload className="text-[#6366F1] w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-center text-slate-800 mb-2">Upload Data Manually</h2>
            <p className="text-center text-slate-600">Manually enter data using a structured form.</p>
          </div>
        </div>
      )}

      {uploadMethod === 'csv' && (
        <>
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Upload Timetable CSV</h3>
              <div className="mb-4">
                <label htmlFor="csvDataType" className="block text-sm font-medium text-slate-700 mb-2">Select Data Type</label>
                <select
                  id="csvDataType"
                  value={csvDataType}
                  onChange={(e) => setCsvDataType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="Timetable">Timetable</option>
                  <option value="Exam Schedule">Exam Schedule</option>
                  <option value="Fees">Fees</option>
                  <option value="Courses">Courses</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="csvFile" className="block text-sm font-medium text-slate-700 mb-2">Upload CSV File</label>
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full text-slate-700 border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6366F1] file:text-white hover:file:bg-[#5053D6]"
                />
              </div>
              <button
                onClick={handleUploadCSV}
                className="w-full bg-[#6366F1] text-white py-2 px-4 rounded-lg hover:bg-[#5053D6] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                Upload CSV
              </button>
              <button
                onClick={() => setUploadMethod(null)}
                className="w-full bg-gray-300 text-slate-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300 mt-4"
              >
                Back to Upload Method Selection
              </button>
            </div>
          </div>
        </>
      )}

      {uploadMethod === 'form' && (
        <>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Enter Data Manually</h3>
              <div className="mb-4">
                <label htmlFor="formDataType" className="block text-sm font-medium text-slate-700 mb-2">Select Data Type</label>
                <select
                  id="formDataType"
                  value={formDataType}
                  onChange={(e) => setFormDataType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="Timetable">Timetable</option>
                  <option value="Exam Schedule">Exam Schedule</option>
                  <option value="Fees">Fees</option>
                  <option value="Courses">Courses</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {renderFormFields()}
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full bg-[#6366F1] text-white py-2 px-4 rounded-lg hover:bg-[#5053D6] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Submit Data
                  </button>
                  <button
                    type="button"
                    onClick={handleFormReset}
                    className="w-full bg-gray-300 text-slate-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  >
                    Reset
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadMethod(null)}
                  className="w-full bg-gray-300 text-slate-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300 mt-4"
                >
                  Back to Upload Method Selection
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;