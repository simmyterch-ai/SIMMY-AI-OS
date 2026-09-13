"use client";

import { useState } from "react";
import { useEffect } from "react";

import PeopleHeader from "@/components/people/PeopleHeader";
import PeopleStats from "@/components/people/PeopleStats";
import PeopleTable from "@/components/people/PeopleTable";
import AddUserModal from "@/components/people/AddUserModal";
import EditUserModal from "@/components/people/EditUserModal";
import DeleteUserModal from "@/components/people/DeleteUserModal";
import EmployeeProfileDrawer from "@/components/people/EmployeeProfileDrawer";

import type {
  User,
  EmployeeProfile,
} from "../../../../lib/types/user";

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([]);

  const [isAddUserOpen, setIsAddUserOpen] =
    useState(false);

  const [isEditUserOpen, setIsEditUserOpen] =
    useState(false);

  const [isDeleteUserOpen, setIsDeleteUserOpen] =
    useState(false);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [selectedProfile, setSelectedProfile] =
    useState<EmployeeProfile | null>(null);

  const [profileLoading, setProfileLoading] =
    useState(false);

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error(
          "Failed to load users"
        );
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  // =====================================================
  // ADD USER
  // =====================================================

  const handleAddUser = async () => {
    await loadUsers();
  };

  // =====================================================
  // VIEW EMPLOYEE PROFILE
  // =====================================================

  const handleViewUser = async (user: User) => {
    // Keep the selected user immediately available
    setSelectedUser(user);

    // Open drawer immediately
    setIsProfileOpen(true);

    // Clear previous profile
    setSelectedProfile(null);

    // Show loading state
    setProfileLoading(true);

    try {
      const response = await fetch(
        `/api/users/${user.id}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load employee profile."
        );
      }

      const profile =
        await response.json();

      setSelectedProfile(profile);
    } catch (error) {
      console.error(
        "Failed to load employee profile:",
        error
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = (
    updatedUser: User
  ) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user
      )
    );

    setSelectedUser(updatedUser);
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleDeleteUser = async (
    id: number
  ) => {
    await loadUsers();

    setIsProfileOpen(false);
    setSelectedProfile(null);
    setSelectedUser(null);
  };

  // =====================================================
  // CLOSE PROFILE
  // =====================================================

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedProfile(null);
    setSelectedUser(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}

      <PeopleHeader
        onAddUser={() =>
          setIsAddUserOpen(true)
        }
      />

      {/* PEOPLE STATISTICS */}

      <PeopleStats users={users} />

      {/* PEOPLE TABLE */}

      <PeopleTable
        users={users}
        onView={handleViewUser}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* ADD USER */}

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() =>
          setIsAddUserOpen(false)
        }
        onSave={handleAddUser}
      />

      {/* EDIT USER */}

      <EditUserModal
        isOpen={isEditUserOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditUserOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
      />

      {/* DELETE USER */}

      <DeleteUserModal
        isOpen={isDeleteUserOpen}
        user={selectedUser}
        onClose={() => {
          setIsDeleteUserOpen(false);
          setSelectedUser(null);
        }}
        onDelete={handleDeleteUser}
      />

      {/* EMPLOYEE PROFILE */}

      <EmployeeProfileDrawer
        isOpen={isProfileOpen}
        user={selectedProfile}
        loading={profileLoading}
        onClose={handleCloseProfile}
      />

    </div>
  );
}