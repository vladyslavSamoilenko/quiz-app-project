'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Błąd: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Załóż konto</h1>
      
      {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Hasło (min. 6 znaków)" 
          className="border p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700 transition">
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}