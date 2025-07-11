import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    createUser(
      input: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        role: $role
      }
    ) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

export default function CreateUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Candidate");

  const [createUser, { loading, error, data }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser({
        variables: { firstName, lastName, email, password, role },
      });

      alert("User created!");
      window.location.reload(); // <-- Reloads the page after successful creation
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <section className="mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New User</h1>
      <form
        onSubmit={handleSubmit}
        className="border border-gray-300 rounded-md p-6 mb-10 shadow-sm space-y-4"
      >
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
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>

        {error && <p className="text-red-600 text-sm">{error.message}</p>}
        {data && (
          <p className="text-green-600 text-sm">User created successfully.</p>
        )}
      </form>
    </section>
  );
}
