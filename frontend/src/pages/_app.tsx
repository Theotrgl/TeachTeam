import { AuthProvider } from "@/context/authContext";
import { CommentProvider } from "@/context/commentContext";
import { CourseProvider } from "@/context/courseContext";
import { DragNDropProvider } from "@/context/dragNDropContext";
import { TutorProvider } from "@/context/tutorContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CourseProvider>
        <TutorProvider>
          <DragNDropProvider>
            <CommentProvider>
              <Toaster position="bottom-center" reverseOrder={false} />
              <Component {...pageProps} />
            </CommentProvider>
          </DragNDropProvider>
        </TutorProvider>
      </CourseProvider>
    </AuthProvider>
  );
}
