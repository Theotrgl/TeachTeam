import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $role: String!
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      role: $role
    ) {
      id
      firstName
      lastName
      role
    }
  }
`;

export default function UserUpdateForm({ users }: { users: any[] }) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const [updateUser, { loading, error, data }] = useMutation(UPDATE_USER);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedUserId(id);

    const selected = users.find((u) => u.id === id);
    if (selected) {
      setFirstName(selected.firstName);
      setLastName(selected.lastName);
      setRole(selected.role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    await updateUser({
      variables: { id: selectedUserId, firstName, lastName, role },
    });

    alert("User updated!");
  };

  return (
    <section className="mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Update User Info</h1>
      <form
        onSubmit={handleSubmit}
        className="border border-gray-300 rounded-md p-6 mb-10 shadow-sm space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Select User</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedUserId}
            onChange={handleSelect}
          >
            <option value="">-- Choose a user --</option>
            {users
              .filter((u) => u.id) // Make sure user has an id
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName || "Unknown"} {u.lastName || ""} (
                  {u.role || "No role"})
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Candidate">Candidate</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update User"}
        </button>

        {error && <p className="text-red-600 text-sm">{error.message}</p>}
        {data && (
          <p className="text-green-600 text-sm">User updated successfully.</p>
        )}
      </form>
    </section>
  );
}
