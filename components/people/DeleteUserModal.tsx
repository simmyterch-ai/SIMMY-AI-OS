"use client";

import { useState } from "react";
import type { User } from "@/lib/types/user";

type DeleteUserModalProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
};

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onDelete,
}: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await onDelete(user.id);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        <div className="flex flex-col items-center">

          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <span className="text-5xl">🗑️</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Delete Employee
          </h2>

          <p className="mt-4 text-center text-slate-600">
            Are you sure you want to permanently delete
          </p>

          <p className="mt-2 text-center text-lg font-semibold text-red-600">
            {user.name}
          </p>

          <p className="mt-5 text-sm text-slate-500">
            This action cannot be undone.
          </p>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border px-5 py-3 font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "🗑 Delete User"}
          </button>

        </div>

      </div>
    </div>
  );
}