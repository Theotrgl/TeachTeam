import { NavBar } from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="overflow-y-auto scrollbar-hidden">{children}</main>
    </>
  );
}
