import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

/**
 * User type definition
 */
export type User = {
  id: number;
  name: string;
  email: string;
};

/**
 * useUsers - Custom hook for user management.
 *
 * Provides:
 * - `users`: current list of users
 * - `loading`: whether data is being fetched
 * - `fetchUsers`, `addUser`, `updateUser`, `deleteUser`, `deleteAllUsers`, `importUsers`:
 *    functions for interacting with the /api endpoints.
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (!res.ok) {
        toast.error("Failed to get users");
        throw new Error("Failed to fetch users");
      }
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("fetchUsers error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(
    async (name: string, email: string) => {
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
        if (!res.ok) throw new Error("Failed to add user");
        await fetchUsers();
        toast.success("User added successfully!");
      } catch (error) {
        toast.error("Failed to add user!");
        console.error("addUser error:", error);
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (id: number, name: string, email: string) => {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
        if (!res.ok) throw new Error("Failed to update user");
        await fetchUsers();
        toast.success("User updated successfully!");
      } catch (error) {
        toast.error("Failed to update user!");
        console.error("updateUser error:", error);
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        await fetchUsers();
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete user!");
        console.error("deleteUser error:", error);
      }
    },
    [fetchUsers]
  );

  const deleteAllUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete all users");
      setUsers([]);
      toast.success("All users deleted");
    } catch (error) {
      toast.error("Failed to delete all users");
      console.error("deleteAllUsers error:", error);
    }
  }, []);

  const importUsers = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/uploadFile", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("File upload failed");
        toast.success("File imported successfully!");
        await fetchUsers();
      } catch (error) {
        toast.error("Failed to import file");
        console.error("importUsers error:", error);
      }
    },
    [fetchUsers]
  );

  // Fetch initial data once
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    importUsers,
  };
}
