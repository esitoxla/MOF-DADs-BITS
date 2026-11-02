import { useEffect, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  bulkUploadActivities,
  downloadActivityTemplate,
} from "../store/features/activitySlice";

export default function ActivityUpload() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.activity);

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
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-gray-900">
            Upload spreadsheet
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Use the template so each activity is tied to the right organization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(downloadActivityTemplate())}
          className="shrink-0 cursor-pointer text-sm font-semibold text-green-800 hover:underline"
        >
          Download template
        </button>
      </div>

      <div
        className={`mt-5 flex h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
          dragActive
            ? "border-[#166534] bg-[#f3faf6]"
            : "border-gray-200 bg-[#f8faf8] hover:border-[#166534]/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("activityExcelInput").click()}
      >
        <input
          id="activityExcelInput"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f6ee] text-[#166534]">
          {file ? (
            <FileSpreadsheet className="h-5 w-5" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
        </span>
        <p className="mt-3 text-sm font-medium text-gray-700">
          {file ? file.name : "Drop an .xlsx file here"}
        </p>
        <p className="mt-1 text-sm text-gray-400">or click to browse · max 5MB</p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 w-full cursor-pointer rounded-lg bg-[#166534] py-2.5 text-sm font-semibold text-white hover:bg-[#14532d] disabled:opacity-60 dark:bg-[#39FF88] dark:text-[#0B132B] dark:hover:bg-[#2eeb78]"
      >
        {loading ? "Uploading..." : "Upload activities"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {typeof error === "string" ? error : "Error uploading file"}
        </p>
      )}
    </div>
  );
}
