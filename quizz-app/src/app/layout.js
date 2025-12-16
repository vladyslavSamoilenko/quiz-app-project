import { AuthContextProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Aplikacja Quizowa",
  description: "Projekt na zaliczenie",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="bg-gradient-to-br from-slate-100 to-indigo-50 min-h-screen text-slate-800 font-sans">
        <AuthContextProvider>
          <Navbar />
          <main className="container mx-auto p-4 md:p-8 max-w-5xl">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}