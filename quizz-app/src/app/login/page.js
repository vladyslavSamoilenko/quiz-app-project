'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); 
    } catch (err) {
      setError("Nieprawidłowy email lub hasło.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h1>
      
      {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="email" placeholder="Email" 
          className="border p-3 rounded outline-none focus:border-indigo-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Hasło" 
          className="border p-3 rounded outline-none focus:border-indigo-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition">
          Zaloguj
        </button>
      </form>
    </div>
  );
}