"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThreeDot } from "react-loading-indicators";
import { toast } from "sonner";
import * as Accordion from "@radix-ui/react-accordion";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialog";
import { useUsers, User } from "@/hooks/useUsers";

export default function UsersPage() {
  // Use custom hook for API interactions
  const {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    importUsers,
  } = useUsers();

  // Local UI state for editing, form inputs, search, and sorting
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [emailError, setEmailError] = useState("");
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Scroll-up button visibility (threshold 150px)
  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 150) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Local form validation & reset
  function validateEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format, should be like tony@gmail.com");
      return false;
    }
    setEmailError("");
    return true;
  }

  function resetForm() {
    setEditingUserId(null);
    setName("");
    setEmail("");
    setEmailError("");
    setSubmitAttempt(false);
  }

  // Handlers for add/update
  async function handleAddUser() {
    if (!name || !email) {
      setSubmitAttempt(true);
      toast.error("Name and email are required!");
      return;
    }
    if (!validateEmail(email)) {
      setSubmitAttempt(true);
      return;
    }
    setSubmitAttempt(false);
    await addUser(name, email);
    resetForm();
  }

  async function handleUpdateUser() {
    if (!editingUserId || !name || !email) {
      setSubmitAttempt(true);
      toast.error("All fields are required!");
      return;
    }
    if (!validateEmail(email)) {
      setSubmitAttempt(true);
      return;
    }
    setSubmitAttempt(false);
    await updateUser(editingUserId, name, email);
    resetForm();
  }

  // Local handler for editing a user
  function handleEditUser(user: User) {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  }

  // Handler for file import
  async function handleImportUsers() {
    if (!file) {
      toast.error("No file selected");
      return;
    }
    await importUsers(file);
  }

  // Filtering and sorting
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  function handleSort(column: keyof User) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] p-4">
      {/** SECTION 1 (Sticky): Title + inputs + add/delete + search */}
      <div className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {editingUserId ? "Edit User" : "User Management"}
        </h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            className={`w-full sm:w-auto flex-1 ${submitAttempt && !name ? "border border-red-500" : ""}`}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="w-full sm:w-auto flex-1">
            <Input
              className={`w-full ${(submitAttempt && !email) || emailError ? "border border-red-500" : ""}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
          </div>
          {editingUserId ? (
            <>
              <Button onClick={handleUpdateUser}>Save</Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAddUser}>Add User</Button>
              <DeleteConfirmationDialog
                onConfirm={deleteAllUsers}
                trigger={<Button variant="destructive">Delete All users</Button>}
                description={"This action cannot be undone. This will permanently delete all users."}
              />
            </>
          )}
        </div>
        {/* Search input (1/3 width) */}
        <div className="mb-2">
          <Input
            className="w-1/3"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/** NON-STICKY: Import Accordion */}
      <div className="mt-4">
        <Accordion.Root type="single" collapsible className="mb-4">
          <Accordion.Item value="import">
            <Accordion.Trigger className="flex w-full justify-between rounded-md bg-gray-200 px-4 py-2 text-left font-medium hover:bg-gray-300">
              Import users
            </Accordion.Trigger>
            <Accordion.Content className="mt-2 p-4 border border-gray-300 rounded-md">
              <div className="flex items-center gap-4">
                <Button asChild>
                  <label htmlFor="fileUpload" className="cursor-pointer">Choose File</label>
                </Button>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                {file && <div className="text-gray-700">Selected: {file.name}</div>}
                <Button onClick={handleImportUsers}>Import XLSX</Button>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      {/** USERS TABLE */}
      {loading ? (
        <div className="flex items-center justify-center p-6">
          <ThreeDot
            variant="bounce"
            color="#000000"
            size="large"
            text="Loading data"
            textColor=""
          />
        </div>
      ) : sortedUsers.length > 0 ? (
        <div className="p-6 overflow-x-auto">
          <Table className="table-auto min-w-full">
            <TableHeader>
              <TableRow className="bg-white z-40">
                <TableHead onClick={() => handleSort("id")} className="cursor-pointer">
                  ID {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                </TableHead>
                <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                  Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </TableHead>
                <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                  Email {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="flex gap-4">
                    <Button variant="outline" onClick={() => handleEditUser(user)}>
                      Update
                    </Button>
                    <DeleteConfirmationDialog
                      onConfirm={() => deleteUser(user.id)}
                      trigger={<Button variant="destructive">Delete</Button>}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4 p-6">
          <h2 className="text-lg font-semibold">No users found</h2>
          {searchTerm.trim() ? (
            <p className="text-sm">No records matching your search</p>
          ) : (
            <p>Add users to see them here.</p>
          )}
        </div>
      )}

      {/** SCROLL UP BUTTON (conditionally rendered) */}
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
