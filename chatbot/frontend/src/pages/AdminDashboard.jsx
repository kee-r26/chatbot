import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Upload, CheckCircle, XCircle } from "lucide-react";
import Cookies from "universal-cookie";
import { uploadCSV, addFormData } from "../actions/adminActions";

const cookies = new Cookies();

function AdminDashboard() {
  const navigate = useNavigate();
  const [csvDataType, setCsvDataType] = useState("Timetable");
  const [formDataType, setFormDataType] = useState("Timetable");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadMethod, setUploadMethod] = useState(null); // 'csv' | 'form'
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    cookies.remove("authToken", { path: "/" });
    navigate("/login");
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadCSV = async () => {
    if (!selectedFile) {
      showFeedback("error", "Please select a file before uploading.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await uploadCSV(csvDataType, selectedFile);
      showFeedback("success", result.message || "File uploaded successfully.");
      setSelectedFile(null);
    } catch (err) {
      const msg = err?.response?.data?.message || "Upload failed. Please try again.";
      showFeedback("error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await addFormData(formDataType, formData);
      showFeedback("success", result.message || "Data added successfully.");
      setFormData({});
    } catch (err) {
      const msg = err?.response?.data?.message || "Submission failed. Please try again.";
      showFeedback("error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormReset = () => setFormData({});

  const renderFormFields = () => {
    switch (formDataType) {
      case "Timetable":
        return (
          <>
            <FormField label="Department" name="department" value={formData.department || ""} onChange={handleFormChange} placeholder="e.g. CSE" />
            <FormField label="Day" name="day" value={formData.day || ""} onChange={handleFormChange} placeholder="e.g. Monday" />
            <FormField label="Subject" name="subject" value={formData.subject || ""} onChange={handleFormChange} placeholder="e.g. Data Structures" />
            <FormField label="Start Time" name="startTime" type="time" value={formData.startTime || ""} onChange={handleFormChange} />
            <FormField label="End Time" name="endTime" type="time" value={formData.endTime || ""} onChange={handleFormChange} />
          </>
        );
      case "Exam Schedule":
        return (
          <>
            <FormField label="Department" name="department" value={formData.department || ""} onChange={handleFormChange} placeholder="e.g. CSE" />
            <FormField label="Subject" name="subject" value={formData.subject || ""} onChange={handleFormChange} placeholder="e.g. DBMS" />
            <FormField label="Exam Date" name="examDate" type="date" value={formData.examDate || ""} onChange={handleFormChange} />
            <FormField label="Exam Time" name="examTime" type="time" value={formData.examTime || ""} onChange={handleFormChange} />
          </>
        );
      case "Fees":
        return (
          <>
            <FormField label="Department" name="department" value={formData.department || ""} onChange={handleFormChange} placeholder="e.g. CSE" />
            <FormField label="Semester" name="semester" type="number" value={formData.semester || ""} onChange={handleFormChange} placeholder="e.g. 3" />
            <FormField label="Semester Fee (₹)" name="semesterFee" type="number" value={formData.semesterFee || ""} onChange={handleFormChange} placeholder="e.g. 45000" />
            <FormField label="Exam Fee (₹)" name="examFee" type="number" value={formData.examFee || ""} onChange={handleFormChange} placeholder="e.g. 1500" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-slate-800 p-8">

      {/* Top bar */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 hover:text-red-400 py-2 px-4 rounded-xl font-medium transition-all border border-red-600/50"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage and add data to the system</p>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`max-w-xl mx-auto mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-500/10 border-green-500/40 text-green-400"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {feedback.message}
        </div>
      )}

      {/* Method selection cards */}
      {!uploadMethod && (
        <div className="flex justify-center gap-8 mb-12">
          <MethodCard
            icon={<Upload className="text-[#6366F1] w-12 h-12 mx-auto mb-4" />}
            title="Upload CSV File"
            description="Upload data in bulk using a CSV file."
            onClick={() => setUploadMethod("csv")}
          />
          <MethodCard
            icon={<Upload className="text-[#6366F1] w-12 h-12 mx-auto mb-4" />}
            title="Upload Data Manually"
            description="Manually enter data using a structured form."
            onClick={() => setUploadMethod("form")}
          />
        </div>
      )}

      {/* CSV upload panel */}
      {uploadMethod === "csv" && (
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Upload CSV File</h3>
            <SelectField
              id="csvDataType"
              label="Select Data Type"
              value={csvDataType}
              onChange={(e) => setCsvDataType(e.target.value)}
            />
            <div className="mb-4">
              <label htmlFor="csvFile" className="block text-sm font-medium text-slate-700 mb-2">
                Upload CSV File
              </label>
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
              disabled={isSubmitting}
              className="w-full bg-[#6366F1] text-white py-2 px-4 rounded-lg hover:bg-[#5053D6] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Upload size={20} />
              {isSubmitting ? "Uploading..." : "Upload CSV"}
            </button>
            <BackButton onClick={() => { setUploadMethod(null); setFeedback(null); }} />
          </div>
        </div>
      )}

      {/* Form upload panel */}
      {uploadMethod === "form" && (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Enter Data Manually</h3>
            <SelectField
              id="formDataType"
              label="Select Data Type"
              value={formDataType}
              onChange={(e) => { setFormDataType(e.target.value); setFormData({}); }}
            />
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {renderFormFields()}
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#6366F1] text-white py-2 px-4 rounded-lg hover:bg-[#5053D6] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Data"}
                </button>
                <button
                  type="button"
                  onClick={handleFormReset}
                  className="w-full bg-gray-300 text-slate-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Reset
                </button>
              </div>
              <BackButton onClick={() => { setUploadMethod(null); setFeedback(null); }} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small reusable sub-components ─────────────────────────────────────────────

function FormField({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
      />
    </div>
  );
}

function SelectField({ id, label, value, onChange }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
      >
        <option value="Timetable">Timetable</option>
        <option value="Exam Schedule">Exam Schedule</option>
        <option value="Fees">Fees</option>
      </select>
    </div>
  );
}

function MethodCard({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-80 p-8 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow text-left"
    >
      {icon}
      <h2 className="text-xl font-semibold text-center text-slate-800 mb-2">{title}</h2>
      <p className="text-center text-slate-600">{description}</p>
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-gray-300 text-slate-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors mt-4"
    >
      Back to Upload Method Selection
    </button>
  );
}

export default AdminDashboard;
