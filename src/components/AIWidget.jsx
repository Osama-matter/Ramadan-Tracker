import React, { useState } from 'react';

const AIWidget = ({ onFeatureClick }) => {
    const [input, setInput] = useState('');

    return (
        <div className="mb-6 animate-in fade-in duration-500 delay-500">
            <h2 className="text-[15px] font-bold text-text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-gold to-green-light rounded-sm"></span>
                المرافق الروحاني 🤖
            </h2>

            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-4.5 relative overflow-hidden shadow-lg">
                {/* Glow effect */}
                <div className="absolute -top-5 -left-5 w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(82,183,136,0.2)_0%,transparent_70%)] rounded-full z-0 pointer-events-none"></div>

                <div className="flex items-center gap-2.5 mb-3 relative z-10">
                    <div className="w-2.5 h-2.5 bg-green-light rounded-full shadow-[0_0_8px_rgba(82,183,136,0.6)] animate-pulse"></div>
                    <div className="text-green-light text-xs font-bold font-tajawal">AI Companion — نور</div>
                </div>

                <div className="text-white/85 text-[13px] leading-[1.7] mb-3 relative z-10">
                    أهلاً أحمد! 🌙 أنت على أعتاب إكمال ٣ تسبيحات من أذكار العصر. كيف تشعر اليوم؟ هل تريد دعاءً لتخفيف التوتر؟
                </div>

                <form className="flex gap-2 relative z-10" onSubmit={(e) => { e.preventDefault(); onFeatureClick('ai'); }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اكتب سؤالك الديني..."
                        className="flex-1 bg-black/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-white/30 outline-none focus:border-green-light/50 transition-colors cursor-pointer"
                        onClick={() => onFeatureClick('ai')}
                        readOnly
                    />
                    <button
                        type="button"
                        onClick={() => onFeatureClick('ai')}
                        className="w-10 bg-gradient-to-br from-green-light to-green-mid rounded-xl text-white text-base flex items-center justify-center hover:shadow-[0_0_12px_rgba(82,183,136,0.4)] transition-all active:scale-95"
                    >
                        ↑
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIWidget;
