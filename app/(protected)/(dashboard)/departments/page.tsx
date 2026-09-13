"use client";

import { useEffect, useState } from "react";

import DepartmentStats from "@/components/departments/DepartmentStats";
import DepartmentTable from "@/components/departments/DepartmentTable";
import AddDepartmentModal from "@/components/departments/AddDepartmentModal";
import EditDepartmentModal from "@/components/departments/EditDepartmentModal";
import DeleteDepartmentModal from "@/components/departments/DeleteDepartmentModal";

import type { Department } from "@/lib/types/department";

export default function DepartmentsPage() {
  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "/api/departments",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null);

        throw new Error(
          data?.error ||
            "Failed to fetch departments."
        );
      }

      const data = await response.json();

      setDepartments(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch departments:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load departments."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =====================================================
  // ADD
  // =====================================================

  const handleAddDepartment = (
    department: Department
  ) => {
    setDepartments((previous) => [
      department,
      ...previous,
    ]);

    setIsAddModalOpen(false);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (
    department: Department
  ) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (
    department: Department
  ) => {
    try {
      setError(null);

      const response = await fetch(
        `/api/departments/${department.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            departmentId:
              department.departmentId,

            name:
              department.name,

            manager:
              department.manager,

            employeeCount:
              department.employeeCount,

            location:
              department.location,

            description:
              department.description,

            status:
              department.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update department."
        );
      }

      /*
       * Use the department returned by PostgreSQL.
       * This is important because the database is
       * now the source of truth.
       */
      setDepartments((previous) =>
        previous.map((item) =>
          item.id === data.id
            ? data
            : item
        )
      );

      setIsEditModalOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error(
        "Failed to update department:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update department."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (
    department: Department
  ) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(
        `/api/departments/${selectedDepartment.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete department."
        );
      }

      setDepartments((previous) =>
        previous.filter(
          (item) =>
            item.id !== selectedDepartment.id
        )
      );

      setIsDeleteModalOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error(
        "Failed to delete department:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete department."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (
    department: Department
  ) => {
    console.log(
      "View department:",
      department
    );

    // Department details can be connected later.
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Departments
            </h1>

            <p className="mt-2 text-slate-500">
              Manage organizational departments
              and business units.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800"
          >
            + Add Department
          </button>
        </div>

        {/* Statistics */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                />
              )
            )}
          </div>
        ) : (
          <DepartmentStats
            departments={departments}
          />
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">
              Department operation failed
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchDepartments}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Reload Departments
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <DepartmentTable
            departments={departments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>

      {/* =================================================
          ADD DEPARTMENT
      ================================================= */}

      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onSave={handleAddDepartment}
      />

      {/* =================================================
          EDIT DEPARTMENT
      ================================================= */}

      <EditDepartmentModal
        isOpen={isEditModalOpen}
        department={selectedDepartment}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* =================================================
          DELETE DEPARTMENT
      ================================================= */}

      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        department={selectedDepartment}
        onClose={() => {
          if (isDeleting) {
            return;
          }

          setIsDeleteModalOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}