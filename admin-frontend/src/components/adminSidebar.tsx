import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { label: "User Access", href: "/block-users" },
  { label: "Courses", href: "/course" },
  { label: "Candidates", href: "/users" },
];

export default function AdminSidebar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="w-64 h-screen bg-[#1e293b] text-white flex flex-col p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-10 text-white">
        Teach<span className="text-primary">Team</span> Admin
      </h1>

      <ul className="space-y-3 flex-1">
        {navItems.map(({ label, href }) => {
          const isActive = router.pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-[#334155] text-[var(--accent)] font-semibold"
                    : "hover:bg-[#475569] text-gray-300"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        Logout
      </button>
    </nav>
  );
}
