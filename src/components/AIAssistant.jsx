import React, { useState, useRef, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const Typewriter = ({ text, delay = 20, onUpdate }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
        if (onUpdate) onUpdate();
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, onUpdate]);

  return <span>{currentText}</span>;
};

const AVAILABLE_MODELS = [
  "models/gemini-2.0-flash",
  "models/gemma-3-27b-it",
  "models/gemma-3-12b-it",
  "models/gemma-3-4b-it",
  "models/gemini-1.5-flash",
];

const AI_CHAT_HISTORY_KEY = 'athr_ai_chat_history_v1';
const AI_MAX_HISTORY_TURNS = 10;
const COOLDOWN_DURATION = 3000;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const savedHistory = STORAGE_SERVICE.getItem(AI_CHAT_HISTORY_KEY, []);
    if (savedHistory.length > 0) {
      const displayMessages = savedHistory.map((msg, index) => ({
        id: `saved-${index}`,
        text: msg.parts[0].text,
        sender: msg.role === 'user' ? 'user' : 'ai',
        isNew: false
      }));
      setMessages(displayMessages);
    } else {
      setMessages([{ id: 1, text: 'مرحباً بك! أنا مساعدك الذكي في تطبيق أثر. كيف يمكنني مساعدتك اليوم في استفساراتك الدينية والرمضانية؟', sender: 'ai', isNew: true }]);
    }
  }, []);

  useEffect(scrollToBottom, [messages, isLoading]);

  const looksTruncated = (text) => {
    if (!text) return false;
    const t = String(text).trim();
    const endsWithPunctuation = /[.!؟\?…\)\]\}"'»\n]$/.test(t);
    if (endsWithPunctuation) return false;
    return t.length > 500;
  };

  const fetchGeminiResponse = async (userQuery, history) => {
    for (let modelName of AVAILABLE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

        const systemPrompt = `أنت مساعد ذكي لتطبيق "أثر" (رفيق المسلم في رمضان ١٤٤٧ هـ). 
        التطبيق من تطوير "أسامة مطر" كصدقة جارية عن روح والده رحمه الله.
        أجب باللغة العربية بأسلوب ودود وإيماني ومفيد.
        
        ميزة إضافية: يمكنك مساعدة المستخدم في تنظيم أهدافه الرمضانية أو إنشاء خطة كاملة للشهر. 
        إذا طلب المستخدم خطة أو إضافة هدف، قم بصياغة الأهداف في ردك، ثم أضف في نهاية الرد سطراً برمجياً خاصاً بهذا التنسيق:
        [ADD_GOAL: نص الهدف هنا : التصنيف]
        التصنيفات المتاحة: (قرآن، صلاة، صدقة، ذكر، عام).
        إذا طلب "خطة كاملة"، قم بتقسيمها إلى مهام واضحة مستخدماً [ADD_GOAL: ...] لكل مهمة، ثم أضف في النهاية:
        [SAVE_PLAN: نص تعريفي موجز للخطة هنا]
        المهم: اجعل المهام عملية وقابلة للتطبيق وليست مجرد نصائح عامة.`;

        const contents = [
          { role: "user", parts: [{ text: `التعليمات: ${systemPrompt}` }] },
          { role: "model", parts: [{ text: "فهمت، سألتزم بالتعليمات." }] },
          ...history,
          { role: 'user', parts: [{ text: userQuery }] }
        ];

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.7
            }
          })
        });

        const data = await res.json();

        if (res.status === 429 || res.status === 404) {
          console.warn(`النموذج ${modelName} غير متاح حالياً، جاري تجربة البديل...`);
          continue;
        }

        if (data.error) {
          console.error(`Gemini Error Details (${modelName}):`, data.error);
          continue;
        }

        if (data.candidates && data.candidates[0].content) {
          return data.candidates[0].content.parts.map(p => p.text).join('');
        }
      } catch (e) {
        console.error(`خطأ في النموذج ${modelName}:`, e);
      }
    }
    return "⚠️ عذراً، جميع النماذج مشغولة حالياً. يرجى المحاولة لاحقاً.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    const now = Date.now();

    if (!text || isProcessing || (now - lastRequestTime < COOLDOWN_DURATION)) return;

    setIsProcessing(true);
    setLastRequestTime(now);

    const newUserMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const currentHistory = STORAGE_SERVICE.getItem(AI_CHAT_HISTORY_KEY, [])
        .slice(-AI_MAX_HISTORY_TURNS * 2);

      let reply = await fetchGeminiResponse(text, currentHistory);

      // Process potential Goal additions from AI
      const goalMatches = reply.match(/\[ADD_GOAL: (.*?): (.*?)\]/g);
      
      if (goalMatches) {
        const currentGoals = STORAGE_SERVICE.getItem('athr_goals', []);
        let updatedGoals = [...currentGoals];

        goalMatches.forEach(match => {
          const content = match.match(/\[ADD_GOAL: (.*?): (.*?)\]/);
          if (content && content[1]) {
            updatedGoals.push({
              id: Date.now() + Math.random(),
              text: content[1].trim(),
              completed: false,
              category: content[2] ? content[2].trim() : 'عام'
            });
          }
        });

        STORAGE_SERVICE.setItem('athr_goals', updatedGoals);
        // Clean up the reply text from the codes
        reply = reply.replace(/\[ADD_GOAL: (.*?): (.*?)\]/g, '').trim();
        // Dispatch event to update GoalsManager if mounted
        window.dispatchEvent(new CustomEvent('athr_goals_updated'));
      }

      // Process potential Plan saves from AI
      const planMatch = reply.match(/\[SAVE_PLAN: ([\s\S]*?)\]/);
      if (planMatch && planMatch[1]) {
        const planText = planMatch[1].trim();
        STORAGE_SERVICE.setItem('athr_ramadan_plan', planText);
      }

      // Also extract goals specifically for the planner tasks if they exist in this reply
      const currentPlannerTasks = STORAGE_SERVICE.getItem('athr_planner_tasks', []);
      const goalMatchesInPlan = reply.match(/\[ADD_GOAL: (.*?): (.*?)\]/g);

      if (goalMatchesInPlan) {
        const newPlannerTasks = goalMatchesInPlan.map(match => {
          const content = match.match(/\[ADD_GOAL: (.*?): (.*?)\]/);
          return {
            id: Date.now() + Math.random(),
            text: content[1].trim(),
            completed: false,
            category: content[2] ? content[2].trim() : 'عام'
          };
        });
        // Merge with current tasks
        STORAGE_SERVICE.setItem('athr_planner_tasks', [...currentPlannerTasks, ...newPlannerTasks]);
      }

      reply = reply.replace(/\[SAVE_PLAN: ([\s\S]*?)\]/g, '').trim();
      window.dispatchEvent(new CustomEvent('athr_plan_updated'));

      if (looksTruncated(reply)) {
        const contPrompt = 'أكمل من حيث توقفت في إجابتك السابقة، بدون إعادة ما سبق، واختتم بجملة كاملة.';
        const extraHistory = [
          ...currentHistory,
          { role: 'user', parts: [{ text }] },
          { role: 'model', parts: [{ text: reply }] }
        ];
        const reply2 = await fetchGeminiResponse(contPrompt, extraHistory);
        reply = [reply, reply2].filter(Boolean).join('\n').trim();
      }

      const newAiMsg = { id: Date.now() + 1, text: reply, sender: 'ai', isNew: true };
      setMessages(prev => [...prev, newAiMsg]);

      const updatedHistory = [
        ...currentHistory,
        { role: 'user', parts: [{ text }] },
        { role: 'model', parts: [{ text: reply }] }
      ].slice(-AI_MAX_HISTORY_TURNS * 2);

      STORAGE_SERVICE.setItem(AI_CHAT_HISTORY_KEY, updatedHistory);

    } catch (err) {
      console.error('AI error:', err);
      setMessages(prev => [...prev, { id: Date.now() + 2, text: '⚠️ حدث خطأ في المساعد.', sender: 'ai', isNew: true }]);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] pb-2 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6 p-4 bg-gold/10 rounded-2xl border border-gold/20 shadow-lg shrink-0">
        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-xl animate-pulse">🤖</div>
        <div>
          <h2 className="text-gold font-bold font-scheherazade text-lg">المساعد الذكي</h2>
          <p className="text-[10px] text-text-mid font-amiri tracking-wider">مساعدك في المسائل الرمضانية والعبادات</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-md transition-all ${msg.sender === 'user'
              ? 'bg-green-main text-white font-bold rounded-tr-none'
              : 'bg-surface text-text-dark border border-black/5 rounded-tl-none font-amiri text-base shadow-sm'
              }`}>
              {msg.sender === 'ai' && msg.isNew ? (
                <Typewriter text={msg.text} delay={15} onUpdate={scrollToBottom} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-surface p-4 rounded-3xl rounded-tl-none border border-black/5 flex gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2 p-1 bg-black/5 rounded-2xl border border-black/10 shadow-inner">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="اسأل عن الصيام، النية، أو ليلة القدر..."
          className="flex-1 bg-transparent px-4 py-3 text-sm text-text-dark outline-none transition-all placeholder:text-text-mid/50"
        />
        <button
          type="submit"
          disabled={isLoading || isProcessing}
          className={`bg-gold text-green-main px-5 rounded-xl font-bold transition-all active:scale-95 ${isLoading || isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'}`}
        >
          {isLoading ? '...' : '✦'}
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
