import React, { useState, useEffect, useRef } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';
import { QURAN_SERVICE } from '../services/quranService';

const QuranReader = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSurah, setActiveSurah] = useState(null);
  const [activeJuz, setActiveJuz] = useState(null);
  const [quranText, setQuranText] = useState([]); // Array for pages
  const [fontSize, setFontSize] = useState(24);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [bookmark, setBookmark] = useState(null);
  const [viewMode, setViewMode] = useState('surah'); // 'surah', 'juz', 'bookmark'
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [tafsir, setTafsir] = useState(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullQuranCached, setIsFullQuranCached] = useState(QURAN_SERVICE.isFullDownloaded());
  const audioRef = useRef(null);

  // Swipe Gesture State
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);
  const minSwipeDistance = 70; // Increased threshold

  useEffect(() => {
    // 1. Try to load surahs from local cache first if possible, or fetch
    const cachedSurahs = STORAGE_SERVICE.getItem('athr_quran_surahs');
    if (cachedSurahs) {
      setSurahs(cachedSurahs);
      setLoading(false);
    }

    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
        STORAGE_SERVICE.setItem('athr_quran_surahs', data.data);
      })
      .catch(() => {
        if (!cachedSurahs) setLoading(false);
      });

    const savedBookmark = STORAGE_SERVICE.getItem('athr_quran_bookmark');
    if (savedBookmark) setBookmark(savedBookmark);
  }, []);

  const loadSurah = async (number) => {
    setLoading(true);
    setActiveSurah(number);
    setActiveJuz(null);

    // Check if we can pre-fetch/cache
    if (QURAN_SERVICE.preCacheSurah) {
      QURAN_SERVICE.preCacheSurah(number);
    }

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
      const data = await res.json();
      const startPage = data.data.ayahs[0].page;
      loadPage(startPage);
    } catch (e) {
      loadPage(1);
    }
  };

  const loadJuz = (number) => {
    setLoading(true);
    setActiveJuz(number);
    setActiveSurah(null);

    fetch(`https://api.alquran.cloud/v1/juz/${number}/quran-uthmani`)
      .then(res => res.json())
      .then(data => {
        const startPage = data.data.ayahs[0].page;
        loadPage(startPage);
      })
      .catch(() => {
        loadPage(1);
      });
  };

  const loadPage = async (pageNumber) => {
    if (!pageNumber) return;
    setLoading(true);
    setCurrentPage(pageNumber);
    try {
      const data = await QURAN_SERVICE.getPage(pageNumber);
      if (data && data.data && data.data.ayahs) {
        setQuranText(data.data.ayahs);
      }
    } catch (err) {
      console.error("Page load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSurah || activeJuz || isFullQuranCached) {
      if (currentPage > 0) {
        loadPage(currentPage);
      }
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentPage, activeSurah, activeJuz, isFullQuranCached]);

  const showTafsir = async (ayah) => {
    setSelectedAyah(ayah);
    setTafsirLoading(true);
    setTafsir(null);

    const data = await QURAN_SERVICE.getTafsir(ayah.surah.number, ayah.numberInSurah);
    if (data && data.text) {
      setTafsir(data.text);
    } else {
      setTafsir("تعذر تحميل التفسير. يرجى التأكد من الاتصال بالإنترنت.");
    }
    setTafsirLoading(false);
  };

  const startFullDownload = async () => {
    setIsDownloading(true);
    try {
      await QURAN_SERVICE.downloadFullQuran((progress) => {
        setDownloadProgress(progress);
      });
      setIsFullQuranCached(true);
    } catch (error) {
      console.error("Full download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current || audioRef.current.src !== `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${activeSurah}.mp3`) {
      if (activeSurah) {
        audioRef.current = new Audio(`https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${activeSurah}.mp3`);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else if (audioRef.current) {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const saveBookmark = () => {
    let name = "";
    let ref = {};
    if (activeSurah) {
      const s = surahs.find(s => s.number === activeSurah);
      name = s ? s.name : `سورة ${activeSurah}`;
      ref = { type: 'surah', number: activeSurah, page: currentPage };
    } else if (activeJuz) {
      name = `الجزء ${activeJuz?.toLocaleString('ar-SA') || activeJuz}`;
      ref = { type: 'juz', number: activeJuz, page: currentPage };
    }

    const newBookmark = { ...ref, name };
    setBookmark(newBookmark);
    STORAGE_SERVICE.setItem('athr_quran_bookmark', newBookmark);
  };

  const showKhatmDua = () => {
    alert(`اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ.`);
  };

  // Swipe Handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd || !touchStartY || !touchEndY) return;

    const distanceX = touchStart - touchEnd;
    const distanceY = touchStartY - touchEndY;

    // Logic: If horizontal movement is much greater than vertical movement, it's a swipe
    // This prevents page flip when user is actually trying to scroll down
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 1.5;

    if (!isHorizontalSwipe) return;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isRightSwipe && currentPage < 604) {
      // Swipe Right in RTL = Next Page
      loadPage(currentPage + 1);
    }
    if (isLeftSwipe && currentPage > 1) {
      // Swipe Left in RTL = Previous Page
      loadPage(currentPage - 1);
    }
  };

  if (activeSurah || activeJuz) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-24 h-full flex flex-col">
      {/* Sticky Header */}
      <div className="flex flex-col gap-4 p-4 bg-white/95 dark:bg-[#1a1c23]/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5 sticky top-0 z-50 shadow-sm rounded-b-[2.5rem] -mx-4 px-8 mb-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => { setActiveSurah(null); setActiveJuz(null); if (audioRef.current) audioRef.current.pause(); setIsPlaying(false); }} 
            className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-full text-gold transition-transform active:scale-90"
          >
            ✕
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gold font-scheherazade leading-tight">
              {activeSurah ? surahs.find(s => s.number === activeSurah)?.name : `الجزء ${activeJuz?.toLocaleString('ar-SA') || activeJuz}`}
            </h2>
            {activeSurah && (
              <p className="text-[10px] text-text-mid font-amiri opacity-70">
                {surahs.find(s => s.number === activeSurah)?.numberOfAyahs.toLocaleString('ar-SA')} آية
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={showKhatmDua} title="دعاء الختم" className="w-10 h-10 flex items-center justify-center bg-gold/10 rounded-full text-gold text-lg shadow-inner cursor-pointer active:scale-90 transition-transform">🤲</button>
            <button onClick={saveBookmark} title="حفظ علامة" className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-full text-gold-dark text-lg hover:bg-gold/10 transition-colors">🔖</button>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <select
              value={reciter}
              onChange={(e) => { setReciter(e.target.value); if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; setIsPlaying(false); } }}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-3 pr-4 text-xs text-text-dark dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-gold/30 font-tajawal appearance-none"
            >
              <option value="ar.alafasy">القارئ: مشاري العفاسي</option>
              <option value="ar.abdurrahmanoossudais">القارئ: عبدالرحمن السديس</option>
              <option value="ar.minshawi">القارئ: محمد صديق المنشاوي</option>
            </select>
            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none text-gold/50">
              ▼
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setFontSize(s => Math.min(s + 2, 40))} className="w-9 h-9 flex justify-center items-center bg-black/5 dark:bg-white/5 rounded-xl text-text-dark dark:text-white font-bold hover:bg-gold/10 transition-colors">+</button>
            <button onClick={() => setFontSize(s => Math.max(s - 2, 12))} className="w-9 h-9 flex justify-center items-center bg-black/5 dark:bg-white/5 rounded-xl text-text-dark dark:text-white font-bold hover:bg-gold/10 transition-colors">-</button>
          </div>

          {activeSurah && (
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold shadow-lg active:scale-95 transition-all ${isPlaying ? 'bg-red-500 text-white' : 'bg-gradient-to-l from-gold to-gold-light text-green-main'}`}
            >
              {isPlaying ? '⏸ إيقاف' : '▶ استماع'}
            </button>
          )}
        </div>
      </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <div className="text-gold-dark font-scheherazade text-xl">جاري تحميل المصحف...</div>
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col items-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
          >
            {/* Real Page View */}
            <div
              className="w-full flex-1 max-w-2xl bg-[#fdfbf7] dark:bg-[#1a1c23] text-gray-900 dark:text-gray-100 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-4 md:p-8 border-x-[8px] border-[#e8d5b5]/30 dark:border-[#3a3d46]/30 flex flex-col items-center relative"
              style={{ minHeight: '80vh' }}
            >
              {/* Top Page Ornament */}
              <div className="w-full flex justify-between items-center border-b-2 border-gold/30 pb-2 mb-6 font-scheherazade text-gold-dark text-lg md:text-xl relative">
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
                  <span className="text-4xl">﷽</span>
                </div>
                <span>الجزء {quranText[0]?.juz?.toLocaleString('ar-SA')}</span>
                <span>سورة {quranText[0]?.surah?.name?.replace('سُورَةُ ', '')}</span>
              </div>

              {/* Ayahs Container */}
              <div
                className="text-justify font-scheherazade leading-[2.6] md:leading-[3] w-full flex-1"
                style={{ fontSize: `${fontSize}px`, direction: 'rtl', textJustify: 'inter-word' }}
              >
                {quranText?.map((ayah, i) => (
                  <span
                    key={i}
                    className="inline cursor-pointer hover:bg-gold/5 transition-colors rounded px-1"
                    onClick={() => showTafsir(ayah)}
                  >
                    {/* Add basmalah if it's ayah 1 (and not Surah Al-Fatihah/At-Tawbah which usually have it embedded or omitted appropriately) */}
                    {ayah.numberInSurah === 1 && ayah.surah.number !== 1 && ayah.surah.number !== 9 && (
                      <span className="text-center font-scheherazade text-2xl md:text-3xl text-gold-dark my-4 block w-full">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </span>
                    )}
                    {/* The text usually includes the basmalah for ayah 1 in alquran.cloud, so we strip it if we just rendered a beautiful separate one */}
                    {ayah.numberInSurah === 1 && ayah.surah.number !== 1 && ayah.surah.number !== 9
                      ? ayah.text?.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '')
                      : ayah.text}

                    <span className="inline-flex items-center justify-center w-[1.8em] h-[1.8em] mx-1 text-[0.45em] text-gold-dark border border-gold bg-[#fdfbf7] dark:bg-[#1a1c23] -translate-y-1 font-mono relative" style={{ borderRadius: '50% 50% 0 50%', transform: 'rotate(45deg)' }}>
                      <span style={{ transform: 'rotate(-45deg)' }}>
                        {ayah.numberInSurah?.toLocaleString('ar-SA') || ayah.numberInSurah}
                      </span>
                    </span>
                  </span>
                ))}
              </div>

              {/* Tafsir Modal */}
              {selectedAyah && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in slide-in-from-bottom-10 duration-300">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAyah(null)} />
                  <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1c23] rounded-t-[2rem] sm:rounded-[2rem] p-6 text-right shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                    <div className="flex justify-between items-center mb-6 border-b border-black/5 pb-4">
                      <button onClick={() => setSelectedAyah(null)} className="w-10 h-10 flex items-center justify-center bg-black/5 rounded-full text-gold-dark text-xl">✕</button>
                      <h3 className="text-xl font-bold text-gold-dark font-scheherazade">
                        تفسير ابن كثير: {selectedAyah.surah?.name || ''} ({selectedAyah.numberInSurah?.toLocaleString('ar-SA') || selectedAyah.numberInSurah})
                      </h3>
                    </div>

                    <div className="bg-gold/5 p-4 rounded-2xl mb-6 text-lg font-scheherazade leading-relaxed border border-gold/10">
                      {selectedAyah.text}
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                      {tafsirLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-text-mid font-amiri">جاري تحميل التفسير...</p>
                        </div>
                      ) : (
                        <p className="text-text-dark text-lg leading-loose font-amiri text-justify">
                          {tafsir}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedAyah(null)}
                      className="mt-6 w-full py-4 bg-gold text-green-main rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Page Number */}
              <div className="mt-4 pb-2 text-center font-scheherazade text-gold-dark text-lg border-t-2 border-gold/30 pt-2 w-full">
                {currentPage?.toLocaleString('ar-SA') || currentPage}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center w-full max-w-2xl py-4 px-2">
              <button
                disabled={currentPage >= 604}
                onClick={() => loadPage(currentPage + 1)}
                className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-black/5 rounded-full text-gold-dark font-bold shadow-md disabled:opacity-40 transition-all active:scale-95 flex items-center gap-2 text-sm"
              >
                التالية <span>→</span>
              </button>
              <button
                disabled={currentPage <= 1}
                onClick={() => loadPage(currentPage - 1)}
                className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-black/5 rounded-full text-gold-dark font-bold shadow-md disabled:opacity-40 transition-all active:scale-95 flex items-center gap-2 text-sm"
              >
                <span>←</span> السابقة
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">المصحف الشريف</h2>
        <p className="text-text-mid text-sm font-amiri">«خيركم من تعلم القرآن وعلمه»</p>
      </div>

      {/* View Tabs */}
      <div className="flex bg-black/5 p-1.5 rounded-2xl border border-black/10 mx-2 shadow-inner">
        <button
          onClick={() => setViewMode('surah')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${viewMode === 'surah' ? 'bg-gold text-green-main shadow-lg scale-100' : 'text-text-mid hover:text-gold-light scale-95'}`}
        >
          📂 السور
        </button>
        <button
          onClick={() => setViewMode('juz')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${viewMode === 'juz' ? 'bg-gold text-green-main shadow-lg scale-100' : 'text-text-mid hover:text-gold-light scale-95'}`}
        >
          📑 الأجزاء
        </button>
        <button
          onClick={() => setViewMode('bookmark')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${viewMode === 'bookmark' ? 'bg-gold text-green-main shadow-lg scale-100' : 'text-text-mid hover:text-gold-light scale-95'}`}
        >
          🔖 العلامات
        </button>
      </div>

      {/* Offline Download Status */}
      <div className="px-4">
        {!isFullQuranCached ? (
          <div className="p-4 bg-gold/10 border border-gold/20 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gold-dark font-bold">تحميل المصحف للقراءة بدون إنترنت</span>
              <span className="text-gold-dark">{downloadProgress}%</span>
            </div>
            {isDownloading ? (
              <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            ) : (
              <button
                onClick={startFullDownload}
                className="w-full py-2 bg-gold text-green-main rounded-xl text-xs font-bold active:scale-95 transition-all"
              >
                بدء التحميل الآن
              </button>
            )}
            <p className="text-[10px] text-text-mid text-center italic">سيتم تحميل 604 صفحة لتعمل بشكل دائم بدون شبكة</p>
          </div>
        ) : (
          <div className="p-3 bg-green-main/5 border border-green-main/10 rounded-2xl flex items-center justify-center gap-2">
            <span className="text-green-main text-xs font-bold">✅ المصحف محمل بالكامل للاستخدام بدون إنترنت</span>
          </div>
        )}
      </div>

      {viewMode === 'surah' && (
        <div className="grid grid-cols-2 gap-3 px-2">
          {surahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => loadSurah(surah.number)}
              className="p-4 bg-black/5 border border-black/10 rounded-2xl flex flex-col items-center hover:border-gold/30 transition-all active:scale-95"
            >
              <span className="text-gold text-[10px] mb-1 font-bold">{surah.number.toLocaleString('ar-SA')}</span>
              <span className="text-lg font-bold text-gold-light font-scheherazade">{surah.name}</span>
              <span className="text-[10px] text-text-mid font-amiri">{surah.numberOfAyahs.toLocaleString('ar-SA')} آية</span>
            </button>
          ))}
        </div>
      )}

      {viewMode === 'juz' && (
        <div className="grid grid-cols-2 gap-3 px-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
            <button
              key={j}
              onClick={() => loadJuz(j)}
              className="p-6 bg-black/5 border border-black/10 rounded-2xl flex flex-col items-center hover:border-gold/30 transition-all active:scale-95"
            >
              <span className="text-[10px] text-gold mb-1 font-bold">جزء</span>
              <span className="text-xl font-bold text-gold-light font-scheherazade">{j.toLocaleString('ar-SA')}</span>
            </button>
          ))}
        </div>
      )}

      {viewMode === 'bookmark' && (
        <div className="px-4">
          {bookmark ? (
            <button
              onClick={() => bookmark.type === 'surah' ? loadSurah(bookmark.number) : loadJuz(bookmark.number)}
              className="w-full p-6 bg-gold/10 border border-gold/30 rounded-3xl flex items-center justify-between group"
            >
              <div className="text-right">
                <div className="text-[10px] text-gold font-bold mb-1">واصل القراءة من:</div>
                <div className="text-2xl font-bold text-gold font-scheherazade">{bookmark.name}</div>
              </div>
              <div className="w-12 h-12 bg-gold text-green-main rounded-full flex items-center justify-center text-xl shadow-lg group-active:scale-90 transition-all">▶</div>
            </button>
          ) : (
            <div className="text-center py-20 text-text-mid bg-black/5 rounded-3xl border border-black/10 border-dashed">
              <div className="text-4xl mb-4">🔖</div>
              <p className="text-sm font-amiri">لا توجد علامات محفوظة حالياً</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuranReader;