import { STORAGE_SERVICE } from './storageService';

const QURAN_CACHE_NAME = 'athr-quran-cache-v1';
const BASE_URL = 'https://api.alquran.cloud/v1';

/**
 * QURAN_SERVICE handles fetching Quran text and Tafsir.
 * It prioritizes local data, then Cache API, then network.
 */
export const QURAN_SERVICE = {

  // Fetch a specific page
  async getPage(pageNumber) {
    const cache = await caches.open(QURAN_CACHE_NAME);
    const url = `${BASE_URL}/page/${pageNumber}/quran-uthmani`;

    let response = await cache.match(url);

    if (!response) {
      try {
        response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response.clone());
        }
      } catch (error) {
        console.error('Offline fetch failed for page:', pageNumber);
      }
    }

    if (response) {
      return await response.json();
    }

    return null;
  },

  // Fetch Tafsir for an ayah using Quran.com API v4
  async getTafsir(surahNumber, ayahNumber) {
    const ayahKey = `${surahNumber}:${ayahNumber}`;
    // 16: Al-Jalalayn (Arabic)
    const tafsirId = 16;
    const tafsirUrl = `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${ayahKey}`;

    try {
      const tafsirResponse = await fetch(tafsirUrl);
      if (tafsirResponse.ok) {
        const data = await tafsirResponse.json();
        if (data.tafsir && data.tafsir.text) {
          let tafsirText = data.tafsir.text
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .trim();
          
          return { text: tafsirText };
        }
      }
      return { text: "تعذر تحميل التفسير حالياً." };
    } catch (e) {
      console.error("Tafsir fetch error:", e);
      return { text: "تأكد من اتصالك بالإنترنت." };
    }
  },

  // Pre-cache all metadata (Surah list)
  async cacheMetadata(surahs) {
    STORAGE_SERVICE.setItem('athr_quran_surahs', surahs);
  },

  // Pre-cache a specific surah
  async preCacheSurah(surahNumber) {
    // This is a stub for now, but could be extended to fetch all pages for this surah
    console.log(`Pre-caching surah ${surahNumber}`);
    return true;
  },

  // Background download of the entire Quran (604 pages)
  async downloadFullQuran(onProgress) {
    const cache = await caches.open(QURAN_CACHE_NAME);
    const totalPages = 604;
    let downloadedCount = 0;

    for (let p = 1; p <= totalPages; p++) {
      const pageUrl = `https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${p}`;

      try {
        let response = await cache.match(pageUrl);
        if (!response) {
          response = await fetch(pageUrl);
          if (response.ok) {
            await cache.put(pageUrl, response.clone());
          }
        }
        downloadedCount++;
        if (onProgress) onProgress(Math.floor((downloadedCount / totalPages) * 100));
      } catch (e) {
        console.error(`Error downloading page ${p}:`, e);
      }
    }
    STORAGE_SERVICE.setItem('athr_quran_full_downloaded', true);
    return true;
  },

  isFullDownloaded() {
    return STORAGE_SERVICE.getItem('athr_quran_full_downloaded', false);
  }
};
