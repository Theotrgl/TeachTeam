import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function withAuth(Component: React.FC) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;

    return <Component {...props} />;
  };
}
