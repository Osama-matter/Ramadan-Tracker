import React, { useState, useEffect } from 'react';
import { QURAN_SERVICE } from '../services/quranService';
import { STORAGE_SERVICE } from '../services/storageService';

const TafsirSection = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [selectedAyahNum, setSelectedAyahNum] = useState(1);
  const [tafsir, setTafsir] = useState(null);
  const [loading, setLoading] = useState(false);
  const [surahsLoading, setSurahsLoading] = useState(true);

  useEffect(() => {
    const cachedSurahs = STORAGE_SERVICE.getItem('athr_quran_surahs');
    if (cachedSurahs) {
      setSurahs(cachedSurahs);
      setSurahsLoading(false);
    }

    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setSurahsLoading(false);
        STORAGE_SERVICE.setItem('athr_quran_surahs', data.data);
      })
      .catch(() => {
        if (!cachedSurahs) setSurahsLoading(false);
      });
  }, []);

  const handleFetchTafsir = async () => {
    if (!selectedSurah) return;
    setLoading(true);
    setTafsir(null);
    try {
      const data = await QURAN_SERVICE.getTafsir(selectedSurah.number, selectedAyahNum);
      if (data) {
        setTafsir(data);
      }
    } catch (error) {
      console.error("Tafsir error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">تفسير ابن كثير</h2>
        <p className="text-text-mid text-sm font-amiri">تدبر آيات الله ومعانيها</p>
      </div>

      <div className="bg-surface/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] p-6 shadow-xl backdrop-blur-sm mx-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-xs text-gold-dark font-bold px-2 block">اختر السورة</label>
            <select 
              className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-sm text-text-dark outline-none focus:border-gold/50 transition-all font-tajawal"
              onChange={(e) => {
                const surah = surahs.find(s => s.number === parseInt(e.target.value));
                setSelectedSurah(surah);
                setSelectedAyahNum(1);
                setTafsir(null);
              }}
              value={selectedSurah?.number || ''}
            >
              <option value="">-- اختر السورة --</option>
              {surahs.map(s => (
                <option key={s.number} value={s.number}>{s.number}. {s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gold-dark font-bold px-2 block">رقم الآية</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                min="1" 
                max={selectedSurah?.numberOfAyahs || 286}
                value={selectedAyahNum}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0 && val <= (selectedSurah?.numberOfAyahs || 286)) {
                    setSelectedAyahNum(val);
                  }
                }}
                className="flex-1 bg-black/5 border border-black/10 rounded-xl p-3 text-sm text-text-dark outline-none focus:border-gold/50 transition-all text-center"
              />
              <button 
                onClick={handleFetchTafsir}
                disabled={!selectedSurah || loading}
                className="bg-gold text-green-main px-6 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? '...' : 'عرض'}
              </button>
            </div>
          </div>
        </div>

        {tafsir && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-gold/5 p-6 rounded-3xl border border-gold/10 text-center">
              <p className="text-gold-dark text-xs mb-2 font-bold uppercase tracking-widest">الآية {selectedAyahNum.toLocaleString('ar-SA')}</p>
              <div className="text-2xl font-scheherazade leading-relaxed text-text-dark">
                {tafsir.arabic}
              </div>
            </div>

            <div className="h-px bg-gold/10 w-1/2 mx-auto"></div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-gold-dark font-bold mb-4 flex items-center gap-2">
                <span>📖</span>
                <span>تفسير ابن كثير</span>
              </h3>
              <p className="text-text-dark text-lg leading-loose font-amiri text-justify whitespace-pre-wrap">
                {tafsir.tafsir}
              </p>
            </div>
          </div>
        )}

        {!tafsir && !loading && (
          <div className="py-20 text-center space-y-4 opacity-40">
            <div className="text-5xl">📖</div>
            <p className="text-sm font-amiri">اختر السورة والآية لعرض التفسير</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TafsirSection;
