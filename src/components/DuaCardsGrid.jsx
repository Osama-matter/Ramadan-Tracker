import React from 'react';

const DuaCard = ({ category, text, source, icon }) => {
  return (
    <div className="group relative bg-gradient-to-br from-[#0a0e38]/90 to-[#050826]/85 border border-black/10 rounded-2xl p-5 cursor-pointer transition-all hover:border-gold/40 hover:-translate-y-1 hover:shadow-2xl overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon || '🤲'}</span>
        <span className="text-[10px] text-gold font-bold tracking-widest uppercase border border-gold/20 px-2 py-0.5 rounded-full">
          {category}
        </span>
      </div>

      <p className="text-right text-lg text-ivory font-amiri leading-relaxed mb-4 min-h-[80px]">
        {text}
      </p>

      <div className="flex justify-end border-t border-black/5 pt-3">
        <span className="text-[10px] text-ivory-soft italic">المصدر: {source || 'غير محدد'}</span>
      </div>
    </div>
  );
};

const DuaCardsGrid = ({ cards = [] }) => {
  // Mock data if none provided
  const defaultCards = [
    { cat:'صباح', text:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', source:'مسلم', icon:'🌞' },
    { cat:'إفطار', text:'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', source:'أبو داود', icon:'🌅' },
    { cat:'ليلة القدر', text:'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', source:'الترمذي', icon:'⭐' },
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pb-10">
      {displayCards.map((card, i) => (
        <DuaCard 
          key={i}
          category={card.cat}
          text={card.text}
          source={card.source}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default DuaCardsGrid;
export { DuaCard };
