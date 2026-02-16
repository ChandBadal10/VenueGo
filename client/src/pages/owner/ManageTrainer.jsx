import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, User, X, AlertTriangle } from "lucide-react";

const Trainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, trainer: null });
  const [deleting, setDeleting] = useState(false);

  // Fetch trainers
  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/trainers/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTrainers(res.data.trainers);
      }
    } catch (err) {
      console.error("Fetch trainers error:", err);
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (trainer) => {
    setDeleteModal({ show: true, trainer });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, trainer: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.trainer) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/api/trainers/${deleteModal.trainer._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setTrainers(trainers.filter((trainer) => trainer._id !== deleteModal.trainer._id));
        closeDeleteModal();
      }
    } catch (err) {
      console.error("Delete trainer error:", err);
      toast.error("Failed to delete trainer");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Manage Trainers</h1>
          <p className="text-gray-600 mt-2">
            View, enable, disable, or delete your trainers
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-900">
              <div className="col-span-4">Trainer</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-2">Specialization</div>
              <div className="col-span-1">Experience</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {trainers.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Trainers Yet
                </h3>
                <p className="text-gray-600">
                  Start by adding your first trainer to the system.
                </p>
              </div>
            ) : (
              trainers.map((trainer, index) => (
                <div
                  key={trainer._id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition ${
                    index !== trainers.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  {/* Trainer Info with Image */}
                  <div className="col-span-4 flex items-center gap-3">
                    {trainer.image ? (
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{trainer.name}</h3>
                      <p className="text-sm text-gray-500">
                        {trainer.bio?.slice(0, 40)}
                        {trainer.bio?.length > 40 ? "..." : ""}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-2">
                    <p className="text-gray-700 text-sm truncate">{trainer.email}</p>
                  </div>

                  {/* Phone */}
                  <div className="col-span-2">
                    <p className="text-gray-700 text-sm">{trainer.phone}</p>
                  </div>

                  {/* Specialization */}
                  <div className="col-span-2">
                    <p className="text-gray-700 text-sm">{trainer.specialization}</p>
                  </div>

                  {/* Experience */}
                  <div className="col-span-1">
                    <p className="text-gray-700 text-sm">{trainer.experience} years</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    <button
                      onClick={() => openDeleteModal(trainer)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete trainer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Trainer</h3>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                  disabled={deleting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteModal.trainer?.name}
                </span>
                ? This action cannot be undone.
              </p>

              {/* Trainer Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  {deleteModal.trainer?.image ? (
                    <img
                      src={deleteModal.trainer.image}
                      alt={deleteModal.trainer.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {deleteModal.trainer?.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {deleteModal.trainer?.specialization} • {deleteModal.trainer?.experience} years
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Trainer;