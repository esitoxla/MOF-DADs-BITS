import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  reviewExpenditure,
  cancelEditing,
} from "../store/features/budgetSlice";
import toast from "react-hot-toast";

export default function ReviewModal({ isOpen, onClose, record }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before submitting.");
      return;
    }

    try {
      await dispatch(
        reviewExpenditure({ id: record.id, reviewComment: comment })
      ).unwrap();
      toast.success("Record reviewed successfully!");
      dispatch(cancelEditing());
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to review record");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Review Comment
        </h2>
        <textarea
          rows={5}
          placeholder="Enter your review comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
