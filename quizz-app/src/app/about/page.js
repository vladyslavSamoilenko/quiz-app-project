'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold mb-2">O Projekcie</h1>
          <p className="text-indigo-100 opacity-90">Aplikacja Quizowa - Projekt Zaliczeniowy</p>
        </div>

        <div className="p-8">
          
          <div className="mb-8 text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-md">
              JA
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Autor: Vladyslav Samoilenko</h2>
            <p className="text-gray-500 mt-2">Student Informatyki</p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Ta aplikacja została stworzona jako projekt zaliczeniowy. 
              Celem było zbudowanie interaktywnego systemu quizów z możliwością 
              zakładania kont, tworzenia własnych pytań i sprawdzania wiedzy.
            </p>
          </div>

          <hr className="my-8 border-gray-100" />

          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Użyte Technologie</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-indigo-50 transition">
              <span className="block font-bold text-gray-700">Next.js 15</span>
              <span className="text-xs text-gray-400">Framework</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-yellow-50 transition">
              <span className="block font-bold text-gray-700">Firebase</span>
              <span className="text-xs text-gray-400">Baza & Auth</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition">
              <span className="block font-bold text-gray-700">Tailwind CSS</span>
              <span className="text-xs text-gray-400">Stylowanie</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-green-50 transition">
              <span className="block font-bold text-gray-700">Vercel</span>
              <span className="text-xs text-gray-400">Hosting</span>
            </div>

          </div>

          <div className="mt-10 text-center">
            <Link href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Wróć do Quizów
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}