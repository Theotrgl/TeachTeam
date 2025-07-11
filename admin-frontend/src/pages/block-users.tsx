import { gql, useQuery, useMutation } from "@apollo/client";
import withAuth from "@/lib/withAuth";
import UserUpdateForm from "@/components/userUpdate";
import CreateUserForm from "@/components/createUser";

const GET_USERS = gql`
  query {
    users {
      id
      firstName
      lastName
      isBlocked
      role
    }
  }
`;

const BLOCK_USER = gql`
  mutation ($userId: ID!) {
    blockUser(userId: $userId) {
      id
    }
  }
`;

const UNBLOCK_USER = gql`
  mutation ($userId: ID!) {
    unblockUser(userId: $userId) {
      id
    }
  }
`;

function BlockUsersPage() {
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);

  if (loading) return <p>Loading...</p>;

  const toggleBlock = async (id: string, isBlocked: boolean) => {
    if (isBlocked) {
      await unblockUser({ variables: { userId: id } });
    } else {
      await blockUser({ variables: { userId: id } });
    }
    refetch();
  };

  return (
    <div className="p-8 min-h-screen space-y-10 text-[var(--black)]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage User Access
      </h1>
      <ul className="divide-y divide-gray-200">
        {data.users?.map((u: any) => (
          <li key={u.id} className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold text-gray-900">
                {u.firstName} {u.lastName}
              </span>
              <span className="ml-2 text-sm text-gray-500">({u.role})</span>
            </div>
            <button
              onClick={() => toggleBlock(u.id, u.isBlocked)}
              className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                u.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {u.isBlocked ? "Unblock" : "Block"}
            </button>
          </li>
        ))}
      </ul>

      <CreateUserForm />
      <UserUpdateForm users={data.users} />
    </div>
  );
}

export default withAuth(BlockUsersPage);
