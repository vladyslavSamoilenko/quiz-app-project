'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          QuizApp
        </Link>

        <div className="flex gap-4 items-center text-sm font-medium">
          <Link href="/about" className="hover:text-indigo-500">O Autorze</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200">
                Panel (Dodaj Pytania)
              </Link>
              <span className="hidden md:inline text-gray-500">{user.email}</span>
              <button 
                onClick={logout} 
                className="text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-indigo-500">
                Zaloguj
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}