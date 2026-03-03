import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { downloadActivityTemplate, bulkUploadActivities } from '../store/features/activitySlice';
import toast from 'react-hot-toast';

export default function ActivityUpload() {

  const dispatch = useDispatch();
    const { loading, error, success } = useSelector(
      (state) => state.activity
    );

    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      
      setDragActive(true);
    };

    const handleDragLeave = () => {
      setDragActive(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragActive(false);
      setFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = () => {
        if (!file) {
          toast("Please select an Excel file first.");
          return;
        }
        dispatch(bulkUploadActivities(file)).unwrap();

      };

      useEffect(() => {
        if (success) {
          toast.success("Activities created successfully");
        }
      }, [success]);

  return (
     <div className="w-full max-w-lg mx-auto p-6">
          <h2 className="text-lg font-semibold mb-2">
            Upload Excel File{" "}
            <button
              onClick={() => dispatch(downloadActivityTemplate())}
              className="text-blue-500 underline"
            >
              (click here to download template)
            </button>
          </h2>
    
          {/* Upload Box */}
          <div
            className={`mt-3 border-2 border-dashed bg-white h-56 flex flex-col justify-center items-center cursor-pointer transition ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("excelInput").click()}
          >
            <input
              id="excelInput"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
    
            <img
              src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
              alt="Upload icon"
              className="w-12 opacity-60 mb-3"
            />
    
            <p className="text-gray-600 font-medium">
              {file ? file.name : "Upload Activities Excel (.xlsx)"}{" "}
              <span className="text-gray-500">or drag and drop</span>
            </p>
    
            <p className="text-gray-400 text-sm mt-1">Max file size: 5MB</p>
          </div>
    
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-8 bg-green-500 text-white py-4 text-lg font-semibold hover:bg-green-600 transition flex justify-center items-center gap-2 cursor-pointer"
            // disabled={loading}
          >
            Submit
          </button>
    
          {/* Upload Response */}
          {/* {uploadResponse && (
            <div className="mt-4 text-green-600">
              {uploadResponse.message} — Inserted: {uploadResponse.inserted}
            </div>
          )} */}
    
          {/* Error */}
          {/* {error && (
            <div className="mt-3 text-red-500 text-sm">
              {typeof error.message === "string"
                ? error.message
                : error?.message?.message || "Error uploading file"}
            </div>
          )} */}
    
          {/* Row errors */}
          {/* {uploadResponse?.errors?.length > 0 && (
            <div className="mt-4 bg-red-50 p-3 rounded">
              <h3 className="font-semibold text-red-700">Row Errors:</h3>
              {uploadResponse.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-600">
                  Row {err.row}: {err.error}
                </p>
              ))}
            </div>
          )} */}
        </div>
  )
}
