import React from 'react';
import { Share } from '@capacitor/share';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'تطبيق أثر',
        text: 'هذا التطبيق صدقة جارية عن روح والدي رحمه الله. نسألكم الدعاء له بالرحمة والمغفرة.',
        url: 'https://athar-app.netlify.app',
        dialogTitle: 'شارك التطبيق ولك الأجر',
      });
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-surface dark:bg-[#1a1c23] rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-right overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full text-gold-dark text-xl hover:bg-black/10 transition-colors"
          >✕</button>

          <div className="p-8 text-center">
            <div className="mb-6 relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-gold/40 p-1 relative z-10 overflow-hidden bg-black/5">
                <img src="/Imge/Dad.png" alt="رحمه الله" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -inset-4 bg-gold/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <div className="absolute -inset-4 bg-gold/10 rounded-full blur-2xl animate-pulse"></div>
          </div>

          <h2 className="text-2xl font-bold text-gold font-scheherazade mb-6">تطبيق أثر</h2>

          <p className="text-text-dark text-sm leading-relaxed font-amiri mb-8">
            هذا التطبيق صدقة جارية عن روح والدي رحمه الله.<br />
            نسألكم الدعاء له بالرحمة والمغفرة ولجميع موتى المسلمين.
          </p>

          <div className="bg-gold/5 border border-gold/10 rounded-2xl p-4 mb-6">
            <p className="text-gold text-[10px] mb-3">شارك التطبيق ولك الأجر بإذن الله</p>
            <button
              onClick={handleShare}
              className="w-full py-3 bg-gold text-green-main font-bold rounded-xl active:scale-95 transition-all shadow-lg"
            >
              📢 مشاركة التطبيق
            </button>
          </div>

          <div className="text-[10px] text-text-mid opacity-50">النسخة ٢.٠.٠</div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
