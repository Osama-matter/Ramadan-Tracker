/* ════ SERVICE WORKER REGISTRATION ════ */
async function requestNotifPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only register if running on a server (http/https)
    if (window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('SW Registered', reg.scope))
        .catch(err => console.warn('SW Register Error', err));
    } else {
      console.warn('Service Worker skipped: Not running on a web server.');
    }
  });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // You could show a custom install button here if desired
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt = null;
    });
  }
}

/*══ EARLY DECLARATIONS ════ */
const RAMADAN_START = new Date(2026, 1, 19);
const TOTAL = 30;
const TASKS = [
  { id:'fajr',    name:'صلاة الفجر',   icon:'🌙', sub:'صلاة ما قبل الفجر',                              badge:'🌙', badgeName:'حارس الفجر' },
  { id:'dhuhr',   name:'صلاة الظهر',   icon:'☀️', sub:'صلاة منتصف النهار',                              badge:'☀️', badgeName:'المخلص في الظهر' },
  { id:'asr',     name:'صلاة العصر',   icon:'🌤', sub:'صلاة بعد الزوال',                                badge:'🌤', badgeName:'مواظب على العصر' },
  { id:'maghrib', name:'المغرب والإفطار',icon:'🌅',sub:'صلاة المغرب وكسر الصيام بامتنان',               badge:'🌅', badgeName:'بركة الإفطار' },
  { id:'isha',    name:'العشاء والتراويح',icon:'🌌',sub:'صلاة العشاء وصلاة التراويح الخاصة',            badge:'🌌', badgeName:'عابد الليل' },
  { id:'quran',   name:'تلاوة القرآن', icon:'📖', sub:'التلاوة اليومية — ولو صفحة واحدة',               badge:'📖', badgeName:'مداوم على القرآن' },
  { id:'dhikr',   name:'الذكر',         icon:'📿', sub:'١٠٠× سبحان الله · الحمد لله · الله أكبر',      badge:'📿', badgeName:'ذاكر الله' },
  { id:'sadaqah', name:'الصدقة والخير',  icon:'🤲', sub:'تصدّق أو قدّم عملًا صالحًا اليوم',             badge:'🤲', badgeName:'نفس سخية' },
];
const DUAS = [
  { ar:'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', en:'O Allah, You are the Pardoner, the Generous. You love to pardon, so pardon me.' },
  { ar:'رَبَّنا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', en:'Our Lord, grant us good in this world and in the Hereafter, and protect us from the Fire.' },
  { ar:'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', en:'O Allah, help me in remembering You, in thanking You, and in worshipping You well.' },
  { ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ', en:'O Allah, I ask You for Paradise and seek refuge in You from the Fire.' },
  { ar:'اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ', en:'O Allah, forgive me, my parents, and all believing men and women.' },
  { ar:'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', en:'O Turner of hearts, make my heart firm upon Your religion.' },
  { ar:'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ', en:'O Allah, bless what You have provided us and protect us from the Fire.' },
];
const AR_NUMS = ['١','٢','٣','٤','٥','٦','٧','٨','٩','١٠','١١','١٢','١٣','١٤','١٥','١٦','١٧','١٨','١٩','٢٠','٢١','٢٢','٢٣','٢٤','٢٥','٢٦','٢٧','٢٨','٢٩','٣٠'];
const CAPTIONS = ['ابدأ رحلتك المباركة','ماشاء الله، استمر!','تقدم رائع، كن ثابتًا!','منتصف الطريق — الحمد لله!','اقتربت — تقبّل الله منك!','🌟 رمضان مكتمل — الله أكبر!'];
const TOTAL_PAGES = 604;
const AJZA = ['الفاتحة والبقرة','البقرة','البقرة وآل عمران','آل عمران والنساء','النساء','النساء والمائدة','المائدة والأنعام','الأنعام','الأعراف','الأعراف ويونس','يونس وهود','هود ويوسف','يوسف والرعد والإبراهيم','إبراهيم والحجر والنحل','النحل والإسراء','الكهف','الكهف ومريم وطه','طه والأنبياء','الحج والمؤمنون','النور والفرقان','الشعراء والنمل','النمل والقصص','العنكبوت والروم ولقمان','الأحزاب','فاطر ويس','الصافات والزمر','الزمر وغافر وفصلت','الأحقاف ومحمد والفتح','الحجرات والذاريات','عمّ وما بعده'];
const ODD_NIGHTS = [
  { night: 21, date: '١٢ مارس', special: '' },
  { night: 23, date: '١٤ مارس', special: '' },
  { night: 25, date: '١٦ مارس', special: '' },
  { night: 27, date: '١٧ مارس', special: '⭐ الأرجح' },
  { night: 29, date: '١٨ مارس', special: '' },
];
const QADR_CHECKLIST_ITEMS = [
  { id:'qc1', label:'صلاة التراويح والقيام', icon:'🕌' },
  { id:'qc2', label:'ختم جزء من القرآن', icon:'📖' },
  { id:'qc3', label:'دعاء اللهم إنك عفو كريم', icon:'🤲' },
  { id:'qc4', label:'الاستغفار ١٠٠ مرة', icon:'📿' },
  { id:'qc5', label:'الصدقة ولو بالقليل', icon:'💛' },
  { id:'qc6', label:'صلة الرحم والدعاء للوالدين', icon:'❤️' },
  { id:'qc7', label:'تلاوة سورة القدر والإخلاص', icon:'⭐' },
];

const DUA_CARDS = [
  { cat:'صباح', arabic:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', trans:'أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله وحده لا شريك له', source:'مسلم', icon:'🌞' },
  { cat:'صباح', arabic:'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', trans:'اللهم بك أصبحنا وبك أمسينا وبك نحيا ونموت وإليك النشور', source:'الترمذي', icon:'🌄' },
  { cat:'صباح', arabic:'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ', trans:'يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين', source:'النسائي', icon:'✨' },
  { cat:'صباح', arabic:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', trans:'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم', source:'أبو داود', icon:'🛡️' },
  { cat:'إفطار', arabic:'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', trans:'اللهم لك صمت وعلى رزقك أفطرت', source:'أبو داود', icon:'🌅' },
  { cat:'إفطار', arabic:'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', trans:'ذهب العطش وابتلت العروق وثبت الأجر بإذن الله', source:'أبو داود', icon:'💧' },
  { cat:'إفطار', arabic:'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي', trans:'اللهم إني أسألك برحمتك التي وسعت كل شيء أن تغفر لي', source:'ابن ماجه', icon:'🙏' },
  { cat:'قرآن', arabic:'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي', trans:'رب اشرح لي صدري ويسر لي أمري واحلل عقدة من لساني يفقهوا قولي', source:'طه:٢٥-٢٨', icon:'✨' },
  { cat:'قرآن', arabic:'رَبِّ زِدْنِي عِلْمًا', trans:'رب زدني علما', source:'طه:١١٤', icon:'📈' },
  { cat:'قرآن', arabic:'اللَّهُمَّ اجْعَلِ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قُلُوبِنَا، وَنُورَ صُدُورِنَا، وَجَلَاءَ أَحْزَانِنَا، وَذَهَابَ هُمُومِنَا', trans:'اللهم اجعل القرآن العظيم ربيع قلوبنا ونور صدورنا وجلاء أحزاننا وذهاب همومنا', source:'أحمد', icon:'📜' },
  { cat:'نوم', arabic:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', trans:'باسمك اللهم أموت وأحيا', source:'البخاري', icon:'😴' },
  { cat:'نوم', arabic:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', trans:'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور', source:'البخاري', icon:'🌅' },
  { cat:'جامع', arabic:'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ', trans:'اللهم اغفر لي ذنبي كله دقه وجله وأوله وآخره وعلانيته وسره', source:'مسلم', icon:'🌟' },
  { cat:'جامع', arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', trans:'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار', source:'البقرة:٢٠١', icon:'💫' },
  { cat:'جامع', arabic:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', trans:'اللهم إني أسألك العفو والعافية في الدنيا والآخرة', source:'ابن ماجه', icon:'🤍' },
  { cat:'ليلة القدر', arabic:'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', trans:'اللهم إنك عفو كريم تحب العفو فاعف عني', source:'الترمذي', icon:'⭐' },
  { cat:'ليلة القدر', arabic:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ', trans:'سبحانك اللهم وبحمدك أشهد أن لا إله إلا أنت أستغفرك وأتوب إليك', source:'البخاري', icon:'🌙' },
];
let goals = [];
let notifSettings = {};
let quranData = { pagesPerDay: {}, khatmaCount: 1 };
let prayerData = null;
let duaCardFilter = 'all';

let currentQuranMode = 'surah';
let currentQuranRef = null; // { type: 'surah'|'juz'|'page', id: number }

async function initQuranReader() {
  const surahSelect = document.getElementById('quran-surah-select');
  const juzSelect = document.getElementById('quran-juz-select');
  
  // Load bookmark on init
  loadQuranBookmark();
  
  if (surahSelect && surahSelect.options.length <= 1) {
    try {
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      if (data.code === 200) {
        surahSelect.innerHTML = '<option value="">اختر السورة...</option>' + 
          data.data.map(s => `<option value="${s.number}">${s.number}. ${s.name}</option>`).join('');
      }
    } catch (err) { console.error('Surah list error:', err); }
  }

  if (juzSelect && juzSelect.options.length <= 1) {
    let juzOptions = '<option value="">اختر الجزء...</option>';
    for (let i = 1; i <= 30; i++) {
      juzOptions += `<option value="${i}">الجزء ${toAr(i)}</option>`;
    }
    juzSelect.innerHTML = juzOptions;
  }
}

function switchQuranMode(mode) {
  currentQuranMode = mode;
  document.querySelectorAll('.quran-mode-ui').forEach(el => el.style.display = 'none');
  document.getElementById(`quran-mode-${mode}`).style.display = 'block';
  
  document.querySelectorAll('#section-quran-read .tb-tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-quran-${mode}`).classList.add('active');
}

async function loadSurah() {
  const id = document.getElementById('quran-surah-select').value;
  if (!id) return;
  currentQuranRef = { type: 'surah', id: parseInt(id) };
  await fetchAndDisplayQuran(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`);
}

async function loadJuz() {
  const id = document.getElementById('quran-juz-select').value;
  if (!id) return;
  currentQuranRef = { type: 'juz', id: parseInt(id) };
  await fetchAndDisplayQuran(`https://api.alquran.cloud/v1/juz/${id}/quran-uthmani`);
}

async function loadPage() {
  const id = document.getElementById('quran-page-input').value;
  if (!id || id < 1 || id > 604) { toast('يرجى إدخال رقم صفحة صحيح (١-٦٠٤)'); return; }
  currentQuranRef = { type: 'page', id: parseInt(id) };
  await fetchAndDisplayQuran(`https://api.alquran.cloud/v1/page/${id}/quran-uthmani`);
}

async function fetchAndDisplayQuran(url) {
  const container = document.getElementById('quran-container');
  const loader = document.getElementById('quran-loader');
  const textEl = document.getElementById('quran-text');
  const nameEl = document.getElementById('surah-name-ar');
  const infoEl = document.getElementById('surah-info');
  const basmalah = document.getElementById('basmalah');
  const controls = document.getElementById('quran-controls');

  container.style.display = 'none';
  controls.style.display = 'none';
  loader.style.display = 'block';

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.code === 200) {
      const d = data.data;
      let ayahs = d.ayahs || [];
      
      if (currentQuranRef.type === 'surah') {
        nameEl.textContent = d.name;
        infoEl.textContent = `${d.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • ${d.numberOfAyahs} آية`;
        basmalah.style.display = (currentQuranRef.id != 1 && currentQuranRef.id != 9) ? 'block' : 'none';
        if (basmalah.style.display === 'block' && ayahs[0].text.includes('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
          ayahs[0].text = ayahs[0].text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
        }
      } else if (currentQuranRef.type === 'juz') {
        nameEl.textContent = `الجزء ${toAr(currentQuranRef.id)}`;
        infoEl.textContent = `من سورة ${ayahs[0].surah.name} إلى سورة ${ayahs[ayahs.length-1].surah.name}`;
        basmalah.style.display = 'none';
      } else if (currentQuranRef.type === 'page') {
        nameEl.textContent = `الصفحة ${toAr(currentQuranRef.id)}`;
        infoEl.textContent = `سورة ${ayahs[0].surah.name}`;
        basmalah.style.display = 'none';
      }

      textEl.innerHTML = ayahs.map(a => {
        let txt = a.text;
        if (currentQuranRef.type !== 'surah' && a.numberInSurah === 1 && a.surah.number !== 1 && a.surah.number !== 9) {
          txt = `<div style="text-align:center; font-size:1.4rem; color:var(--gold-pale); margin:20px 0; display:block">【 ${a.surah.name} 】</div>` + 
                `<div style="text-align:center; font-size:1.6rem; margin-bottom:15px; display:block">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>` + 
                txt.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
        }
        return `${txt} <span class="aya-num">(${toAr(a.numberInSurah)})</span>`;
      }).join(' ');

      updateNavButtons();
      loader.style.display = 'none';
      container.style.display = 'block';
      controls.style.display = 'flex';
      container.scrollIntoView({ behavior: 'smooth' });
      
      // Update bookmark info UI if currently reading the bookmarked spot
      checkBookmarkStatus();
      
      // Stop audio if playing new content
      const player = document.getElementById('quran-audio-player');
      if (player) {
        player.pause();
        document.getElementById('play-audio-btn').textContent = '▶ تشغيل';
      }
    }
  } catch (err) {
    console.error('Quran fetch error:', err);
    loader.style.display = 'none';
    toast('⚠️ عذراً، تعذر تحميل المحتوى.');
  }
}

function updateQuranFontSize(val) {
  const textEl = document.getElementById('quran-text');
  if (textEl) textEl.style.fontSize = val + 'rem';
}

function toggleQuranAudio() {
  const player = document.getElementById('quran-audio-player');
  const btn = document.getElementById('play-audio-btn');
  const reciter = document.getElementById('reciter-select').value;
  
  if (!currentQuranRef) return;

  if (player.paused) {
    let audioUrl = '';
    if (currentQuranRef.type === 'surah') {
      audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${currentQuranRef.id}.mp3`;
    } else {
      toast('🔈 ميزة الاستماع متاحة حالياً عند القراءة بالسورة فقط');
      return;
    }
    
    if (player.src !== audioUrl) player.src = audioUrl;
    player.play();
    btn.textContent = '⏸ إيقاف';
  } else {
    player.pause();
    btn.textContent = '▶ تشغيل';
  }
}

function saveQuranBookmark() {
  if (!currentQuranRef) return;
  const bookmark = {
    mode: currentQuranMode,
    ref: currentQuranRef,
    title: document.getElementById('surah-name-ar').textContent,
    sub: document.getElementById('surah-info').textContent,
    time: new Date().getTime()
  };
  storage.setItem('quran_bookmark', JSON.stringify(bookmark));
  toast('✅ تم حفظ علامة القراءة بنجاح');
  displayBookmarkUI(bookmark);
}

function loadQuranBookmark() {
  const saved = storage.getItem('quran_bookmark');
  if (saved) {
    const bookmark = JSON.parse(saved);
    displayBookmarkUI(bookmark);
  }
}

function displayBookmarkUI(bookmark) {
  const info = document.getElementById('active-bookmark-info');
  if (info) {
    info.innerHTML = `📍 آخر حفظ: <span onclick="goToBookmark()" style="cursor:pointer;text-decoration:underline;color:var(--gold-bright)">${bookmark.title} (${bookmark.sub})</span>`;
  }
}

function checkBookmarkStatus() {
  // Can be used to highlight if current view is bookmarked
}

async function goToBookmark() {
  const saved = storage.getItem('quran_bookmark');
  if (!saved) return;
  const bookmark = JSON.parse(saved);
  
  switchQuranMode(bookmark.mode);
  currentQuranRef = bookmark.ref;
  
  if (bookmark.mode === 'surah') {
    document.getElementById('quran-surah-select').value = bookmark.ref.id;
    await loadSurah();
  } else if (bookmark.mode === 'juz') {
    document.getElementById('quran-juz-select').value = bookmark.ref.id;
    await loadJuz();
  } else if (bookmark.mode === 'page') {
    document.getElementById('quran-page-input').value = bookmark.ref.id;
    await loadPage();
  }
}

function updateNavButtons() {
  const prev = document.getElementById('prev-btn');
  const next = document.getElementById('next-btn');
  if (!currentQuranRef) return;

  prev.style.display = 'block';
  next.style.display = 'block';

  if (currentQuranRef.type === 'surah') {
    if (currentQuranRef.id <= 1) prev.style.display = 'none';
    if (currentQuranRef.id >= 114) next.style.display = 'none';
  } else if (currentQuranRef.type === 'juz') {
    if (currentQuranRef.id <= 1) prev.style.display = 'none';
    if (currentQuranRef.id >= 30) next.style.display = 'none';
  } else if (currentQuranRef.type === 'page') {
    if (currentQuranRef.id <= 1) prev.style.display = 'none';
    if (currentQuranRef.id >= 604) next.style.display = 'none';
  }
}

async function navQuran(dir) {
  if (!currentQuranRef) return;
  currentQuranRef.id += dir;
  
  if (currentQuranRef.type === 'surah') {
    document.getElementById('quran-surah-select').value = currentQuranRef.id;
    await loadSurah();
  } else if (currentQuranRef.type === 'juz') {
    document.getElementById('quran-juz-select').value = currentQuranRef.id;
    await loadJuz();
  } else if (currentQuranRef.type === 'page') {
    document.getElementById('quran-page-input').value = currentQuranRef.id;
    await loadPage();
  }
}

function toAr(num) {
  const symbols = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(num).replace(/[0-9]/g, d => symbols[d]);
}

/* ════ STORAGE WRAPPER ════ */
const storage = {
  getItem: (key) => {
    try { return localStorage.getItem(key); } catch (e) { return window._fakeStorage?.[key] || null; }
  },
  setItem: (key, val) => {
    try { localStorage.setItem(key, val); } catch (e) {
      if (!window._fakeStorage) window._fakeStorage = {};
      window._fakeStorage[key] = val;
    }
  }
};

/* ════ SKY CANVAS ════ */
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
let stars = [], W, H;
function resizeSky() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
function buildStars() {
  stars = Array.from({length:160}, () => ({
    x:Math.random()*W, y:Math.random()*H*0.75,
    r:Math.random()*1.4+0.3,
    a:Math.random(), da:(Math.random()*.006+.002)*(Math.random()<.5?1:-1),
    dx:Math.random()*.08-.04,
  }));
}
function drawSky() {
  const h = new Date().getHours();
  const isNight = h < 6 || h >= 19;
  const g = ctx.createLinearGradient(0,0,0,H);
  if (isNight)      { g.addColorStop(0,'#010510'); g.addColorStop(1,'#06122e'); }
  else if (h < 7)   { g.addColorStop(0,'#1a2050'); g.addColorStop(1,'#6e3a1e'); }
  else if (h < 17)  { g.addColorStop(0,'#0d2455'); g.addColorStop(1,'#1a4a88'); }
  else              { g.addColorStop(0,'#1a1040'); g.addColorStop(1,'#7a3a15'); }
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  stars.forEach(s => {
    s.a += s.da; if(s.a>1||s.a<0) s.da*=-1;
    s.x += s.dx; if(s.x<0) s.x=W; if(s.x>W) s.x=0;
    const alpha = isNight ? s.a*.9 : s.a*.1;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,240,160,${alpha})`; ctx.fill();
    if(isNight && s.r>1.1) {
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r*2.5,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,220,120,${alpha*.14})`; ctx.fill();
    }
  });
  requestAnimationFrame(drawSky);
}
window.addEventListener('resize', () => { resizeSky(); buildStars(); });
resizeSky(); buildStars(); drawSky();

/* ════ NAVIGATION ════ */
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  if (!links || !overlay) return;
  
  const isOpen = links.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  
  if (isOpen) {
    overlay.style.display = 'block';
    overlay.style.pointerEvents = 'auto';
    overlay.style.zIndex = '9998';
    links.style.zIndex = '9999';
    links.scrollTop = 0;
    setTimeout(() => {
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      // Force position to top of viewport and full height
      links.style.setProperty('top', '0', 'important');
      links.style.setProperty('right', '0', 'important');
      links.style.setProperty('bottom', '0', 'important');
      links.style.setProperty('height', '100vh', 'important');
      links.style.setProperty('transform', 'none', 'important');
      links.style.setProperty('display', 'flex', 'important');
      links.style.setProperty('position', 'fixed', 'important');
    }, 10);
  } else {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    links.style.setProperty('right', '-280px', 'important');
    setTimeout(() => {
      if (!links.classList.contains('open')) {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        links.style.setProperty('display', 'none', 'important');
      }
    }, 300);
  }
}

/* ════ QIBLA DIRECTION ════ */
let qiblaAngle = 0;
let userAngle = 0;

async function initQibla() {
  const msg = document.getElementById('qibla-msg');
  const deg = document.getElementById('qibla-deg');
  const btn = document.getElementById('qibla-btn');

  if (!navigator.geolocation) {
    msg.textContent = '❌ المتصفح لا يدعم تحديد الموقع';
    return;
  }

  msg.textContent = 'جاري تحديد موقعك...';
  
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    
    // Kaaba coordinates: 21.4225° N, 39.8262° E
    const kLat = 21.4225;
    const kLng = 39.8262;
    
    const phi1 = latitude * Math.PI / 180;
    const phi2 = kLat * Math.PI / 180;
    const L = (kLng - longitude) * Math.PI / 180;
    
    const y = Math.sin(L);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(L);
    qiblaAngle = Math.atan2(y, x) * 180 / Math.PI;
    qiblaAngle = (qiblaAngle + 360) % 360;

    msg.textContent = '✅ تم تحديد الموقع بنجاح';
    deg.textContent = `زاوية القبلة: ${toAr(Math.round(qiblaAngle))}°`;
    btn.style.display = 'none';

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ permission
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          msg.textContent = '❌ تم رفض الإذن للوصول للبوصلة';
        }
      } else {
        // Non-iOS or older devices
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } else {
      msg.textContent = '⚠️ جهازك لا يدعم مستشعر البوصلة';
    }
  }, (err) => {
    msg.textContent = '❌ فشل تحديد الموقع، يرجى تفعيل GPS';
    console.error(err);
  });
}

function handleOrientation(e) {
  const compass = e.webkitCompassHeading || e.alpha;
  if (compass === null || compass === undefined) return;

  const rose = document.getElementById('compass-rose');
  const arrow = document.getElementById('qibla-arrow');
  const kaaba = document.getElementById('kaaba-icon');
  
  // Rotate compass rose to match real North
  rose.style.transform = `rotate(${-compass}deg)`;
  
  // Rotate Qibla arrow relative to current heading
  const relativeQibla = (qiblaAngle - compass + 360) % 360;
  arrow.style.transform = `rotate(${relativeQibla}deg)`;
  
  // Show Kaaba icon if pointing roughly towards it (within 10 degrees)
  if (Math.abs(relativeQibla) < 10 || Math.abs(relativeQibla - 360) < 10) {
    kaaba.style.opacity = '1';
    document.getElementById('qibla-compass-container').style.borderColor = 'var(--gold-bright)';
  } else {
    kaaba.style.opacity = '0';
    document.getElementById('qibla-compass-container').style.borderColor = 'var(--gold-glow)';
  }
}

/* ════ ZAKAT CALCULATOR ════ */
/* ════ POSTER GENERATOR ════ */
const POSTER_QUOTES = [
  { text: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", source: "سورة البقرة" },
  { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", source: "سورة البقرة" },
  { text: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", source: "سورة القدر" },
  { text: "الصوم جنة", source: "حديث شريف" },
  { text: "تسحروا فإن في السحور بركة", source: "حديث شريف" },
  { text: "اللهم إنك عفو كريم تحب العفو فاعف عني", source: "دعاء مأثور" }
];

function generateRandomPoster() {
  const quote = POSTER_QUOTES[Math.floor(Math.random() * POSTER_QUOTES.length)];
  document.getElementById('poster-text').textContent = quote.text;
  document.getElementById('poster-source').textContent = `— ${quote.source}`;
  document.getElementById('custom-poster-text').value = quote.text;
}

function setPosterTheme(theme) {
  const preview = document.getElementById('poster-preview-container');
  if (theme === 'deep-blue') preview.style.background = 'linear-gradient(135deg,#0d1952,#03050f)';
  if (theme === 'royal-purple') preview.style.background = 'linear-gradient(135deg,#2e004f,#03050f)';
  if (theme === 'emerald-green') preview.style.background = 'linear-gradient(135deg,#003d2e,#03050f)';
}

document.getElementById('custom-poster-text')?.addEventListener('input', (e) => {
  document.getElementById('poster-text').textContent = e.target.value;
  document.getElementById('poster-source').textContent = '';
});

function calculateZakat() {
  const goldPrice = parseFloat(document.getElementById('gold-price').value);
  const totalAmount = parseFloat(document.getElementById('zakat-amount').value);
  const resultDiv = document.getElementById('zakat-result');
  const nisabStatus = document.getElementById('nisab-status');
  const zakatBox = document.getElementById('zakat-value-box');
  const zakatValue = document.getElementById('zakat-value');

  if (!goldPrice || !totalAmount) {
    toast('⚠️ يرجى إدخال سعر الذهب والمبلغ بشكل صحيح');
    return;
  }

  const nisab = goldPrice * 85; // 85 grams of gold
  resultDiv.style.display = 'block';

  if (totalAmount >= nisab) {
    nisabStatus.innerHTML = `✅ مالك بلغ النصاب (${toAr(Math.round(nisab).toLocaleString())})<br><span style="color:var(--gold-pale);font-size:0.9rem">تجب عليك الزكاة</span>`;
    zakatBox.style.display = 'block';
    const zakat = totalAmount * 0.025; // 2.5%
    zakatValue.textContent = toAr(Math.round(zakat).toLocaleString());
  } else {
    nisabStatus.innerHTML = `ℹ️ لم يبلغ مالك النصاب بعد.<br>النصاب الحالي هو: ${toAr(Math.round(nisab).toLocaleString())}`;
    zakatBox.style.display = 'none';
  }
  
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function showSection(name, btnElement) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
  
  const section = document.getElementById('section-' + name);
  if (section) section.classList.add('active');
  
  if(btnElement) btnElement.classList.add('active');
  
  // Also sync mobile nav if desktop nav was clicked
  if (btnElement && btnElement.classList.contains('nav-btn')) {
     const mobileItem = Array.from(document.querySelectorAll('.mobile-nav-item')).find(i => i.getAttribute('onclick')?.includes(`'${name}'`));
     if (mobileItem) mobileItem.classList.add('active');
  }

  const links = document.getElementById('nav-links');
  if (links) links.classList.remove('open');
  const overlay = document.getElementById('nav-overlay');
  if (overlay) overlay.classList.remove('open');

  window.scrollTo(0,0);
  if (name === 'quran-read') initQuranReader();
  if (typeof updateStatsOnTabChange === 'function') updateStatsOnTabChange(name);
}

function initNavAutoHide() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let lastY = window.scrollY || 0;
  let ticking = false;
  const threshold = 12;

  function onScroll() {
    const y = window.scrollY || 0;
    const dy = y - lastY;
    lastY = y;

    const links = document.getElementById('nav-links');
    const isMenuOpen = !!(links && links.classList.contains('open'));

    if (isMenuOpen) {
      nav.classList.remove('nav-hidden');
      return;
    }

    if (y <= 0) {
      nav.classList.remove('nav-hidden');
      return;
    }

    if (dy > threshold) nav.classList.add('nav-hidden');
    else if (dy < -threshold) nav.classList.remove('nav-hidden');
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
}

/* ════ TOAST ════ */
function toast(msg) {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span style="color:var(--gold-bright)">✦</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
}

/* ════════════════════════════════════
   TRACKER
════════════════════════════════════ */
let S = {};
let openDay = null;
function tLoad() { try { S = JSON.parse(storage.getItem('rm47')||'{}'); } catch { S={}; } }
function tSave() { storage.setItem('rm47', JSON.stringify(S)); }
function dd(d) { if(!S[d]) S[d]={}; return S[d]; }
function pct(d) { return Math.round(TASKS.filter(t=>dd(d)[t.id]).length/TASKS.length*100); }
function full(d) { return pct(d)===100; }

function rday() {
  const n=new Date(); n.setHours(0,0,0,0);
  const s=new Date(RAMADAN_START); s.setHours(0,0,0,0);
  return Math.min(Math.max(Math.floor((n-s)/86400000)+1,1),TOTAL);
}
function dayDate(d) { const dt=new Date(RAMADAN_START); dt.setDate(dt.getDate()+d-1); return dt; }
function fmt(dt) { return dt.toLocaleDateString('ar-EG',{month:'long',day:'numeric',year:'numeric'}); }
function fmtS(dt) { return dt.toLocaleDateString('ar-EG',{weekday:'short',month:'short',day:'numeric'}); }

function mkRing(p, size, sw, gid='g1') {
  const r=(size-sw)/2, c=2*Math.PI*r, off=c*(1-p/100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
    <defs><linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0c84a"/><stop offset="100%" stop-color="#6b5015"/>
    </linearGradient></defs>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(196,145,42,0.1)" stroke-width="${sw}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#${gid})" stroke-width="${sw}"
      stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"
      style="transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)"/>
  </svg>`;
}

function updateStats() {
  const today = rday();
  let tot=0, done=0;
  for(let d=1;d<=today;d++) { tot+=TASKS.length; done+=TASKS.filter(t=>dd(d)[t.id]).length; }
  document.getElementById('stat-today').textContent = fmt(dayDate(today));
  document.getElementById('stat-day').textContent = 'اليوم '+today;
  document.getElementById('stat-left').textContent = Math.max(0,TOTAL-today);
  document.getElementById('stat-done').textContent = done+' / '+tot;
}

function updateOverall() {
  let tot = 0, done = 0;
  for (let d = 1; d <= TOTAL; d++) {
    const dayData = S[d] || {};
    TASKS.forEach(t => {
      tot++;
      if (dayData[t.id]) done++;
    });
  }
  const p = tot > 0 ? Math.round(done / tot * 100) : 0;
  const c = 2 * Math.PI * 78;
  const ring = document.getElementById('overall-ring');
  const pctEl = document.getElementById('overall-pct');
  if (ring) ring.style.strokeDashoffset = c * (1 - p / 100);
  if (pctEl) pctEl.textContent = toAr(p) + '%';
  
  let ci = 0;
  if (p >= 100) ci = 5;
  else if (p >= 75) ci = 4;
  else if (p >= 50) ci = 3;
  else if (p >= 25) ci = 2;
  else if (p > 0) ci = 1;
  
  const caption = document.getElementById('ring-caption');
  if (caption) caption.textContent = CAPTIONS[ci];
}

function renderCalendar() { buildCalendar(); }
function buildCalendar() {
  const cal = document.getElementById('calendar');
  const today = rday();
  cal.innerHTML = '';
  for(let d=1;d<=TOTAL;d++) {
    const p = pct(d);
    const dt = dayDate(d);
    const st = d===today?'today':d<today?'past':'future';
    const cc = full(d)?' complete':'';
    const bgs = TASKS.filter(t=>dd(d)[t.id]).map(t=>`<span class="dc-badge">${t.badge}</span>`).join('');
    const card = document.createElement('div');
    card.className = `day-card ${st}${cc}`;
    card.style.setProperty('--i',d);
    card.id = `card-${d}`;
    card.innerHTML = `
      <div class="dc-num">اليوم ${d}</div>
      <div class="dc-weekday">${fmtS(dt)}</div>
      <div class="dc-ring"><div class="dc-ring-wrap" id="mr-${d}">${mkRing(p,60,5,'g'+d)}<div class="dc-pct">${p}%</div></div></div>
      <div class="dc-badges" id="db-${d}">${bgs}</div>
    `;
    card.addEventListener('click', () => openModal(d));
    cal.appendChild(card);
  }
}

function refreshCard(d) {
  const rw = document.getElementById(`mr-${d}`);
  const bw = document.getElementById(`db-${d}`);
  if(!rw||!bw) return;
  const p = pct(d);
  const bgs = TASKS.filter(t=>dd(d)[t.id]).map(t=>`<span class="dc-badge">${t.badge}</span>`).join('');
  rw.innerHTML = mkRing(p,60,5,'g'+d)+`<div class="dc-pct">${p}%</div>`;
  bw.innerHTML = bgs;
  const card = document.getElementById(`card-${d}`);
  if(card) card.classList.toggle('complete', full(d));
}

function openModal(d) {
  openDay = d;
  const dt = dayDate(d);
  document.getElementById('m-day-num').textContent = `اليوم ${d} من رمضان`;
  document.getElementById('m-date').textContent = fmt(dt);
  document.getElementById('m-ar').textContent = AR_NUMS[d-1]+' رمضان';
  renderMRing(d); renderTasks(d); renderBadges(d);
  const dua = DUAS[(d-1)%DUAS.length];
  document.getElementById('dua-ar').textContent = dua.ar;
  document.getElementById('dua-en').textContent = dua.en;
  document.getElementById('dua-panel').classList.remove('open');
  document.getElementById('dua-btn').classList.remove('active');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
  openDay = null;
}
function renderMRing(d) {
  const p = pct(d);
  const wrap = document.getElementById('m-ring-wrap');
  const old = wrap.querySelector('svg');
  if(old) old.remove();
  wrap.insertAdjacentHTML('afterbegin', mkRing(p,110,8,'mr'+d));
  document.getElementById('m-pct').textContent = p+'%';
}
function renderTasks(d) {
  const data = dd(d);
  document.getElementById('m-tasks').innerHTML = TASKS.map(t=>`
    <div class="task ${data[t.id]?'done':''}" id="t-${t.id}" onclick="toggleTask(${d},'${t.id}')">
      <span class="task-ico">${t.icon}</span>
      <div class="task-body"><div class="task-name">${t.name}</div><div class="task-sub">${t.sub}</div></div>
      <div class="task-tick">${data[t.id]?'✓':''}</div>
    </div>
  `).join('');
}
function renderBadges(d) {
  const done = TASKS.filter(t=>dd(d)[t.id]);
  const sec = document.getElementById('badge-sec');
  if(!done.length) { sec.style.display='none'; return; }
  sec.style.display='';
  document.getElementById('badge-chips').innerHTML = done.map(t=>`<div class="chip">${t.badge} ${t.badgeName}</div>`).join('');
}
function toggleTask(d, tid) {
  const data = dd(d);
  const prev = full(d);
  data[tid] = !data[tid];
  tSave();
  const el = document.getElementById(`t-${tid}`);
  if(el) { el.classList.toggle('done', data[tid]); el.querySelector('.task-tick').textContent = data[tid]?'✓':''; }
  const task = TASKS.find(t=>t.id===tid);
  if(data[tid]) toast(`${task.icon} ${task.name} — تم!`);
  renderMRing(d); renderBadges(d);
  refreshCard(d); updateOverall(); updateStats();
  if(!prev && full(d)) setTimeout(()=>toast(`🌟 اليوم ${d} مكتمل — ماشاء الله!`), 500);
}
function toggleDua() {
  document.getElementById('dua-panel').classList.toggle('open');
  document.getElementById('dua-btn').classList.toggle('active');
}

document.getElementById('overlay').addEventListener('click', e => { if(e.target===document.getElementById('overlay')) closeModal(); });
document.getElementById('modal-close-btn').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ════════════════════════════════════
   PRAYER TIMES  (FIX: full rewrite)
════════════════════════════════════ */
var CITIES = {
  EG:['القاهرة:Cairo','الإسكندرية:Alexandria','الجيزة:Giza','الأقصر:Luxor','أسوان:Aswan','شرم الشيخ:Sharm el-Sheikh','الإسماعيلية:Ismailia','المنصورة:Mansoura','طنطا:Tanta','أبو حمد:Abu Hammad'],
  SA:['الرياض:Riyadh','جدة:Jeddah','مكة المكرمة:Mecca','المدينة المنورة:Medina','الدمام:Dammam','الطائف:Taif'],
  AE:['دبي:Dubai','أبوظبي:Abu Dhabi','الشارقة:Sharjah','عجمان:Ajman'],
  KW:['الكويت:Kuwait City'],
  QA:['الدوحة:Doha'],
  BH:['المنامة:Manama'],
  OM:['مسقط:Muscat'],
  YE:['صنعاء:Sanaa','عدن:Aden'],
  IQ:['بغداد:Baghdad','البصرة:Basra','أربيل:Erbil'],
  SY:['دمشق:Damascus','حلب:Aleppo'],
  JO:['عمّان:Amman','الزرقاء:Zarqa'],
  LB:['بيروت:Beirut'],
  LY:['طرابلس:Tripoli','بنغازي:Benghazi'],
  TN:['تونس:Tunis'],
  DZ:['الجزائر:Algiers'],
  MA:['الرباط:Rabat','الدار البيضاء:Casablanca','مراكش:Marrakesh'],
  SD:['الخرطوم:Khartoum'],
  PS:['القدس:Jerusalem','غزة:Gaza','رام الله:Ramallah'],
  TR:['إسطنبول:Istanbul','أنقرة:Ankara'],
  GB:['لندن:London','برمنغهام:Birmingham','مانشستر:Manchester'],
  US:['نيويورك:New York','لوس أنجلوس:Los Angeles','شيكاغو:Chicago'],
  DE:['برلين:Berlin','ميونخ:Munich','فرانكفورت:Frankfurt'],
  FR:['باريس:Paris','مرسيليا:Marseille','ليون:Lyon'],
};

var PRAYER_NAMES = { Fajr:'الفجر', Sunrise:'الشروق', Dhuhr:'الظهر', Asr:'العصر', Maghrib:'المغرب', Isha:'العشاء', Imsak:'الإمساك' };
var PRAYER_ICONS = { Fajr:'🌙', Sunrise:'🌄', Dhuhr:'☀️', Asr:'🌤', Maghrib:'🌅', Isha:'🌌', Imsak:'🌙' };

/* FIX: updateCities — properly syncs dropdown */
function updateCities(selectedCity) {
  const country = document.getElementById('prayer-country').value;
  const cityEl  = document.getElementById('prayer-city');
  const cities  = CITIES[country] || [];
  cityEl.innerHTML = cities.map(c => {
    const [ar, en] = c.split(':');
    return `<option value="${en}">${ar}</option>`;
  }).join('');
  if (selectedCity) cityEl.value = selectedCity;
}

/* FIX: savePrayerLocation — was missing entirely */
function savePrayerLocation() {
  const country = document.getElementById('prayer-country').value;
  const city    = document.getElementById('prayer-city').value;
  storage.setItem('rm47_prayer_location', JSON.stringify({ country, city }));
}

async function loadSavedPrayerLocation() {
  try {
    const saved = storage.getItem('rm47_prayer_location');
    if (saved) {
      const { country, city } = JSON.parse(saved);
      const countryEl = document.getElementById('prayer-country');
      if (countryEl) {
        countryEl.value = country;
        updateCities(city);
        await fetchPrayerTimes();
      }
    } else {
      // Default: load Egypt/Cairo on first visit
      const countryEl = document.getElementById('prayer-country');
      if (countryEl) {
        countryEl.value = 'EG';
        updateCities('Cairo');
        await fetchPrayerTimes();
      }
    }
  } catch(e) {
    console.warn('loadSavedPrayerLocation error:', e);
  }
}

let countdownInterval = null;
let notifCheckInterval = null;

/* FIX: fetchPrayerTimes — saves location, restarts countdown, better error msg */
async function fetchPrayerTimes() {
  const city      = document.getElementById('prayer-city').value;
  const country   = document.getElementById('prayer-country').value;
  const errorEl   = document.getElementById('prayer-error');
  const loadingEl = document.getElementById('prayer-loading');
  const cardsEl   = document.getElementById('prayer-cards');

  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl)   errorEl.style.display   = 'none';
  if (cardsEl)   cardsEl.style.display   = 'none';

  // Save immediately so refresh also uses last selection
  savePrayerLocation();

  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=5&tune=0,-5,0,0,0,0,0,0,0`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.code !== 200 || !data.data?.timings) throw new Error('Bad API response');
    prayerData = data.data.timings;
    displayPrayerTimes(prayerData);
    if (cardsEl) cardsEl.style.display = '';
    startCountdown(prayerData);
    if (errorEl) errorEl.style.display = 'none';
  } catch (err) {
    console.warn('Prayer API failed, using fallback:', err.message);
    // Reasonable fallback (Egypt/Cairo approximate for Ramadan 2026)
    prayerData = { Imsak:'04:45', Fajr:'04:55', Sunrise:'06:22', Dhuhr:'12:06', Asr:'15:22', Maghrib:'17:50', Isha:'19:08' };
    displayPrayerTimes(prayerData);
    if (cardsEl) cardsEl.style.display = '';
    startCountdown(prayerData);
    if (errorEl) {
      errorEl.textContent = '⚠️ تعذّر الاتصال بالإنترنت — يتم عرض مواقيت تقريبية. يرجى التحقق من اتصالك ثم اضغط "تحديث".';
      errorEl.style.display = 'block';
    }
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
  }
}

function to12h(t24) {
  if (!t24) return '--:--';
  let [h, m] = t24.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${period}`;
}

/* FIX: displayPrayerTimes — guard against missing timings, highlight next prayer correctly */
function displayPrayerTimes(t) {
  if (!t || !t.Fajr) { console.error('Invalid prayer data:', t); return; }

  const imsakTime = t.Imsak || t.Fajr;
  const imsakEl   = document.getElementById('imsak-time');
  const iftarEl   = document.getElementById('iftar-time');
  const dateEl    = document.getElementById('prayer-date-label');
  if (imsakEl) imsakEl.textContent = to12h(imsakTime);
  if (iftarEl) iftarEl.textContent = to12h(t.Maghrib);
  if (dateEl)  dateEl.textContent  = '📅 ' + new Date().toLocaleDateString('ar-EG', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const order   = ['Imsak','Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
  const now     = new Date();
  const nowSecs = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();

  // Find next prayer key
  let nextKey = null;
  for (const key of order) {
    if (!t[key]) continue;
    const [h, m] = t[key].split(':').map(Number);
    if (h*3600 + m*60 > nowSecs) { nextKey = key; break; }
  }

  const grid = document.getElementById('prayer-grid');
  if (!grid) return;

  // Show Fajr→Isha in main grid (skip Imsak from grid, shown separately)
  const displayOrder = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
  grid.innerHTML = displayOrder.map(key => {
    if (!t[key]) return '';
    const [h, m] = t[key].split(':').map(Number);
    const pSecs  = h*3600 + m*60;
    const isPast = pSecs < nowSecs;
    const isNext = key === nextKey;
    return `<div style="background:${isNext?'rgba(196,145,42,0.18)':'rgba(13,19,72,0.7)'};
              border:1px solid ${isNext?'rgba(196,145,42,0.5)':'rgba(196,145,42,0.15)'};
              border-radius:12px;padding:14px;text-align:center;
              opacity:${isPast&&!isNext?0.5:1};transition:all 0.3s">
      <div style="font-size:1.4rem">${PRAYER_ICONS[key]||'🕌'}</div>
      <div style="font-family:var(--font-ar);font-size:0.9rem;color:var(--gold-pale);margin:4px 0">${PRAYER_NAMES[key]||key}</div>
      <div style="font-family:var(--font-ar);font-size:1.3rem;color:${isNext?'var(--gold-bright)':'var(--ivory)'};font-weight:700">${to12h(t[key])}</div>
      ${isNext?'<div style="font-size:0.65rem;color:var(--gold-bright);margin-top:4px;font-family:var(--font-dec);letter-spacing:2px">▶ التالية</div>':''}
    </div>`;
  }).join('');
}

/* FIX: startCountdown — clears old interval first */
function startCountdown(t) {
  if (countdownInterval) clearInterval(countdownInterval);
  updateCountdown(t);
  countdownInterval = setInterval(() => updateCountdown(t), 1000);
}

/* FIX: updateCountdown — handles midnight rollover, Imsak countdown for suhoor */
function updateCountdown(t) {
  if (!t || !t.Maghrib) return;
  const now     = new Date();
  const nowSecs = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();
  const order   = ['Imsak','Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];

  let nextKey  = null;
  let nextSecs = null;
  for (const key of order) {
    if (!t[key]) continue;
    const [h, m] = t[key].split(':').map(Number);
    const secs   = h*3600 + m*60;
    if (secs > nowSecs) { nextKey = key; nextSecs = secs; break; }
  }

  const labelEl     = document.getElementById('countdown-label');
  const countdownEl = document.getElementById('prayer-countdown');
  if (!labelEl || !countdownEl) return;

  if (!nextKey) {
    // Past Isha — count down to Imsak next day
    const [ih, im] = t.Imsak ? t.Imsak.split(':').map(Number) : t.Fajr.split(':').map(Number);
    const imsakSecsTomorrow = 86400 - nowSecs + ih*3600 + im*60;
    const hh  = Math.floor(imsakSecsTomorrow / 3600);
    const min = Math.floor((imsakSecsTomorrow % 3600) / 60);
    const sec = imsakSecsTomorrow % 60;
    labelEl.textContent     = 'الوقت المتبقي حتى إمساك الغد';
    countdownEl.textContent = `${String(hh).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return;
  }

  const diff = nextSecs - nowSecs;
  const hh   = Math.floor(diff / 3600);
  const min  = Math.floor((diff % 3600) / 60);
  const sec  = diff % 60;

  // Friendly label
  let label = 'الوقت المتبقي حتى ' + (PRAYER_NAMES[nextKey] || 'الصلاة');
  if (nextKey === 'Imsak') label = 'الوقت المتبقي حتى الإمساك (انتهاء السحور)';
  if (nextKey === 'Maghrib') label = 'الوقت المتبقي حتى الإفطار 🌅';

  labelEl.textContent     = label;
  countdownEl.textContent = `${String(hh).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

/* ════════════════════════════════════
   HADITHS
════════════════════════════════════ */
const HADITHS = [{"id":1,"text":"مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ","source":"صحيح البخاري","narrator":"أبو هريرة رضي الله عنه","type":"حديث نبوي","icon":"🌙","explanation":"يبيّن هذا الحديث الشريف الفضل العظيم لصيام رمضان."},{"id":2,"text":"مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ","source":"صحيح البخاري","narrator":"أبو هريرة رضي الله عنه","type":"حديث نبوي","icon":"⭐","explanation":"يتحدث عن قيام الليل في رمضان."},{"id":3,"text":"إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الجَنَّةِ، وَغُلِّقَتْ أَبْوَابُ النَّارِ، وَصُفِّدَتِ الشَّيَاطِينُ","source":"صحيح البخاري","narrator":"أبو هريرة رضي الله عنه","type":"حديث نبوي","icon":"🌟","explanation":"يكشف عن التحوّل الكوني الذي يصاحب دخول رمضان."},{"id":4,"text":"الصِّيَامُ جُنَّةٌ","source":"صحيح البخاري","narrator":"أبو هريرة رضي الله عنه","type":"حديث نبوي","icon":"🛡️","explanation":"الصيام وقاية وسترة من النار."},{"id":5,"text":"لِلصَّائِمِ فَرْحَتَانِ: إِذَا أَفْطَرَ فَرِحَ بِفِطْرِهِ، وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ","source":"صحيح البخاري","narrator":"أبو هريرة رضي الله عنه","type":"حديث نبوي","icon":"😊","explanation":"الصائم له فرحتان."},{"id":6,"text":"مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالعَمَلَ بِهِ فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ","source":"صحيح البخاري","narrator":"أبو هريرة رضي الله عنه","type":"أخلاق الصائم","icon":"📖","explanation":"الصيام الحقيقي صوم الجوارح."},{"id":7,"text":"تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً","source":"صحيح البخاري","narrator":"أنس بن مالك رضي الله عنه","type":"فضل السحور","icon":"🌙","explanation":"السحور سنّة نبوية مباركة."},{"id":8,"text":"اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ","source":"سنن أبي داود","narrator":"معاذ بن زهرة رضي الله عنه","type":"الإفطار والدعاء","icon":"🤲","explanation":"دعاء الإفطار المأثور."},{"id":9,"text":"شَهْرُ رَمَضَانَ أَوَّلُهُ رَحْمَةٌ، وَأَوْسَطُهُ مَغْفِرَةٌ، وَآخِرُهُ عِتْقٌ مِنَ النَّارِ","source":"مسند البزار","narrator":"أبو هريرة رضي الله عنه","type":"حديث نبوي","icon":"✨","explanation":"الخارطة الروحية لرمضان."},{"id":10,"text":"مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ","source":"سنن الترمذي","narrator":"زيد بن خالد رضي الله عنه","type":"الزكاة والصدقة","icon":"🌺","explanation":"فضل إطعام الصائم."}];

const EXTRA_HADITHS_FASTING = [
  { text:'(من صام رمضان إيماناً واحتساباً، غُفر له ما تقدم من ذنبه)', source:'رواه الشيخان', narrator:'أبو هريرة رضي الله عنه', type:'فضل الصيام', icon:'🌙', explanation:'فضل صيام رمضان إذا كان بإيمان واحتساب.' },
  { text:'"غزونا مع رسول الله صلى الله عليه وسلم لست عشرة مضت من رمضان، فمنا من صام ومنا من أفطر، فلم يعب الصائم على المفطر، ولا المفطر على الصائم"', source:'متفق عليه', narrator:'أبو سعيد الخدري رضي الله عنه', type:'فضل الصيام', icon:'⚖️', explanation:'تقرير سعة الشريعة وترك التعييب عند وجود الرخصة.' },
  { text:'(من صام رمضان ثم أتبعه ستاً من شوال، كان كصيام الدهر)', source:'رواه مسلم', narrator:'أبو أيوب الأنصاري رضي الله عنه', type:'فضل الصيام', icon:'📅', explanation:'فضل صيام رمضان واتباعه بست من شوال.' },
  { text:'(إذا جاء رمضان فُتّحت أبواب الجنة، وغُلّقت أبواب النار، وصُفّدت الشياطين)', source:'رواه مسلم', narrator:'أبو هريرة رضي الله عنه', type:'فضل الصيام', icon:'🌟', explanation:'من بركات رمضان تيسير الطاعة وتقليل أسباب المعصية.' },
  { text:'(من قام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه)', source:'متفق عليه', narrator:'أبو هريرة رضي الله عنه', type:'التراويح والقيام', icon:'🕌', explanation:'فضل قيام رمضان (التراويح والقيام) بإيمان واحتساب.' },
  { text:'(من قام ليلة القدر إيماناً واحتساباً، غُفر له ما تقدم من ذنبه)', source:'متفق عليه', narrator:'أبو هريرة رضي الله عنه', type:'ليلة القدر', icon:'⭐', explanation:'فضل قيام ليلة القدر.' },

  { text:'(عليك بالصوم، فإنه لا مثل له)', source:'رواه النسائي', narrator:'أبو أمامة رضي الله عنه', type:'فضل الصيام', icon:'🛡️', explanation:'بيان عظيم فضل الصوم وخصوصيته.' },
  { text:'(قال الله عزوجل: كل عمل بن آدم له إلا الصيام؛ فإنه لي وأنا أجزي به... والصيام جنّة... للصائم فرحتان...)', source:'رواه البخاري ومسلم', narrator:'أبو هريرة رضي الله عنه', type:'فضل الصيام', icon:'💛', explanation:'حديث جامع في فضل الصيام وآدابه.' },
  { text:'(فتنة الرجل في أهله وماله وولده وجاره، تكّفرها الصلاة، والصوم، والصدقة، والأمر والنهي)', source:'متفق عليه', narrator:'حذيفة بن اليمان رضي الله عنه', type:'أخلاق الصائم', icon:'🧭', explanation:'الأعمال الصالحة ومنها الصوم تكفّر الفتن والذنوب.' },
  { text:'(الصيام جُنّة من النار، كجنّة أحدكم من القتال)', source:'رواه ابن ماجه', narrator:'عثمان بن عفان رضي الله عنه', type:'فضل الصيام', icon:'🛡️', explanation:'الصوم وقاية من النار.' },
  { text:'(الصيام جنّة وحصن حصين من النار)', source:'رواه أحمد', narrator:'أبو هريرة رضي الله عنه', type:'فضل الصيام', icon:'🛡️', explanation:'تأكيد أن الصوم حصن للمسلم.' },
  { text:'(ثلاث دعوات لا ترد: دعوة الوالد، ودعوة الصائم، ودعوة المسافر)', source:'رواه البيهقي والضياء (إسناده حسن)', narrator:'أنس بن مالك رضي الله عنه', type:'فضل الصيام', icon:'🤲', explanation:'من مواطن الإجابة: دعاء الصائم.' },
  { text:'(صوم ثلاثة أيام صوم الدهر كله... وصم صوم داود عليه السلام، كان يصوم يوماً، ويفطر يوماً)', source:'رواه البخاري ومسلم', narrator:'عبد الله بن عمرو بن العاص رضي الله عنهما', type:'فضل الصيام', icon:'📖', explanation:'هدي نبوي في الاعتدال في الصيام والنفل.' },
  { text:'(من صام يوماً في سبيل الله، باعد الله وجهه عن النار سبعين خريفاً)', source:'متفق عليه', narrator:'أبو سعيد الخدري رضي الله عنه', type:'فضل الصيام', icon:'🔥', explanation:'فضل الصيام في سبيل الله.' },
  { text:'(من صام الأبد فلا صام ولا أفطر)', source:'رواه النسائي', narrator:'عبد الله بن عمر رضي الله عنهما', type:'فضل الصيام', icon:'⚠️', explanation:'النهي عن صوم الدهر لما فيه من مشقة ومخالفة للهدي.' },
  { text:'(من صام ثلاثة أيام من الشهر، فقد صام الدهر كله)', source:'رواه النسائي', narrator:'أبو ذر الغفاري رضي الله عنه', type:'فضل الصيام', icon:'📅', explanation:'فضل صيام ثلاثة أيام من كل شهر.' },
  { text:'(في الجنّة ثمانية أبواب، فيها باب يُسمى الريّان، لا يدخله إلا الصائمون)', source:'رواه البخاري', narrator:'سهل بن سعد رضي الله عنه', type:'فضل الصيام', icon:'🚪', explanation:'باب الريّان خاص بالصائمين.' },
  { text:'(لمن أطاب الكلام، وأطعم الطعام، وأدام الصيام، وصلى لله بالليل والناس نيام)', source:'رواه الترمذي', narrator:'علي بن أبي طالب رضي الله عنه', type:'فضل الصيام', icon:'🌙', explanation:'الأعمال التي ترفع الدرجات في الجنة.' },
  { text:'(الصيام والقرآن يشفعان للعبد يوم القيامة...)', source:'رواه أحمد', narrator:'عبد الله بن عمرو رضي الله عنه', type:'القرآن والذكر', icon:'📖', explanation:'فضل الصيام والقرآن وأنهما يشفعان لصاحبهما.' },
  { text:'(وآمركم بالصيام... وإن خلوف فم الصائم أطيب عند الله من ريح المسك)', source:'رواه أحمد', narrator:'الحارث الأشعري رضي الله عنه', type:'فضل الصيام', icon:'🌿', explanation:'بيان قيمة الصيام عند الله.' },
  { text:'(يا معشر الشباب! ... ومن لم يستطع فعليه بالصوم، فإنه له وجاء)', source:'متفق عليه', narrator:'علقمة والأسود عن النبي ﷺ', type:'فضل الصيام', icon:'🧑‍🧑‍🧒', explanation:'الصوم يعين على العفة وغض البصر.' },
  { text:'(هؤلاء الذين يفطرون قبل تحلّة صومهم)', source:'رواه ابن خزيمة', narrator:'أبو أمامة الباهلي رضي الله عنه', type:'فضل الصيام', icon:'⏳', explanation:'التحذير من الفطر قبل وقت الإفطار.' },
  { text:'(لا يزال الدين ظاهراً ما عجّل الناس الفطر؛ لأن اليهود والنصارى يؤخّرون)', source:'رواه أبو داود', narrator:'أبو هريرة رضي الله عنه', type:'الإفطار والدعاء', icon:'🌅', explanation:'استحباب تعجيل الفطر ومخالفة أهل الكتاب.' },

  { text:'(فصل ما بين صيامنا وصيام أهل الكتاب أكلة السَّحَر)', source:'رواه مسلم', narrator:'عمرو بن العاص رضي الله عنه', type:'فضل السحور', icon:'🌙', explanation:'السحور من خصائص صيام المسلمين.' },
  { text:'(السحور أكله بركة؛ فلا تدعوه... فإن الله عز وجل وملائكته يصلون على المتسحّرين)', source:'رواه أحمد وابن حبان', narrator:'أبو سعيد الخدري رضي الله عنه', type:'فضل السحور', icon:'🥣', explanation:'بركة السحور وفضل المتسحرين.' },
  { text:'(إن الله وملائكته يصلّون على المتسحّرين)', source:'رواه ابن حبان', narrator:'عبد الله بن عمر رضي الله عنهما', type:'فضل السحور', icon:'✨', explanation:'فضل السحور وعظيم أجره.' },
  { text:'(عليكم بغداء السحور؛ فإنه هو الغداء المبارك)', source:'رواه النسائي', narrator:'المقدام بن معدي كرب رضي الله عنه', type:'فضل السحور', icon:'🥣', explanation:'السحور غذاء مبارك يعين على الصيام.' },
  { text:'(ثلاث من أخلاق النبوة: تعجيل الإفطار، وتأخير السحور، ووضع اليمين على الشمال في الصلاة)', source:'رواه الطبراني', narrator:'أبو الدرداء رضي الله عنه', type:'فضل السحور', icon:'🕰️', explanation:'من السنن: تعجيل الفطر وتأخير السحور.' },
  { text:'(تسحّروا ولو بجرعة من ماء)', source:'رواه ابن حبان', narrator:'عبد الله بن عمر رضي الله عنهما', type:'فضل السحور', icon:'💧', explanation:'الحث على السحور ولو بالقليل.' },
];

try {
  const maxId = HADITHS.reduce((m, h) => Math.max(m, Number(h.id) || 0), 0);
  EXTRA_HADITHS_FASTING.forEach((h, i) => HADITHS.push({ id: maxId + i + 1, ...h }));
} catch (e) {
  console.warn('Failed to append extra fasting hadiths:', e);
}

let favorites = new Set();
let readToday = new Set();
let currentFilter = 'all';
let currentSearch = '';
let spotlightIdx = 0;
let spotExplanationOpen = false;
const TODAY_KEY = new Date().toISOString().split('T')[0];

function hLoad() {
  try {
    favorites = new Set(JSON.parse(storage.getItem('hfavs')||'[]'));
    readToday = new Set(JSON.parse(storage.getItem(`hread_${TODAY_KEY}`)||'[]'));
  } catch { favorites = new Set(); readToday = new Set(); }
}
function hSave() {
  storage.setItem('hfavs', JSON.stringify([...favorites]));
  storage.setItem(`hread_${TODAY_KEY}`, JSON.stringify([...readToday]));
}

function getDailyIdx() {
  const start = new Date(2026,1,19); const now = new Date(); now.setHours(0,0,0,0);
  return Math.max(0, Math.floor((now-start)/86400000)) % HADITHS.length;
}

function renderSpotlight(idx) {
  const h = HADITHS[idx]; if(!h) return;
  spotlightIdx = idx; spotExplanationOpen = false;
  const spot = document.getElementById('spotlight');
  spot.style.transition = 'opacity 0.25s';
  spot.style.opacity = '0';
  setTimeout(() => {
    document.getElementById('spot-badge').innerHTML = `${h.icon} حديث اليوم — ${h.id}`;
    document.getElementById('spot-text').textContent = h.text;
    document.getElementById('spot-source').innerHTML = `📚 ${h.source}`;
    document.getElementById('spot-narrator').textContent = `رواه ${h.narrator}`;
    document.getElementById('spot-explanation').textContent = h.explanation;
    document.getElementById('spot-explanation').classList.remove('open');
    document.getElementById('spot-hint').textContent = 'انقر للاطلاع على شرح الحديث ▾';
    const favBtn = document.getElementById('spot-fav-btn');
    favBtn.textContent = favorites.has(h.id) ? '❤️ في المفضلة' : '♡ المفضلة';
    favBtn.className = 'btn btn-outline' + (favorites.has(h.id) ? ' active-fav' : '');
    const rdBtn = document.getElementById('spot-read-btn');
    rdBtn.textContent = readToday.has(h.id) ? '✓ قرأتُه' : '☐ قرأتُه';
    rdBtn.className = 'btn btn-ghost' + (readToday.has(h.id) ? ' active-read' : '');
    spot.style.opacity = '1';
  }, 260);
}

function toggleSpotlightExplanation() {
  document.getElementById('spot-explanation').classList.toggle('open');
  spotExplanationOpen = !spotExplanationOpen;
  document.getElementById('spot-hint').textContent = spotExplanationOpen ? 'انقر لإخفاء الشرح ▴' : 'انقر للاطلاع على شرح الحديث ▾';
}

function randomHadith() {
  let idx; do { idx = Math.floor(Math.random()*HADITHS.length); } while(idx===spotlightIdx && HADITHS.length>1);
  renderSpotlight(idx);
}

function toggleSpotFav() {
  const h = HADITHS[spotlightIdx];
  if(favorites.has(h.id)) favorites.delete(h.id); else favorites.add(h.id);
  hSave(); renderSpotlight(spotlightIdx); updateHStats(); renderHadiths();
  toast(favorites.has(h.id) ? '❤️ تمت إضافة الحديث للمفضلة' : '💔 تم حذف الحديث من المفضلة');
}

function toggleSpotRead() {
  const h = HADITHS[spotlightIdx];
  if(readToday.has(h.id)) readToday.delete(h.id); else readToday.add(h.id);
  hSave(); renderSpotlight(spotlightIdx); updateHStats(); renderHadiths();
}

function filterCards(f, el) {
  currentFilter = f; currentSearch = '';
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderHadiths();
}

function searchCards(q) {
  currentSearch = q; currentFilter = 'all';
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  const allTab = document.querySelector('.filter-tab[data-filter="all"]');
  if (allTab) allTab.classList.add('active');
  renderHadiths();
}

function getFiltered() {
  return HADITHS.filter(h => {
    if(currentSearch) return h.text.includes(currentSearch)||(h.explanation||'').includes(currentSearch);
    if(currentFilter==='all') return true;
    if(currentFilter==='fav') return favorites.has(h.id);
    if(currentFilter==='read') return readToday.has(h.id);
    return h.type===currentFilter;
  });
}

function renderHadiths() {
  const grid     = document.getElementById('hadith-grid');
  const empty    = document.getElementById('empty-state');
  const favSec   = document.getElementById('favorites-section');
  const favGrid  = document.getElementById('fav-grid');
  const filtered = getFiltered();
  if(!filtered.length) { grid.innerHTML=''; empty.style.display='block'; favSec.style.display='none'; return; }
  empty.style.display='none';
  grid.innerHTML = filtered.map((h,i)=>cardHTML(h,i)).join('');
  const favs = HADITHS.filter(h=>favorites.has(h.id));
  if(favs.length && currentFilter!=='fav') { favSec.style.display='block'; favGrid.innerHTML=favs.map((h,i)=>cardHTML(h,i)).join(''); }
  else favSec.style.display='none';
}

function cardHTML(h, i) {
  const isFav=favorites.has(h.id), isRead=readToday.has(h.id);
  return `<div class="h-card" style="animation-delay:${i*0.04}s">
    <div class="hc-header"><div class="hc-icon">${h.icon}</div><div><div class="hc-num">حديث ${h.id}</div><div class="hc-type">${h.type}</div></div></div>
    <div class="hc-text">${h.text}</div>
    <div class="hc-meta">📚 ${h.source} — رواه ${h.narrator}</div>
    ${h.explanation?`<div class="hc-explanation" id="exp-${h.id}">${h.explanation}</div><div class="hc-toggle" onclick="toggleExp(${h.id})" id="tog-${h.id}">▾ اقرأ الشرح</div>`:''}
    <div class="hc-actions">
      <button class="hc-btn ${isFav?'fav-active':''}" onclick="toggleFav(${h.id})">${isFav?'❤️ محفوظ':'♡ المفضلة'}</button>
      <button class="hc-btn ${isRead?'read-active':''}" onclick="toggleRead(${h.id})">${isRead?'✓ مقروء':'☐ قرأتُه'}</button>
    </div>
  </div>`;
}

function toggleExp(id) {
  const exp=document.getElementById(`exp-${id}`), tog=document.getElementById(`tog-${id}`);
  exp.classList.toggle('open');
  tog.textContent=exp.classList.contains('open')?'▴ إخفاء الشرح':'▾ اقرأ الشرح';
}
function toggleFav(id) {
  if(favorites.has(id)) favorites.delete(id); else favorites.add(id);
  hSave(); renderHadiths(); updateHStats();
  if(HADITHS[spotlightIdx]?.id===id) renderSpotlight(spotlightIdx);
}
function toggleRead(id) {
  if(readToday.has(id)) readToday.delete(id); else readToday.add(id);
  hSave(); renderHadiths(); updateHStats();
  if(HADITHS[spotlightIdx]?.id===id) renderSpotlight(spotlightIdx);
}
const EXTRA_HADITHS = [
  {
    title: 'كتابة الوصية',
    narrator: 'عن عبد الله بن عمر بن الخطاب رضي الله عنهما',
    text: 'مَا حَقُّ امْرِئٍ مُسْلِمٍ لَهُ شَيْءٌ يُوصِي فِيهِ، يَبِيتُ لَيْلَتَيْنِ إِلَّا وَوَصِيَّتُهُ مَكْتُوبَةٌ عِنْدَهُ',
    source: 'متفق عليه',
  },
  {
    title: 'الحمد بعد الطعام والشراب',
    narrator: 'عن أبي أمامة الباهلي رضي الله عنه',
    text: 'الحَمْدُ لِلَّهِ كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ، وَلَا مُسْتَغْنًى عَنْهُ رَبُّنَا',
    source: 'رواه البخاري',
  },
  {
    title: 'الدعاء بظهر الغيب',
    narrator: 'عن أبي الدرداء رضي الله عنه',
    text: 'مَا مِنْ عَبْدٍ مُسْلِمٍ يَدْعُو لِأَخِيهِ بِظَهْرِ الْغَيْبِ، إِلَّا قَالَ الْمَلَكُ: وَلَكَ بِمِثْلٍ',
    source: 'رواه مسلم',
  },
  {
    title: 'كظم الغيظ',
    narrator: 'عن معاذ بن أنس الجهني رضي الله عنه',
    text: 'مَنْ كَظَمَ غَيْظًا وَهُوَ قَادِرٌ عَلَى أَنْ يُنْفِذَهُ، دَعَاهُ اللَّهُ عَزَّ وَجَلَّ عَلَى رُءُوسِ الْخَلَائِقِ يَوْمَ الْقِيَامَةِ حَتَّى يُخَيِّرَهُ فِي أَيِّ الْحُورِ شَاءَ',
    source: 'رواه أبو داود وصححه الألباني',
  },
  {
    title: 'فضيلة الإصلاح بين الناس',
    narrator: 'عن أبي الدرداء رضي الله عنه',
    text: 'أَلَا أُخْبِرُكُمْ بِأَفْضَلَ مِنْ دَرَجَةِ الصِّيَامِ وَالصَّلَاةِ وَالصَّدَقَةِ؟ صَلَاحُ ذَاتِ الْبَيْنِ، فَإِنَّ فَسَادَ ذَاتِ الْبَيْنِ هِيَ الْحَالِقَةُ',
    source: 'رواه أبو داود والترمذي',
  },
  {
    title: 'إهداء الطعام بين الجيران',
    narrator: 'عن أبي ذر الغفاري رضي الله عنه',
    text: 'إِذَا طَبَخْتَ مَرَقًا فَأَكْثِرْ مَاءَهُ، ثُمَّ انْظُرْ أَهْلَ بَيْتٍ مِنْ جِيرَانِكَ، فَأَصِبْهُمْ مِنْهَا بِمَعْرُوفٍ',
    source: 'رواه مسلم',
  },
  {
    title: 'البشاشة والتبسم',
    narrator: 'عن أبي ذر الغفاري رضي الله عنه',
    text: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    source: 'رواه الترمذي وصححه الألباني',
  },
  {
    title: 'السعي في قضاء حوائج الناس',
    narrator: 'عن عبد الله بن عمر رضي الله عنهما',
    text: 'الْمُسْلِمُ أَخُو الْمُسْلِمِ لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ، وَمَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ، وَمَنْ فَرَّجَ عَنْ مُسْلِمٍ كُرْبَةً فَرَّجَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرُبَاتِ يَوْمِ الْقِيَامَةِ',
    source: 'متفق عليه',
  },
  {
    title: 'التبكير إلى صلاة الجمعة',
    narrator: 'عن أبي هريرة رضي الله عنه',
    text: 'مَنِ اغْتَسَلَ يَوْمَ الجُمُعَةِ غُسْلَ الجَنَابَةِ ثُمَّ رَاحَ فَكَأَنَّمَا قَرَّبَ بَدَنَةً',
    source: 'متفق عليه',
  },
  {
    title: 'الوضوء قبل النوم',
    narrator: 'عن البراء بن عازب رضي الله عنه',
    text: 'إِذَا أَتَيْتَ مَضْجَعَكَ فَتَوَضَّأْ وُضُوءَكَ لِلصَّلَاةِ، ثُمَّ اضْطَجِعْ عَلَى شِقِّكَ الْأَيْمَنِ',
    source: 'متفق عليه',
  },
  {
    title: 'معاونة الأهل في المنزل',
    narrator: 'عن عائشة رضي الله عنها',
    text: 'كَانَ النَّبِيُّ ﷺ يَكُونُ فِي مِهْنَةِ أَهْلِهِ، فَإِذَا حَضَرَتِ الصَّلَاةُ خَرَجَ إِلَى الصَّلَاةِ',
    source: 'رواه البخاري',
  },
  {
    title: 'دعاء الخروج من المنزل',
    narrator: 'عن أم سلمة رضي الله عنها',
    text: 'اللَّهُمَّ أَعُوذُ بِكَ أَنْ أَضِلَّ، أَوْ أُضَلَّ، أَوْ أَزِلَّ، أَوْ أُزَلَّ، أَوْ أَظْلِمَ، أَوْ أُظْلَمَ، أَوْ أَجْهَلَ، أَوْ يُجْهَلَ عَلَيَّ',
    source: 'رواه أبو داود والنسائي',
  },
  {
    title: 'التسبيح والحمد كل يوم',
    narrator: 'عن سعد بن أبي وقاص رضي الله عنه',
    text: 'أَيَعْجَزُ أَحَدُكُمْ أَنْ يَكْسِبَ كُلَّ يَوْمٍ أَلْفَ حَسَنَةٍ؟ يُسَبِّحُ مِائَةَ تَسْبِيحَةٍ، فَيُكْتَبُ لَهُ أَلْفُ حَسَنَةٍ أَوْ يُحَطُّ عَنْهُ أَلْفُ خَطِيئَةٍ',
    source: 'رواه مسلم',
  },
  {
    title: 'دعاء رؤية الهلال',
    narrator: 'عن طلحة بن عبيد الله رضي الله عنه',
    text: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللَّهُ',
    source: 'رواه الترمذي وصحح',
  },
  {
    title: 'تعجيل الفطر وتأخير السحور',
    narrator: 'عن سهل بن سعد الساعدي رضي الله عنه',
    text: 'لَا يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الفِطْرَ',
    source: 'متفق عليه',
  },
  {
    title: 'الاجتماع على الطعام',
    narrator: 'عن وحشي بن حرب رضي الله عنه',
    text: 'اجْتَمِعُوا عَلَى طَعَامِكُمْ وَاذْكُرُوا اسْمَ اللَّهِ عَلَيْهِ يُبَارَكْ لَكُمْ فِيهِ',
    source: 'رواه أبو داود',
  },
  {
    title: 'دعاء كفارة المجلس',
    narrator: 'عن أبي هريرة رضي الله عنه',
    text: 'مَنْ جَلَسَ فِي مَجْلِسٍ، فَكَثُرَ فِيهِ لَغَطُهُ، فَقَالَ قَبْلَ أَنْ يَقُومَ مِنْ مَجْلِسِهِ ذَلِكَ: سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ — إِلَّا غُفِرَ لَهُ مَا كَانَ فِي مَجْلِسِهِ ذَلِكَ',
    source: 'رواه الترمذي وصحح',
  },
];

function buildExtraHadiths() {
  const container = document.getElementById('extra-hadith-container');
  if(!container) return;
  container.innerHTML = EXTRA_HADITHS.map((h,i) => `
    <div class="ex-card" style="animation-delay:${i*0.04}s">
      <div class="ex-title">📿 ${h.title}</div>
      <div class="ex-text">${h.text}</div>
      <div class="ex-meta">${h.narrator} — ${h.source}</div>
    </div>
  `).join('');
}

function updateHStats() {
  document.getElementById('stat-total').textContent = HADITHS.length;
  document.getElementById('stat-read').textContent  = readToday.size;
  document.getElementById('stat-fav').textContent   = favorites.size;
  const dayIdx = getDailyIdx();
  document.getElementById('stat-day-num').textContent = HADITHS[dayIdx]?.id||'—';
  const pctVal = Math.round(readToday.size/HADITHS.length*100);
  document.getElementById('progress-fill').style.width = pctVal+'%';
}

/* ════ TASBEEH ════ */
const TASBEEH_LIST = [
  { name:'التسبيح',         text:'سُبْحَانَ اللَّهِ',                    target:100, key:'sub', color:'#c4912a' },
  { name:'التحميد',         text:'الحَمْدُ لِلَّهِ',                     target:100, key:'ham', color:'#3a8a5a' },
  { name:'التكبير',         text:'اللَّهُ أَكْبَرُ',                     target:100, key:'kab', color:'#6a3a9a' },
  { name:'التهليل',         text:'لَا إِلَهَ إِلَّا اللَّهُ',            target:100, key:'tah', color:'#1a6a8a' },
  { name:'الاستغفار',       text:'أَسْتَغْفِرُ اللَّهَ',                 target:100, key:'ist', color:'#8a4a1a' },
  { name:'الصلاة على النبي',text:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',    target:100, key:'sal', color:'#6a1a3a' },
];
let tbCounts = {};
let currentTb = 0;

/* FIX #5: use storage wrapper in tbLoad/tbSave */
function tbLoad() {
  try { tbCounts = JSON.parse(storage.getItem(`tb_${TODAY_KEY}`)||'{}'); } catch { tbCounts={}; }
}
function tbSave() { storage.setItem(`tb_${TODAY_KEY}`, JSON.stringify(tbCounts)); }

function selectTasbeeh(idx, el) {
  currentTb = idx;
  document.querySelectorAll('.tb-tab').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  updateTasbeehUI();
}

function updateTasbeehUI() {
  const t     = TASBEEH_LIST[currentTb];
  const count = tbCounts[t.key]||0;
  document.getElementById('tb-name').textContent   = t.name;
  document.getElementById('tb-text').textContent   = t.text;
  document.getElementById('tb-count').textContent  = toAr(count);
  document.getElementById('tb-target').textContent = `الهدف: ${toAr(t.target)}`;
  const pctVal = Math.min(100, Math.round(count/t.target*100));
  document.getElementById('tb-bar').style.width    = pctVal+'%';
  document.getElementById('tb-btn').style.background = `radial-gradient(circle at 38% 38%, ${lighten(t.color)}, ${t.color})`;
  updateTasbeehTotal();
}

function lighten(hex) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+80)},${Math.min(255,g+80)},${Math.min(255,b+80)})`;
}
function updateTasbeehTotal() {
  const total = TASBEEH_LIST.reduce((s,t)=>s+(tbCounts[t.key]||0),0);
  document.getElementById('tasbeeh-total-display').textContent = toAr(total);
  document.getElementById('tasbeeh-breakdown').innerHTML = TASBEEH_LIST.map(t=>{
    const c=tbCounts[t.key]||0; if(!c) return '';
    return `<div style="background:rgba(196,145,42,0.1);border:1px solid rgba(196,145,42,0.2);border-radius:8px;padding:4px 10px;font-size:0.78rem;color:var(--gold-pale);font-family:var(--font-body)">${t.name}: ${toAr(c)}</div>`;
  }).join('');
}
function clickTasbeeh() {
  const t=TASBEEH_LIST[currentTb];
  tbCounts[t.key]=(tbCounts[t.key]||0)+1;
  tbSave();
  const btn=document.getElementById('tb-btn');
  btn.classList.remove('vibrate'); void btn.offsetWidth; btn.classList.add('vibrate');
  updateTasbeehUI();
  if(tbCounts[t.key]===t.target) setTimeout(()=>toast(`🌟 أكملت ${toAr(t.target)} من ${t.name}!`),100);
}
function resetCurrent() { const t=TASBEEH_LIST[currentTb]; tbCounts[t.key]=0; tbSave(); updateTasbeehUI(); }
function resetAll()    { tbCounts={}; tbSave(); updateTasbeehUI(); }

let currentAdhkarType = 'morning';
let adhkarCounts = {};

function switchDhikrTab(tab) {
  document.getElementById('dhikr-tasbeeh-ui').style.display = tab==='tasbeeh'?'block':'none';
  document.getElementById('dhikr-adhkar-ui').style.display  = tab==='adhkar'?'block':'none';
  document.getElementById('btn-tab-tasbeeh').classList.toggle('active', tab==='tasbeeh');
  document.getElementById('btn-tab-adhkar').classList.toggle('active',  tab==='adhkar');
  if(tab==='adhkar') renderAdhkar(currentAdhkarType);
}

function renderAdhkar(type) {
  currentAdhkarType = type;
  ['morning','evening','after_prayer','general'].forEach(t => {
    const btn = document.getElementById(`btn-adhkar-${t.replace('_','-')}`);
    if(btn) btn.classList.toggle('active', t===type);
  });
  const lists = { morning:MORNING_ADHKAR, evening:EVENING_ADHKAR, after_prayer:AFTER_PRAYER_ADHKAR, general:GENERAL_ADHKAR };
  const list  = lists[type] || MORNING_ADHKAR;
  const container = document.getElementById('adhkar-container');
  container.innerHTML = list.map(a => {
    const key  = `${type}_${a.id}`;
    const count = adhkarCounts[key]||0;
    const isDone = count>=a.count;
    return `<div class="adhkar-card ${isDone?'done':''}" onclick="incrementAdhkar('${key}',${a.count})">
      <div class="adhkar-text">${a.text}</div>
      ${a.hint?`<div class="adhkar-hint">${a.hint}</div>`:''}
      <div class="adhkar-footer">
        <div class="adhkar-count">${toAr(count)} / ${toAr(a.count)}</div>
        <div class="adhkar-check">${isDone?'✅':'✨'}</div>
      </div>
    </div>`;
  }).join('');
}

function incrementAdhkar(key, max) {
  if(!adhkarCounts[key]) adhkarCounts[key]=0;
  if(adhkarCounts[key]<max) {
    adhkarCounts[key]++;
    renderAdhkar(currentAdhkarType);
    if(adhkarCounts[key]===max) { toast('✅ تقبل الله منك'); vibrateDevice(); }
  }
}

function vibrateDevice() { if('vibrate' in navigator) navigator.vibrate(50); }
function toAr(n) { return n.toString().replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]); }

/* ════════════════════════════════════
   GOALS
════════════════════════════════════ */
function goalsLoad() { try { goals=JSON.parse(storage.getItem('rm47_goals')||'[]'); } catch { goals=[]; } }
function goalsSave() { storage.setItem('rm47_goals', JSON.stringify(goals)); }

function addGoal() {
  const name=document.getElementById('goal-name').value.trim();
  if(!name) { toast('⚠️ أدخل اسم الهدف أولًا'); return; }
  const icon=document.getElementById('goal-icon').value;
  const type=document.getElementById('goal-type').value;
  const target=parseInt(document.getElementById('goal-target').value)||30;
  goals.push({ id:Date.now(), name, icon, type, target, progress:0, log:{} });
  goalsSave();
  document.getElementById('goal-name').value='';
  renderGoals();
  toast(`${icon} تم إضافة الهدف: ${name}`);
}

function incrementGoal(id) {
  const g=goals.find(x=>x.id===id); if(!g) return;
  const today=new Date().toISOString().split('T')[0];
  if(g.type==='daily') {
    if(g.log[today]) { toast('✅ سبق تسجيل هذا اليوم'); return; }
    g.log[today]=1; g.progress=Object.keys(g.log).length;
  } else if(g.type==='once') { g.progress=1; }
  else { g.progress=(g.progress||0)+1; }
  goalsSave(); renderGoals();
  if(g.progress>=g.target) toast(`🌟 أحسنت! أكملت هدف: ${g.name}`);
}

function deleteGoal(id) { goals=goals.filter(x=>x.id!==id); goalsSave(); renderGoals(); }

function renderGoals() {
  const list=document.getElementById('goals-list');
  if(!goals.length) {
    list.innerHTML=`<div style="text-align:center;color:var(--ivory-soft);padding:40px;font-family:var(--font-ar)">لا توجد أهداف بعد — أضف هدفك الأول!</div>`;
  } else {
    list.innerHTML=goals.map(g=>{
      const pctVal=Math.min(100,Math.round(g.progress/g.target*100));
      return `<div style="background:rgba(13,19,72,0.75);border:1px solid rgba(196,145,42,${pctVal>=100?'0.5':'0.18'});border-radius:14px;padding:16px 18px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="font-size:1.6rem">${g.icon}</span>
          <div style="flex:1"><div style="font-family:var(--font-ar);font-size:1rem;color:var(--ivory)">${g.name}</div><div style="font-size:0.75rem;color:var(--gold-dim)">${g.type==='daily'?'يومي':g.type==='once'?'مرة واحدة':'عدد مرات'} — الهدف: ${toAr(g.target)}</div></div>
          <div style="font-family:var(--font-ar);font-size:1.2rem;color:var(--gold-bright);font-weight:700">${toAr(g.progress)}/${toAr(g.target)}</div>
        </div>
        <div style="height:6px;background:rgba(196,145,42,0.1);border-radius:6px;overflow:hidden;margin-bottom:10px">
          <div style="height:100%;width:${pctVal}%;background:linear-gradient(90deg,var(--gold),var(--gold-bright));border-radius:6px;transition:width 0.4s"></div>
        </div>
        <div style="display:flex;gap:8px">
          ${pctVal<100?`<button onclick="incrementGoal(${g.id})" style="flex:1;background:rgba(196,145,42,0.12);border:1px solid rgba(196,145,42,0.3);border-radius:8px;padding:8px;color:var(--gold-pale);font-family:var(--font-ar);font-size:0.88rem;cursor:pointer">✓ تسجيل</button>`:'<div style="flex:1;text-align:center;color:#80d090;font-family:var(--font-ar)">🌟 مكتمل!</div>'}
          <button onclick="deleteGoal(${g.id})" style="background:rgba(180,40,40,0.1);border:1px solid rgba(180,40,40,0.25);border-radius:8px;padding:8px 12px;color:#f09090;font-family:var(--font-ar);font-size:0.85rem;cursor:pointer">حذف</button>
        </div>
      </div>`;
    }).join('');
  }
  // Stats
  const total=goals.length, done=goals.filter(g=>g.progress>=g.target).length;
  const today=new Date().toISOString().split('T')[0];
  const todayDone=goals.filter(g=>g.type==='daily'&&g.log&&g.log[today]).length;
  document.getElementById('goals-stats-grid').innerHTML=[
    {label:'الأهداف الكلية',val:total,icon:'🎯'},
    {label:'مكتملة',val:done,icon:'✅'},
    {label:'سجّلتها اليوم',val:todayDone,icon:'📅'},
    {label:'نسبة الإنجاز',val:total?Math.round(done/total*100)+'%':'0%',icon:'📊'},
  ].map(x=>`<div style="background:rgba(13,19,72,0.7);border:1px solid rgba(196,145,42,0.18);border-radius:12px;padding:14px;text-align:center">
    <div style="font-size:1.4rem">${x.icon}</div>
    <div style="font-family:var(--font-ar);font-size:1.4rem;color:var(--gold-bright);font-weight:700;margin:4px 0">${typeof x.val==='number'?toAr(x.val):x.val}</div>
    <div style="font-size:0.72rem;color:var(--gold-dim);font-family:var(--font-dec);letter-spacing:1px">${x.label}</div>
  </div>`).join('');
  // Report
  const trackerDone=Object.keys(S).filter(d=>d<=30&&Object.values(S[d]||{}).some(v=>v)).length;
  document.getElementById('ramadan-report').innerHTML=[
    {label:'أيام الصيام المسجّلة',val:trackerDone+' يوم',icon:'🌙'},
    {label:'التسبيحات الكلية',val:toAr(Object.values(tbCounts).reduce((a,b)=>a+b,0)),icon:'📿'},
    {label:'أهداف شخصية',val:toAr(goals.length),icon:'🎯'},
    {label:'الأحاديث المحفوظة',val:toAr(favorites.size),icon:'❤️'},
  ].map(x=>`<div style="background:rgba(13,19,72,0.6);border:1px solid rgba(196,145,42,0.12);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px">
    <span style="font-size:1.3rem">${x.icon}</span>
    <div><div style="font-family:var(--font-ar);font-size:1rem;color:var(--gold-pale)">${x.val}</div><div style="font-size:0.72rem;color:var(--gold-dim)">${x.label}</div></div>
  </div>`).join('');
}

/* ════════════════════════════════════
   QURAN KHATMA
════════════════════════════════════ */
function quranLoad() { try { quranData=JSON.parse(storage.getItem('rm47_quran')||'{"pagesPerDay":{},"khatmaCount":1}'); } catch { quranData={pagesPerDay:{},khatmaCount:1}; } }
function quranSave() { storage.setItem('rm47_quran', JSON.stringify(quranData)); }
function getTotalPagesRead() { return Object.values(quranData.pagesPerDay).reduce((a,b)=>a+b,0); }
function updateQuranGoal() { quranData.khatmaCount=parseInt(document.getElementById('khatma-count').value)||1; quranSave(); renderQuranUI(); }
function logQuranPages() {
  const pages=parseInt(document.getElementById('quran-pages-input').value)||0;
  if(pages<=0) { toast('⚠️ أدخل عدد صفحات صحيح'); return; }
  const today=new Date().toISOString().split('T')[0];
  quranData.pagesPerDay[today]=(quranData.pagesPerDay[today]||0)+pages;
  quranSave();
  document.getElementById('quran-pages-input').value='';
  renderQuranUI();
  toast(`📖 تم تسجيل ${toAr(pages)} صفحة`);
  if(getTotalPagesRead()>=TOTAL_PAGES*quranData.khatmaCount) setTimeout(()=>toast('🌟 بارك الله فيك! أتممت الختمة!'),500);
}

function renderQuranUI() {
  const k=quranData.khatmaCount||1;
  document.getElementById('khatma-count').value=k;
  const goal=TOTAL_PAGES*k, done=Math.min(goal,getTotalPagesRead());
  const pctVal=Math.round(done/goal*100);
  const c=2*Math.PI*68;
  document.getElementById('quran-ring').style.strokeDashoffset=c*(1-pctVal/100);
  document.getElementById('quran-pct-display').textContent=pctVal+'%';
  document.getElementById('quran-pages-done').textContent=toAr(done)+' / '+toAr(goal)+' صفحة';
  const dailyGoal=Math.ceil(goal/30);
  document.getElementById('quran-daily-target').textContent=`📌 تحتاج ${toAr(dailyGoal)} صفحة يوميًا لإتمام ${toAr(k)} ختمة في ٣٠ يومًا`;
  const today=new Date().toISOString().split('T')[0];
  const todayPages=quranData.pagesPerDay[today]||0;
  document.getElementById('quran-today-logged').textContent=todayPages?`✅ سجّلت اليوم: ${toAr(todayPages)} صفحة (الهدف: ${toAr(dailyGoal)})`:
    `لم تسجّل تلاوتك اليوم بعد — الهدف ${toAr(dailyGoal)} صفحة`;
  const ramadanStart=new Date(2026,1,19);
  let gridHTML='';
  for(let d=1;d<=30;d++){
    const dt=new Date(ramadanStart); dt.setDate(dt.getDate()+d-1);
    const key=dt.toISOString().split('T')[0];
    const p=quranData.pagesPerDay[key]||0;
    const met=p>=dailyGoal, partial=p>0&&!met, isToday=key===today, isFuture=dt>new Date();
    gridHTML+=`<div style="background:${met?'rgba(74,138,58,0.25)':partial?'rgba(196,145,42,0.15)':isFuture?'rgba(13,19,72,0.4)':'rgba(13,19,72,0.6)'};border:1px solid ${isToday?'var(--gold)':'rgba(196,145,42,0.15)'};border-radius:10px;padding:10px 6px;text-align:center;opacity:${isFuture&&!isToday?0.5:1}">
      <div style="font-size:0.65rem;color:var(--gold-dim);font-family:var(--font-dec)">${d}</div>
      <div style="font-family:var(--font-ar);font-size:0.85rem;color:${met?'#80d090':partial?'var(--gold-bright)':'var(--ivory-soft)'};font-weight:700">${p?toAr(p):'—'}</div>
      ${met?'<div style="font-size:0.6rem">✅</div>':''}
    </div>`;
  }
  document.getElementById('quran-days-grid').innerHTML=gridHTML;
  document.getElementById('quran-schedule').innerHTML=AJZA.map((juz,i)=>{
    const dt=new Date(ramadanStart); dt.setDate(dt.getDate()+i);
    const key=dt.toISOString().split('T')[0];
    const done2=(quranData.pagesPerDay[key]||0)>=dailyGoal;
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:${done2?'rgba(74,138,58,0.12)':'rgba(13,19,72,0.4)'};border-radius:8px;border:1px solid ${done2?'rgba(74,138,58,0.3)':'rgba(196,145,42,0.1)'}">
      <div style="font-family:var(--font-dec);font-size:0.55rem;color:var(--gold-dim);width:24px;text-align:center">${i+1}</div>
      <div style="font-family:var(--font-ar);font-size:0.88rem;color:${done2?'#80d090':'var(--ivory)'};flex:1">${juz}</div>
      <div style="font-size:0.75rem">${done2?'✅':'📖'}</div>
    </div>`;
  }).join('');
}

/* ════ THEME ════ */
function toggleTheme() {
  const isLight=document.body.classList.toggle('light-theme');
  storage.setItem('rm47_theme', isLight?'light':'dark');
  const btn=document.getElementById('theme-toggle');
  if(btn) btn.textContent=isLight?'🌞':'🌙';
}
(function initTheme() {
  if(storage.getItem('rm47_theme')==='light') {
    document.body.classList.add('light-theme');
    const btn=document.getElementById('theme-toggle');
    if(btn) btn.textContent='🌞';
  }
})();

function loadNotifSettings() {
  try { notifSettings=JSON.parse(storage.getItem('rm47_notif')||'{}'); } catch { notifSettings={}; }
  ['suhoor','iftar','fajr','dhuhr','asr','isha','quran_remind','qadr_remind'].forEach(k=>{
    const elId = k==='quran_remind'?'notif-quran':k==='qadr_remind'?'notif-qadr':'notif-'+k;
    const el=document.getElementById(elId);
    if(el) el.classList.toggle('on',!!notifSettings[k]);
  });
}

function toggleNotif(key) {
  notifSettings[key]=!notifSettings[key];
  storage.setItem('rm47_notif',JSON.stringify(notifSettings));
  const idMap={
    suhoor:'notif-suhoor',
    iftar:'notif-iftar',
    fajr:'notif-fajr',
    dhuhr:'notif-dhuhr',
    asr:'notif-asr',
    isha:'notif-isha',
    quran_remind:'notif-quran',
    qadr_remind:'notif-qadr'
  };
  const el=document.getElementById(idMap[key]);
  if(el) el.classList.toggle('on',notifSettings[key]);
  toast(notifSettings[key]?'تم تفعيل التنبيه':'تم إيقاف التنبيه');
}

function toggleNotifPanel() { document.getElementById('notif-panel').classList.toggle('open'); }

function sendNotif(title, body) {
  if('Notification' in window && Notification.permission==='granted') new Notification(title,{body,icon:'🌙'});
  toast('🔔 '+title+': '+body);
}

function checkNotifications(pt) {
  if(!pt) return;
  const now=new Date(), nowMins=now.getHours()*60+now.getMinutes();

  // Prayer Times Parsing
  const parse = (t) => {
    if(!t) return null;
    const [h,m] = t.split(':').map(Number);
    return h*60+m;
  };

  const fajrMins = parse(pt.Fajr);
  const dhuhrMins = parse(pt.Dhuhr);
  const asrMins = parse(pt.Asr);
  const maghribMins = parse(pt.Maghrib);
  const ishaMins = parse(pt.Isha);

  // Suhoor (30 min before Imsak/Fajr)
  const imsakMins = fajrMins ? fajrMins - 10 : null;
  if(notifSettings.suhoor && imsakMins && nowMins === imsakMins - 20) {
    sendNotif('تنبيه السحور 🌙','تبقّى ٣٠ دقيقة على الإمساك — أسرع في سحورك!');
  }

  // Individual Prayer Notifications
  if(notifSettings.fajr && nowMins === fajrMins) sendNotif('صلاة الفجر 🌙','حان الآن موعد أذان الفجر');
  if(notifSettings.dhuhr && nowMins === dhuhrMins) sendNotif('صلاة الظهر ☀️','حان الآن موعد أذان الظهر');
  if(notifSettings.asr && nowMins === asrMins) sendNotif('صلاة العصر 🌤','حان الآن موعد أذان العصر');
  if(notifSettings.iftar && nowMins === maghribMins) sendNotif('حان وقت الإفطار! 🌅','اللهم لك صمت وعلى رزقك أفطرت');
  if(notifSettings.isha && nowMins === ishaMins) sendNotif('صلاة العشاء 🌌','حان الآن موعد أذان العشاء والتراويح');

  // Quran Reminder
  if(notifSettings.quran_remind){
    const today=new Date().toISOString().split('T')[0];
    if(!quranData.pagesPerDay[today] && now.getHours()===10 && now.getMinutes()===0) {
      sendNotif('تذكير التلاوة 📖','لم تسجّل تلاوتك اليوم بعد!');
    }
  }
}

notifCheckInterval = setInterval(()=>{ if(prayerData) checkNotifications(prayerData); }, 60000);

/* ════════════════════════════════════
   LAYLAT AL QADR  (FIX #1: ramadanDay → currentDay)
════════════════════════════════════ */
function initQadrSection() {
  const today=new Date(); today.setHours(0,0,0,0);
  const ramadanStart=new Date(2026,1,19); ramadanStart.setHours(0,0,0,0);
  /* FIX #1 — was using undefined `ramadanDay`, now use `currentDay` everywhere */
  const currentDay=Math.min(30,Math.max(1,Math.floor((today-ramadanStart)/86400000)+1));
  const daysToLast10=Math.max(0,21-currentDay);
  const daysLeftEl=document.getElementById('qadr-days-left');
  if(daysLeftEl){
    if(currentDay<21)      daysLeftEl.textContent=`تبقّى ${toAr(daysToLast10)} يوم على العشر الأواخر`;
    else if(currentDay<=30) daysLeftEl.textContent=`نحن في اليوم ${toAr(currentDay)} من رمضان — العشر الأواخر جارية!`;
    else                   daysLeftEl.textContent='انتهت العشر الأواخر — تقبّل الله منكم';
  }

  // 10-night grid
  const grid=document.getElementById('qadr-nights-grid');
  if(grid){
    grid.innerHTML=Array.from({length:10},(_,i)=>{
      const d=i+21;
      const dt=new Date(2026,2,12+i); dt.setHours(0,0,0,0);
      const isPast=dt<today, isToday=dt.getTime()===today.getTime();
      return `<div style="background:${isToday?'rgba(196,145,42,0.25)':isPast?'rgba(13,19,72,0.4)':'rgba(13,19,72,0.7)'};border:1px solid ${isToday?'var(--gold)':'rgba(196,145,42,0.15)'};border-radius:10px;padding:10px 6px;text-align:center;opacity:${isPast&&!isToday?0.5:1}">
        <div style="font-family:var(--font-ar);font-size:1.1rem;color:var(--gold-bright);font-weight:700">${toAr(d)}</div>
        <div style="font-size:0.62rem;color:var(--gold-dim)">${isToday?'اليوم':isPast?'مضى':''}</div>
      </div>`;
    }).join('');
  }

  // Odd nights
  const oddGrid=document.getElementById('odd-nights-grid');
  if(oddGrid){
    oddGrid.innerHTML=ODD_NIGHTS.map(n=>{
      const dt=new Date(2026,2,12+(n.night-21)); dt.setHours(0,0,0,0);
      const isPast=dt<today, isToday=dt.getTime()===today.getTime();
      return `<div style="background:${isToday?'rgba(196,145,42,0.22)':isPast?'rgba(13,19,72,0.35)':'rgba(13,19,72,0.6)'};border:2px solid ${isToday?'var(--gold-bright)':n.special?'rgba(196,145,42,0.5)':'rgba(196,145,42,0.15)'};border-radius:12px;padding:12px 8px;text-align:center;opacity:${isPast&&!isToday?0.5:1}">
        <div style="font-size:1.1rem">${n.special?'⭐':'🌙'}</div>
        <div style="font-family:var(--font-ar);font-size:1.2rem;color:var(--gold-bright);font-weight:700;margin:4px 0">ليلة ${toAr(n.night)}</div>
        <div style="font-size:0.68rem;color:var(--gold-dim)">${n.date}</div>
        ${n.special?`<div style="font-size:0.65rem;color:var(--gold-bright);margin-top:4px">${n.special}</div>`:''}
      </div>`;
    }).join('');
  }

  // Checklist
  const stored=JSON.parse(storage.getItem('rm47_qadr_check')||'{}');
  const cl=document.getElementById('qadr-checklist');
  if(cl){
    cl.innerHTML=QADR_CHECKLIST_ITEMS.map(item=>{
      const done=stored[item.id];
      return `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:${done?'rgba(74,138,58,0.15)':'rgba(13,19,72,0.5)'};border:1px solid ${done?'rgba(74,138,58,0.35)':'rgba(196,145,42,0.12)'};border-radius:10px;cursor:pointer;transition:var(--tr)" onclick="toggleQadrCheck('${item.id}',this)">
        <span style="font-size:1.2rem">${done?'✅':item.icon}</span>
        <span style="font-family:var(--font-ar);font-size:0.95rem;color:${done?'#80d090':'var(--ivory)'};flex:1">${item.label}</span>
      </div>`;
    }).join('');
  }

  // Stars animation
  const starsEl=document.getElementById('qadr-stars');
  if(starsEl&&starsEl.children.length===0){
    for(let i=0;i<20;i++){
      const s=document.createElement('div');
      s.style.cssText=`position:absolute;width:2px;height:2px;background:var(--gold-bright);border-radius:50%;opacity:${Math.random()*0.5+0.2};left:${Math.random()*100}%;top:${Math.random()*100}%;animation:shimmer ${2+Math.random()*2}s ease-in-out infinite;animation-delay:${Math.random()*3}s`;
      starsEl.appendChild(s);
    }
  }
  loadQadrAdhkarCounts();
  renderQadrAdhkar();
}

function toggleQadrCheck(id) {
  const stored=JSON.parse(storage.getItem('rm47_qadr_check')||'{}');
  stored[id]=!stored[id];
  storage.setItem('rm47_qadr_check',JSON.stringify(stored));
  initQadrSection();
  if(stored[id]) toast('✅ بارك الله فيك!');
}

let qadrAdhkarCounts={};
function loadQadrAdhkarCounts() { try { qadrAdhkarCounts=JSON.parse(storage.getItem('qadr_adhkar_counts')||'{}'); } catch { qadrAdhkarCounts={}; } }
function saveQadrAdhkarCounts() { storage.setItem('qadr_adhkar_counts',JSON.stringify(qadrAdhkarCounts)); }

function renderQadrAdhkar() {
  const container=document.getElementById('qadr-adhkar-container');
  if(!container) return;
  container.innerHTML=QADR_ADHKAR.map(a=>{
    const key=`qadr_${a.id}`, count=qadrAdhkarCounts[key]||0, isDone=count>=a.count;
    return `<div class="adhkar-card ${isDone?'done':''}" style="padding:15px;margin-bottom:0" onclick="incrementQadrAdhkar('${key}',${a.count})">
      <div class="adhkar-text" style="font-size:1rem;margin-bottom:8px">${a.text}</div>
      <div class="adhkar-hint" style="font-size:0.75rem;padding:5px 10px;margin-bottom:10px">${a.hint}</div>
      <div class="adhkar-footer" style="padding-top:8px">
        <div class="adhkar-count" style="font-size:0.9rem">${toAr(count)} / ${toAr(a.count)}</div>
        <div class="adhkar-check">${isDone?'✅':'✨'}</div>
      </div>
    </div>`;
  }).join('');
}

function incrementQadrAdhkar(key, max) {
  if(!qadrAdhkarCounts[key]) qadrAdhkarCounts[key]=0;
  if(qadrAdhkarCounts[key]<max){
    qadrAdhkarCounts[key]++;
    saveQadrAdhkarCounts();
    renderQadrAdhkar();
    if(qadrAdhkarCounts[key]===max){ toast('✅ تقبل الله منك في هذه الليالي المباركة'); vibrateDevice(); }
  }
}

function copyQadrDua() {
  const dua='اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي';
  navigator.clipboard?.writeText(dua).then(()=>toast('📋 تم نسخ الدعاء!')).catch(()=>toast('✓ الدعاء جاهز للنسخ'));
}

/* ════ DUA CARDS ════ */
function filterDuaCards(cat, btn) {
  duaCardFilter=cat;
  document.querySelectorAll('#dua-filter-row .filter-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderDuaCards();
}
function renderDuaCards() {
  const list=duaCardFilter==='all'?DUA_CARDS:DUA_CARDS.filter(d=>d.cat===duaCardFilter);
  document.getElementById('dua-cards-grid').innerHTML=list.map((d,i)=>`
    <div class="dua-card">
      <div class="dua-card-cat">${d.icon} ${d.cat}</div>
      <div class="dua-card-arabic">${d.arabic}</div>
      <div class="dua-card-trans" id="dtrans-${i}">${d.trans}</div>
      <div class="dua-card-footer">
        <span class="dua-card-source">📚 ${d.source}</span>
        <div style="display:flex;gap:6px">
          <button class="dua-copy-btn" onclick="toggleDuaTrans(${i})">المعنى</button>
          <button class="dua-copy-btn" onclick="copyDua('${d.arabic.replace(/'/g,"\\'")}')">نسخ 📋</button>
        </div>
      </div>
    </div>`).join('');
}
function toggleDuaTrans(i) { const el=document.getElementById('dtrans-'+i); if(el) el.classList.toggle('show'); }
function copyDua(text) { navigator.clipboard?.writeText(text).then(()=>toast('📋 تم نسخ الدعاء!')).catch(()=>toast('✓ الدعاء في الحافظة')); }

/* ════ STATS PAGE ════ */
function renderStatsPage() {
  const today=new Date(); today.setHours(0,0,0,0);
  const currentDay=Math.min(30,Math.max(1,Math.floor((today-RAMADAN_START)/86400000)+1));
  let completedDays=0, totalTasksDone=0;
  const taskCounts={};
  for(let d=1;d<=currentDay;d++){
    const dayData=S[d]||{};
    const done=Object.values(dayData).filter(v=>v).length;
    totalTasksDone+=done;
    if(done===8) completedDays++;
    Object.entries(dayData).forEach(([k,v])=>{ if(v) taskCounts[k]=(taskCounts[k]||0)+1; });
  }
  let streak=0;
  for(let d=currentDay;d>=1;d--){ if(Object.values(S[d]||{}).filter(v=>v).length===8) streak++; else break; }
  const totalTasbeeh=Object.values(tbCounts).reduce((a,b)=>a+b,0);
  const quranTotal=getTotalPagesRead();
  document.getElementById('big-stats').innerHTML=[
    {icon:'🌙',val:toAr(currentDay),label:'يوم في رمضان'},
    {icon:'✅',val:toAr(completedDays),label:'أيام مكتملة'},
    {icon:'🏅',val:toAr(totalTasksDone),label:'مهمة منجزة'},
    {icon:'📿',val:toAr(totalTasbeeh),label:'تسبيحة'},
    {icon:'📖',val:toAr(quranTotal),label:'صفحة مقروءة'},
    {icon:'❤️',val:toAr(favorites?favorites.size:0),label:'حديث محفوظ'},
  ].map(x=>`<div style="background:rgba(13,19,72,0.75);border:1px solid rgba(196,145,42,0.2);border-radius:14px;padding:16px;text-align:center">
    <div style="font-size:1.6rem">${x.icon}</div>
    <div style="font-family:var(--font-ar);font-size:1.8rem;color:var(--gold-bright);font-weight:700;margin:6px 0">${x.val}</div>
    <div style="font-size:0.7rem;color:var(--gold-dim);font-family:var(--font-dec);letter-spacing:1px">${x.label}</div>
  </div>`).join('');
  // Weekly chart
  const weeks=[0,0,0,0];
  for(let d=1;d<=30;d++){ const week=Math.min(3,Math.floor((d-1)/7)); weeks[week]+=Object.values(S[d]||{}).filter(v=>v).length; }
  const maxW=Math.max(...weeks,1);
  document.getElementById('weekly-chart').innerHTML=weeks.map((w,i)=>`
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="font-size:0.65rem;color:var(--gold-dim)">${toAr(w)}</div>
      <div style="width:100%;background:linear-gradient(180deg,var(--gold-bright),var(--gold));border-radius:4px 4px 0 0;height:${Math.round(w/maxW*85)+5}px;min-height:5px;transition:height 0.5s"></div>
    </div>`).join('');
  // Task breakdown
  const TASK_LABELS={fajr:'الفجر',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب/الإفطار',isha:'العشاء/التراويح',quran:'القرآن',dhikr:'الذكر',sadaqah:'الصدقة'};
  document.getElementById('task-breakdown').innerHTML=Object.entries(TASK_LABELS).map(([k,label])=>{
    const cnt=taskCounts[k]||0, pctVal=Math.round(cnt/currentDay*100);
    return `<div style="display:flex;align-items:center;gap:10px">
      <div style="font-family:var(--font-ar);font-size:0.85rem;color:var(--ivory-mid);width:130px;text-align:right">${label}</div>
      <div style="flex:1;height:8px;background:rgba(196,145,42,0.1);border-radius:8px;overflow:hidden">
        <div style="height:100%;width:${pctVal}%;background:linear-gradient(90deg,var(--gold),var(--gold-bright));border-radius:8px;transition:width 0.5s"></div>
      </div>
      <div style="font-family:var(--font-ar);font-size:0.8rem;color:var(--gold-dim);width:40px;text-align:left">${toAr(cnt)}/${toAr(currentDay)}</div>
    </div>`;
  }).join('');
  document.getElementById('streak-num').textContent=toAr(streak);
  document.getElementById('streak-msg').textContent=streak===0?'سجّل اليوم لتبدأ سلسلتك':streak<7?'استمر — أنت في المسار الصحيح!':streak<14?'🌟 أسبوع كامل — ما شاء الله!':'مثابر حقيقي 🏆';
  document.getElementById('streak-fire').textContent=streak===0?'✨':streak<7?'🔥':'🔥🔥';
}

function updateStatsOnTabChange(name) {
  if(name==='stats')    renderStatsPage();
  else if(name==='duacards') renderDuaCards();
  else if(name==='qadr') initQadrSection();
  else if(name==='prayer') { updateCities(); if(!prayerData) fetchPrayerTimes(); }
}

/* ════ DUA REMINDER MODAL ════ */
(function() {
  setTimeout(() => {
    const today=new Date().toISOString().split('T')[0];
    if(storage.getItem('last_dua_show')===today) return;
    const overlay=document.createElement('div');
    overlay.id='dua-reminder-overlay';
    overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(3,5,15,0.92);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.5s ease';
    overlay.innerHTML=`<style>
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes scaleIn{from{transform:scale(0.85) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
      @keyframes shimmer{0%,100%{opacity:0.6}50%{opacity:1}}
      #dua-reminder-box{background:linear-gradient(160deg,#0d1348,#070d2e);border:1px solid rgba(196,145,42,0.5);border-radius:22px;padding:36px 30px 28px;max-width:440px;width:92vw;text-align:center;box-shadow:0 0 60px rgba(196,145,42,0.15),0 24px 80px rgba(0,0,0,0.7);position:relative;animation:scaleIn 0.45s cubic-bezier(0.175,.885,.32,1.275);overflow:hidden}
      .dr-ornament{color:var(--gold-bright);font-size:1.8rem;margin-bottom:8px;animation:shimmer 2s ease-in-out infinite}
      .dr-title{font-family:var(--font-ar);font-size:1.55rem;color:var(--gold-bright);margin-bottom:18px;line-height:1.7}
      .dr-dua-box{background:rgba(196,145,42,0.07);border:1px solid rgba(196,145,42,0.22);border-radius:14px;padding:18px 16px;margin:10px 0 20px}
      .dr-dua-text{font-family:var(--font-ar);font-size:1.1rem;color:var(--ivory);line-height:2.1;margin-bottom:10px}
      .dr-dua-sub{font-family:var(--font-ar);font-size:0.9rem;color:var(--ivory-mid);line-height:1.9}
      .dr-close-btn{margin-top:18px;background:linear-gradient(135deg,var(--gold),var(--gold-bright));border:none;border-radius:12px;padding:13px 38px;color:var(--ink);font-family:var(--font-ar);font-size:1.05rem;font-weight:700;cursor:pointer;width:100%}
    </style>
    <div id="dua-reminder-box">
      <div class="dr-ornament">🌙 ✦ 🌙</div>
      <div class="dr-title">لا تنسونا من صالح دعائكم</div>
      <div class="dr-dua-box">
        <div class="dr-dua-text">اللَّهُمَّ اغْفِرْ لَنَا وَلِوَالِدِينَا</div>
        <div class="dr-dua-sub">اللَّهُمَّ ارْحَمْ وَالِدَيَّ كَمَا رَبَّيَانِي صَغِيرًا<br>وَأَسْكِنْهُمَا فَسِيحَ جَنَّاتِكَ يَا أَرْحَمَ الرَّاحِمِينَ</div>
      </div>
      <button class="dr-close-btn" onclick="closeDuaReminder()">آمين — اللَّهُمَّ آمين 🤲</button>
    </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';
    storage.setItem('last_dua_show', today);
  }, 1500);
})();

window.closeDuaReminder = function() {
  const overlay=document.getElementById('dua-reminder-overlay');
  if(!overlay) return;
  overlay.style.transition='opacity 0.4s ease'; overlay.style.opacity='0';
  setTimeout(()=>{ overlay.remove(); document.body.style.overflow=''; },400);
};

/* ════ ARTICLE MODALS ════ */
function openQadrSchedule() {
  document.getElementById('article-body').innerHTML=`<div class="article-content"><h3>📅 الجدول اليومي المقترح للعشر الأواخر</h3><p>يُستحب في العشر الأواخر إحياء الليل بالصلاة والذكر والدعاء، وقراءة القرآن، والإكثار من الاستغفار لا سيما في الليالي الوترية.</p></div>`;
  document.getElementById('article-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function openQadrArticle() {
  document.getElementById('article-body').innerHTML=`<div class="article-content"><h3>🌙 فضل العشر الأواخر</h3><p>العشر الأواخر من رمضان أهم فترة في الشهر الكريم — تتضاعف الأجور وتُفتح أبواب الرحمة. كان النبي ﷺ يُحيي الليل ويوقظ أهله ويجد ويشد المئزر في هذه الليالي.</p></div>`;
  document.getElementById('article-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeArticleModal() { document.getElementById('article-overlay').classList.remove('open'); document.body.style.overflow=''; }

/* ════════════════════════════════════
   INIT  (FIX #4 & #6: single init point inside DOMContentLoaded)
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  tLoad();
  hLoad();
  tbLoad();
  goalsLoad();
  quranLoad();
  loadQadrAdhkarCounts();
  loadNotifSettings();

  // Render everything once DOM is ready
  buildCalendar();
  updateOverall();
  updateStats();
  renderSpotlight(getDailyIdx());
  renderHadiths();
  updateHStats();
  buildExtraHadiths();
  updateTasbeehUI();
  renderGoals();
  renderQuranUI();
  renderDuaCards();
  initQadrSection();
  renderStatsPage();

  // Prayer times — load saved or default
  updateCities();
  loadSavedPrayerLocation();

  // Request notification permission
  requestNotifPermission();

  // Hash navigation
  const hash=window.location.hash.replace('#','');
  if(hash) showSection(hash);

  // Welcome toast
  setTimeout(()=>toast('🌙 رمضان كريم — تقبّل الله منكم صيامكم وقيامكم!'), 1200);

  // Periodic refresh
  setInterval(()=>{ updateStats(); updateOverall(); }, 60000);

  initNavAutoHide();
});