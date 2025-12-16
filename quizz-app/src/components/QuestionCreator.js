'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

export default function QuestionCreator({ questionToEdit, onCancel, onSuccess }) {
  const [type, setType] = useState('single_choice');
  const [title, setTitle] = useState('');
  const [globalPoints, setGlobalPoints] = useState(1);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [options, setOptions] = useState([{ id: Date.now(), text: '', isCorrect: false, points: 1 }]);
  const [pairs, setPairs] = useState([{ id: Date.now(), left: '', right: '' }]);
  const [blankSegments, setBlankSegments] = useState([{ id: Date.now(), text: '', correct: '', points: 1 }]);
  const [blankEndText, setBlankEndText] = useState('');
  const [blankDistractors, setBlankDistractors] = useState('');

  useEffect(() => {
    if (questionToEdit) {
      setType(questionToEdit.type);
      setTitle(questionToEdit.title);
      setContent(questionToEdit.content.replace(/<\/?p>/g, ''));
      
      if (questionToEdit.type === 'single_choice' || questionToEdit.type === 'pairs') {
        setGlobalPoints(questionToEdit.points || 1);
      }

      if (questionToEdit.options) setOptions(questionToEdit.options);

      if (questionToEdit.leftItems && questionToEdit.correctPairs) {
        const reconstructedPairs = questionToEdit.leftItems.map((lItem) => {
          const rId = questionToEdit.correctPairs[lItem.id];
          const rItem = questionToEdit.rightItems.find(r => r.id === rId);
          return { id: Date.now() + Math.random(), left: lItem.text, right: rItem ? rItem.text : '' };
        });
        setPairs(reconstructedPairs);
      }

      if (questionToEdit.textParts && questionToEdit.correctAnswers) {
        const segments = [];
        const weights = questionToEdit.answerWeights || [];
        
        questionToEdit.correctAnswers.forEach((ans, index) => {
          segments.push({
            id: Date.now() + index,
            text: questionToEdit.textParts[index] || '',
            correct: ans,
            points: weights[index] || 1
          });
        });
        setBlankSegments(segments);
        if (questionToEdit.textParts.length > questionToEdit.correctAnswers.length) {
          setBlankEndText(questionToEdit.textParts[questionToEdit.textParts.length - 1]);
        }
        if (questionToEdit.availableOptions) {
             const usedWords = new Set(questionToEdit.correctAnswers);
             const dists = questionToEdit.availableOptions.filter(x => !usedWords.has(x));
             setBlankDistractors(dists.join(', '));
        }
      }
    } else {
      resetForm();
    }
  }, [questionToEdit]);

  const resetForm = () => {
    setTitle('');
    setGlobalPoints(1);
    setContent('');
    setOptions([{ id: Date.now(), text: '', isCorrect: false, points: 1 }]);
    setPairs([{ id: Date.now(), left: '', right: '' }]);
    setBlankSegments([{ id: Date.now(), text: '', correct: '', points: 1 }]);
    setBlankEndText('');
    setBlankDistractors('');
    setType('single_choice');
  };

  const addOption = () => setOptions([...options, { id: Date.now(), text: '', isCorrect: false, points: 1 }]);
  const removeOption = (id) => setOptions(options.filter(o => o.id !== id));
  const updateOption = (id, f, v) => setOptions(options.map(o => o.id === id ? { ...o, [f]: v } : o));

  const addPair = () => setPairs([...pairs, { id: Date.now(), left: '', right: '' }]);
  const removePair = (id) => setPairs(pairs.filter(p => p.id !== id));
  const updatePair = (id, f, v) => setPairs(pairs.map(p => p.id === id ? { ...p, [f]: v } : p));

  const addBlankSegment = () => setBlankSegments([...blankSegments, { id: Date.now(), text: '', correct: '', points: 1 }]);
  const removeBlankSegment = (id) => setBlankSegments(blankSegments.filter(s => s.id !== id));
  const updateBlankSegment = (id, f, v) => setBlankSegments(blankSegments.map(s => s.id === id ? { ...s, [f]: v } : s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      let calculatedTotalPoints = 0;

      if (type === 'multiple_choice') {
        calculatedTotalPoints = options.reduce((sum, opt) => (opt.isCorrect ? sum + parseInt(opt.points || 1) : sum), 0);
      } else if (type === 'blanks') {
        calculatedTotalPoints = blankSegments.reduce((sum, seg) => sum + parseInt(seg.points || 1), 0);
      } else {
        calculatedTotalPoints = parseInt(globalPoints) || 1;
      }

      let payload = {
        title,
        points: calculatedTotalPoints, 
        content: `<p>${content}</p>`,
        type,
      };

      if (type === 'single_choice' || type === 'multiple_choice') {
        payload.options = options.filter(o => o.text.trim() !== '').map(o => ({
          ...o,
          points: parseInt(o.points) || 1
        }));
      } 
      else if (type === 'pairs') {
        const validPairs = pairs.filter(p => p.left.trim() && p.right.trim());
        payload.leftItems = validPairs.map((p, i) => ({ id: `l_${i}`, text: p.left }));
        payload.rightItems = validPairs.map((p, i) => ({ id: `r_${i}`, text: p.right }));
        let correctMap = {};
        validPairs.forEach((p, i) => { correctMap[`l_${i}`] = `r_${i}`; });
        payload.correctPairs = correctMap;
      } 
      else if (type === 'blanks') {
        const textParts = [...blankSegments.map(s => s.text), blankEndText];
        const correctAnswers = blankSegments.map(s => s.correct).filter(c => c.trim() !== '');
        const answerWeights = blankSegments.map(s => parseInt(s.points) || 1);
        
        const distractorsList = blankDistractors.split(',').map(s => s.trim()).filter(s => s !== '');
        const availableOptions = Array.from(new Set([...correctAnswers, ...distractorsList])).sort();
        
        payload.textParts = textParts;
        payload.correctAnswers = correctAnswers;
        payload.answerWeights = answerWeights;
        payload.availableOptions = availableOptions;
      }

      if (questionToEdit) {
        const docRef = doc(db, 'questions', questionToEdit.id);
        await updateDoc(docRef, payload);
        setMsg('Zaktualizowano pytanie!');
      } else {
        await addDoc(collection(db, 'questions'), payload);
        setMsg('Dodano nowe pytanie!');
        resetForm();
      }

      if (onSuccess) onSuccess();

    } catch (err) {
      setMsg('Błąd: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-8 border-t-purple-600">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {questionToEdit ? 'Edytuj Pytanie' : 'Stwórz Nowe Pytanie'}
        </h2>
        {questionToEdit && <button onClick={onCancel} className="text-sm text-gray-500 underline">Anuluj</button>}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!questionToEdit && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rodzaj pytania</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-purple-500 outline-none">
                <option value="single_choice">Pojedynczy Wybór</option>
                <option value="multiple_choice">Wielokrotny Wybór (Punkty za opcję)</option>
                <option value="pairs">Dopasowanie Par</option>
                <option value="blanks">Uzupełnianie Luk (Punkty za lukę)</option>
            </select>
            </div>
        )}

        <div className="flex gap-4">
          <div className="flex-grow">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Treść Pytania</label>
            <input type="text" placeholder="Np. Stolica Polski" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-purple-500 outline-none text-lg font-medium" />
          </div>
          
          {(type === 'single_choice' || type === 'pairs') && (
            <div className="w-24">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Punkty</label>
               <input type="number" min="1" max="100" required value={globalPoints} onChange={e => setGlobalPoints(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-purple-500 outline-none text-lg font-medium text-center" />
            </div>
          )}
        </div>

        <input type="text" placeholder="Dodatkowy opis (opcjonalne)" value={content} onChange={e => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:border-purple-500 outline-none text-sm" />

        {(type === 'single_choice' || type === 'multiple_choice') && (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
             <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase px-1">
                <span>Poprawna</span>
                <span className="flex-grow ml-2">Treść odpowiedzi</span>
                {type === 'multiple_choice' && <span className="w-16 text-center">Punkty</span>}
                <span className="w-6"></span>
             </div>
            {options.map((opt, i) => (
              <div key={opt.id} className="flex gap-2 mb-2 items-center">
                <input type="checkbox" checked={opt.isCorrect} onChange={(e) => updateOption(opt.id, 'isCorrect', e.target.checked)}
                  className="w-5 h-5 accent-purple-600" title="Czy poprawna?" />
                
                <input type="text" placeholder={`Opcja ${i + 1}`} value={opt.text} onChange={(e) => updateOption(opt.id, 'text', e.target.value)}
                  className="flex-grow p-2 border rounded focus:border-purple-500 outline-none" required />
                
                {type === 'multiple_choice' && (
                  <input type="number" min="0" value={opt.points} onChange={(e) => updateOption(opt.id, 'points', e.target.value)}
                    disabled={!opt.isCorrect}
                    className={`w-16 p-2 border rounded text-center outline-none ${!opt.isCorrect ? 'bg-gray-200 text-gray-400' : 'bg-white border-purple-300'}`}
                    title="Liczba punktów za tę odpowiedź"
                  />
                )}
                
                <button type="button" onClick={() => removeOption(opt.id)} className="text-gray-400 hover:text-red-500 px-2 font-bold">X</button>
              </div>
            ))}
            <button type="button" onClick={addOption} className="text-sm text-purple-600 font-bold hover:underline mt-2">+ Dodaj opcję</button>
          </div>
        )}

        {type === 'pairs' && (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            {pairs.map((p) => (
              <div key={p.id} className="flex gap-2 mb-2 items-center">
                <input type="text" placeholder="Lewa" value={p.left} onChange={(e) => updatePair(p.id, 'left', e.target.value)} className="w-1/2 p-2 border rounded outline-none" required />
                <span>↔</span>
                <input type="text" placeholder="Prawa" value={p.right} onChange={(e) => updatePair(p.id, 'right', e.target.value)} className="w-1/2 p-2 border rounded outline-none" required />
                <button type="button" onClick={() => removePair(p.id)} className="text-gray-400 hover:text-red-500 px-2 font-bold">X</button>
              </div>
            ))}
            <button type="button" onClick={addPair} className="text-sm text-purple-600 font-bold hover:underline mt-2">+ Dodaj parę</button>
          </div>
        )}

        {/* --- LUKI --- */}
        {type === 'blanks' && (
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            {blankSegments.map((seg, i) => (
              <div key={seg.id} className="flex flex-col md:flex-row gap-2 mb-3 border-b pb-3">
                <input type="text" placeholder="Tekst przed" value={seg.text} onChange={(e) => updateBlankSegment(seg.id, 'text', e.target.value)} className="flex-grow p-2 border rounded outline-none" />
                
                <div className="flex gap-2 w-full md:w-1/2">
                   <input type="text" placeholder="Poprawna luka" value={seg.correct} onChange={(e) => updateBlankSegment(seg.id, 'correct', e.target.value)} 
                     className="w-2/3 p-2 bg-purple-50 border border-purple-200 rounded outline-none font-bold" required />
                   
                   <div className="w-1/3 relative">
                      <span className="absolute -top-3 left-0 text-[10px] text-gray-500 font-bold uppercase">Punkty</span>
                      <input type="number" min="1" value={seg.points} onChange={(e) => updateBlankSegment(seg.id, 'points', e.target.value)}
                       className="w-full p-2 border border-purple-200 rounded text-center font-bold text-purple-700" title="Punkty za tę lukę" />
                   </div>
                </div>

                <button type="button" onClick={() => removeBlankSegment(seg.id)} className="text-red-400 hover:text-red-600 px-2 font-bold">X</button>
              </div>
            ))}
            <button type="button" onClick={addBlankSegment} className="text-sm text-purple-600 font-bold hover:underline mb-4">+ Dodaj segment</button>
            <input type="text" placeholder="Zakończenie zdania" value={blankEndText} onChange={(e) => setBlankEndText(e.target.value)} className="w-full p-2 border rounded mb-2 outline-none" />
            <input type="text" placeholder="Dystraktory (po przecinku)" value={blankDistractors} onChange={(e) => setBlankDistractors(e.target.value)} className="w-full p-2 border rounded outline-none" />
          </div>
        )}

        <button type="submit" disabled={loading} className={`w-full text-white p-3 rounded font-bold shadow-md transition ${questionToEdit ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
          {loading ? 'Przetwarzanie...' : (questionToEdit ? 'Zapisz Zmiany' : 'Utwórz Pytanie')}
        </button>
        {msg && <p className="text-center font-bold text-green-600 mt-2">{msg}</p>}
      </form>
    </div>
  );
}