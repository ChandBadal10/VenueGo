import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, User, X, AlertTriangle } from "lucide-react";

const Trainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, trainer: null });
  const [deleting, setDeleting] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Manage Trainers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View, enable, disable, or delete your trainers
          </p>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">

          {/* Table Header */}
          <div className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-900 dark:text-gray-200">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  No Trainers Yet
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  Start by adding your first trainer to the system.
                </p>
              </div>
            ) : (
              trainers.map((trainer, index) => (
                <div
                  key={trainer._id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    index !== trainers.length - 1
                      ? "border-b border-gray-200 dark:border-gray-700"
                      : ""
                  }`}
                >
                  {/* Trainer Info */}
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {trainer.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {trainer.bio?.slice(0, 40)}
                        {trainer.bio?.length > 40 ? "..." : ""}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-2">
                    <p className="text-gray-700 dark:text-gray-300 text-sm truncate">
                      {trainer.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="col-span-2">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {trainer.phone}
                    </p>
                  </div>

                  {/* Specialization */}
                  <div className="col-span-2">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {trainer.specialization}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="col-span-1">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {trainer.experience} years
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    <button
                      onClick={() => openDeleteModal(trainer)}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
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

      {/* DELETE MODAL */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">

            <div className="bg-red-50 dark:bg-red-900/30 px-6 py-4 border-b border-red-100 dark:border-red-800">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delete Trainer
                  </h3>
                </div>

                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {deleteModal.trainer?.name}
                </span>
                ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
