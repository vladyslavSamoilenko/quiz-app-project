'use client';
import { useState } from 'react';

export default function QuizCard({ question, onAnswer }) {
  const [answer, setAnswer] = useState(question.type === 'multiple_choice' ? [] : {});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState(null);

  const maxPoints = question.points || 1;

  const handleSingle = (id) => setAnswer(id);
  const handleMulti = (id) => setAnswer(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleBlank = (index, val) => setAnswer(prev => ({ ...prev, [index]: val }));
  const handlePairClick = (side, id) => {
    if (side === 'left') setSelectedLeft(id);
    else if (selectedLeft) {
      setAnswer(prev => ({ ...prev, [selectedLeft]: id }));
      setSelectedLeft(null);
    }
  };

  const submitAnswer = () => {
    if (isSubmitted) return; 

    setIsSubmitted(true);
    let points = 0;

    if (question.type === 'single_choice') {
       const correctOption = question.options.find(o => o.isCorrect);
       if (answer === correctOption?.id) points = maxPoints;
    } 
    else if (question.type === 'multiple_choice') {
       question.options.forEach(opt => {
         if (opt.isCorrect && answer.includes(opt.id)) {
           points += (opt.points || 1);
         }
       });
    }
    else if (question.type === 'pairs') {
       const correctMap = question.correctPairs || {};
       if (Object.keys(correctMap).length > 0 && Object.keys(correctMap).every(key => answer[key] === correctMap[key])) {
         points = maxPoints;
       }
    }
    else if (question.type === 'blanks') {
      const correctList = question.correctAnswers || [];
      const weights = question.answerWeights || []; 
      correctList.forEach((correctWord, index) => {
        const userWord = (answer[index] || "").trim();
        if (userWord === correctWord) {
          points += (weights[index] || 1);
        }
      });
    }

    if (onAnswer) {
      onAnswer(points);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden relative group transition-all duration-300
      ${isSubmitted ? 'opacity-80' : 'hover:shadow-md'} 
      ${isSubmitted ? 'border-l-4 border-l-gray-400' : 'border-l-4 border-l-purple-600'}
    `}>
      
      {!isSubmitted && <div className="h-2 bg-purple-600 w-full absolute top-0 left-0 hidden group-hover:block"></div>}

      <div className="p-6 pt-8 relative">
        
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded border border-gray-200">
           {maxPoints} pkt
        </div>

        <h3 className="text-lg text-gray-900 font-medium mb-2 pr-10">
          {question.title}
          <span className="text-red-500 ml-1 text-sm">*</span>
        </h3>

        <div className="text-sm text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: question.content }} />

        <div className={`space-y-4 ${isSubmitted ? 'pointer-events-none' : ''}`}>
          
          {question.type === 'single_choice' && question.options?.map(opt => (
            <label key={opt.id} className={`flex items-center gap-3 cursor-pointer p-2 rounded transition 
              ${answer === opt.id ? 'bg-purple-100 border border-purple-200' : 'hover:bg-gray-50'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answer === opt.id ? 'border-purple-600' : 'border-gray-400'}`}>
                {answer === opt.id && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
              </div>
              <span className="text-gray-700">{opt.text}</span>
              <button className="hidden" onClick={() => handleSingle(opt.id)} disabled={isSubmitted} />
            </label>
          ))}

          {question.type === 'multiple_choice' && question.options?.map(opt => (
            <label key={opt.id} className={`flex items-center gap-3 cursor-pointer p-2 rounded transition 
               ${answer.includes(opt.id) ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'}`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${answer.includes(opt.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-400'}`}>
                 {answer.includes(opt.id) && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-gray-700">{opt.text}</span>
              <input type="checkbox" className="hidden" checked={answer.includes(opt.id)} onChange={() => handleMulti(opt.id)} disabled={isSubmitted} />
            </label>
          ))}

          {question.type === 'pairs' && (
             <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-4">
               <div className="space-y-2">
                 <p className="text-xs font-bold text-gray-400 uppercase">Elementy</p>
                 {question.leftItems?.map(item => (
                   <div key={item.id} onClick={() => !isSubmitted && !answer[item.id] && handlePairClick('left', item.id)}
                     className={`p-3 rounded border cursor-pointer text-sm text-center transition ${selectedLeft === item.id ? 'bg-purple-100 border-purple-500 text-purple-800' : 'bg-white border-gray-300'} ${answer[item.id] ? 'bg-gray-200 text-gray-500 border-transparent cursor-default' : ''}`}>
                     {item.text}
                   </div>
                 ))}
               </div>
               <div className="space-y-2">
                 <p className="text-xs font-bold text-gray-400 uppercase">Dopasuj do</p>
                 {question.rightItems?.map(item => (
                   <div key={item.id} onClick={() => !isSubmitted && handlePairClick('right', item.id)}
                     className="p-3 rounded border border-gray-300 bg-white text-sm text-center hover:bg-gray-50 cursor-pointer">
                     {item.text}
                   </div>
                 ))}
               </div>
             </div>
          )}

          {question.type === 'blanks' && question.textParts && (
            <div className="leading-loose text-gray-800 text-lg">
               {question.textParts.map((part, idx) => (
                 <span key={idx}>
                   {part}
                   {idx < question.textParts.length - 1 && (
                     <select onChange={(e) => handleBlank(idx, e.target.value)} disabled={isSubmitted}
                       className="mx-2 border-b-2 border-purple-200 text-purple-700 font-bold bg-transparent py-1 px-2 focus:border-purple-600 focus:bg-purple-50 outline-none transition cursor-pointer">
                       <option value="">...</option>
                       {question.availableOptions?.map(o => <option key={o} value={o}>{o}</option>)}
                     </select>
                   )}
                 </span>
               ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4">
          {!isSubmitted ? (
            <button onClick={submitAnswer} className="bg-purple-600 text-white font-bold text-sm uppercase tracking-wide hover:bg-purple-700 px-6 py-2.5 rounded shadow-sm hover:shadow transition">
              Zatwierdź
            </button>
          ) : (
            <span className="font-bold text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
              Odpowiedź zapisana
            </span>
          )}
        </div>
      </div>
    </div>
  );
}