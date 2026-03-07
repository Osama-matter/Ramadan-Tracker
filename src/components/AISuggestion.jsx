import React from 'react';

const AISuggestion = ({ suggestion }) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1c2e] to-[#0a0c1a] border border-gold-pale/20 shadow-xl mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">✨</span>
        <h3 className="text-gold-pale font-bold text-sm">اقتراح ذكي لك</h3>
      </div>
      <p className="text-text-dark text-sm leading-relaxed mb-3">
        {suggestion || "بناءً على نشاطك، نقترح عليك قراءة أذكار المساء الآن لزيادة طمأنينة قلبك."}
      </p>
      <button className="w-full py-2 bg-gold-pale/10 hover:bg-gold-pale/20 text-gold-pale rounded-xl text-xs font-bold transition-all border border-gold-pale/30">
        ابدأ الآن
      </button>
    </div>
  );
};

export default AISuggestion;
