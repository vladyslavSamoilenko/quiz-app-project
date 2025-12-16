'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import QuestionCreator from '@/components/QuestionCreator';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // 1. OCHRONA: Przekierowanie, jeśli brak użytkownika
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 2. POBIERANIE DANYCH (Tylko gdy jest użytkownik)
  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "questions"), orderBy("title"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(data);
    });

    return () => unsubscribe();
  }, [user]);

  // --- LOGIKA EDYCJI/USUWANIA ---
  const handleDelete = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć to pytanie?")) {
      await deleteDoc(doc(db, "questions", id));
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  // --- 3. KLUCZOWY MOMENT: BLOKADA WIDOKU ---
  
  // A) Jeśli Firebase jeszcze sprawdza, czy jesteś zalogowany -> Pokaż ekran ładowania
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // B) Jeśli skończył sprawdzać i nie ma usera -> Nie pokazuj NIC (bo useEffect zaraz przekieruje)
  if (!user) {
    return null; 
  }

  // C) Jeśli jesteś tu, to znaczy że jesteś zalogowany -> Pokaż Panel
  return (
    <div className="max-w-3xl mx-auto pb-20 pt-6">
      
      {/* Nagłówek Panelu */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-purple-600">
        <h1 className="text-2xl font-bold text-gray-800">Panel Zarządzania</h1>
        <p className="text-gray-500">Zalogowany jako: <span className="font-bold text-purple-600">{user.email}</span></p>
      </div>

      {/* Kreator */}
      <div className="mb-10">
        <QuestionCreator 
          questionToEdit={editingQuestion} 
          onCancel={handleCancelEdit}
          onSuccess={() => setEditingQuestion(null)}
        />
      </div>

      {/* Lista Pytań */}
      <h2 className="text-xl font-bold text-gray-700 mb-4 pl-2 border-l-4 border-gray-300">
        Twoje Pytania ({questions.length})
      </h2>

      <div className="space-y-4">
        {questions.length === 0 && (
          <p className="text-gray-400 italic text-center py-4">Brak pytań. Dodaj pierwsze powyżej!</p>
        )}

        {questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  {translateType(q.type)}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                  {q.points || 1} pkt
                </span>
                <h3 className="font-bold text-gray-800 text-lg ml-2">{q.title}</h3>
              </div>
              <div className="text-sm text-gray-500 line-clamp-1" dangerouslySetInnerHTML={{__html: q.content}} />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => handleEdit(q)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition">
                Edytuj
              </button>
              <button onClick={() => handleDelete(q.id)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded transition">
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Funkcja pomocnicza
function translateType(type) {
  switch(type) {
    case 'single_choice': return 'Pojedynczy';
    case 'multiple_choice': return 'Wielokrotny';
    case 'pairs': return 'Pary';
    case 'blanks': return 'Luki';
    default: return type;
  }
}