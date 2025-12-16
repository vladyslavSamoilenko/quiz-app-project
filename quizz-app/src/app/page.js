'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import QuizCard from '@/components/QuizCard';
import Link from 'next/link';

export default function Home() {
  const { user, loading: authLoading } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [score, setScore] = useState(0);
  const [totalMaxScore, setTotalMaxScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!user) return; 

    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffled);

        const max = shuffled.reduce((acc, q) => acc + (q.points || 1), 0);
        setTotalMaxScore(max);

      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchQuestions();
  }, [user]); 

  const handleAnswer = (pointsEarned) => {
    setScore(prev => prev + pointsEarned);
    setAnsweredCount(prev => prev + 1);
  };

  const finishQuiz = () => {
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetQuiz = () => {
    window.location.reload();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl border-t-8 border-purple-600 max-w-lg w-full">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
            Q
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Witaj w QuizApp</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            To jest system egzaminacyjny. Aby zobaczyć pytania i sprawdzić swoją wiedzę, musisz się zalogować.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition shadow-md">
              Zaloguj się
            </Link>
            <Link href="/register" className="w-full bg-white border-2 border-purple-600 text-purple-700 py-3 rounded-lg font-bold hover:bg-purple-50 transition">
              Załóż konto
            </Link>
          </div>
        </div>
        <p className="mt-8 text-gray-400 text-sm">Projekt zaliczeniowy</p>
      </div>
    );
  }
  
  if (dataLoading) return <div className="text-center p-10 text-purple-600">Przygotowywanie pytań...</div>;

  if (showResult) {
    const percentage = totalMaxScore > 0 ? Math.round((score / totalMaxScore) * 100) : 0;
    let message = "Dobra robota!";
    if (percentage === 100) message = "Perfekcyjnie! Jesteś mistrzem!";
    else if (percentage < 50) message = "Musisz jeszcze poćwiczyć.";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fadeIn">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
          <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
            {score}/{totalMaxScore}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Twój Wynik</h1>
          <p className="text-sm text-gray-500 mb-4">Zdobyte Punkty</p>
          <p className="text-5xl font-extrabold text-purple-600 mb-4">{percentage}%</p>
          <p className="text-gray-500 mb-8 text-lg">{message}</p>
          
          <button onClick={resetQuiz} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition shadow-lg">
            Spróbuj ponownie
          </button>
          <Link href="/dashboard" className="block mt-4 text-gray-400 hover:text-purple-600 text-sm">
            Wróć do Panelu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="bg-white rounded-t-lg border-t-8 border-purple-600 shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wielki Test Wiedzy</h1>
        <p className="text-gray-600">Odpowiedz na wszystkie pytania i sprawdź swój wynik.</p>
        <p className="text-sm text-purple-600 font-bold mt-2">Maksymalnie do zdobycia: {totalMaxScore} pkt</p>
        <p className="text-xs text-gray-400 mt-4 text-right">Zalogowano jako: {user.email}</p>
      </div>

      {questions.length === 0 ? (
        <div className="text-center p-10 bg-white rounded shadow">
          <p>Brak pytań w bazie.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <QuizCard 
              key={q.id} 
              question={q} 
              onAnswer={handleAnswer} 
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg p-4 z-40">
        <div className="max-w-[770px] mx-auto flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Twój Postęp</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-purple-600">{answeredCount}</span>
              <span className="text-gray-400">/ {questions.length} pytań</span>
            </div>
          </div>
          
          <button 
            onClick={finishQuiz}
            className={`px-8 py-3 rounded font-bold transition shadow-md
              ${answeredCount === questions.length 
                ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
            `}
          >
            Zakończ Quiz
          </button>
        </div>
      </div>
    </div>
  );
}