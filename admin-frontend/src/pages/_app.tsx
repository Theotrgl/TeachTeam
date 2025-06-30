import "@/styles/globals.css";
import type { AppProps } from "next/app";
import client from "../lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import AdminLayout from "@/components/adminLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  return (
    <ApolloProvider client={client}>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      )}
    </ApolloProvider>
  );
}
