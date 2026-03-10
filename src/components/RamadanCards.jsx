import React, { useState, useRef, useCallback } from 'react';
import { toJpeg } from 'html-to-image';
import { Download, Share2, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const ICONS = ['🌙','🕌','🕯️','✨','📿','🕋','📖','🤲','⭐','🏮','🏜️','🎉','🧡','🤍','☪️','🌟'];

const PATTERNS = {
  none:    '',
  stars:   `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 4 L43 36 L76 40 L43 44 L40 76 L37 44 L4 40 L37 36 Z' fill='%23d4af37' fill-opacity='0.15'/%3E%3C/svg%3E")`,
  dots:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='1.2' fill='%23d4af37' fill-opacity='0.25'/%3E%3C/svg%3E")`,
  outline: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 6 L54 44 L92 50 L54 56 L50 94 L46 56 L8 50 L46 44 Z' fill='none' stroke='%23d4af37' stroke-width='0.6' stroke-opacity='0.2'/%3E%3C/svg%3E")`,
  checker: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='25' height='25' fill='%23d4af37' fill-opacity='0.05'/%3E%3Crect x='25' y='25' width='25' height='25' fill='%23d4af37' fill-opacity='0.05'/%3E%3C/svg%3E")`,
};

const TEXT_COLORS = [
  { name: 'ذهبي',   value: '#d4af37' },
  { name: 'أبيض',   value: '#ffffff' },
  { name: 'فضي',    value: '#e2e8f0' },
  { name: 'أخضر',   value: '#10b981' },
  { name: 'كريمي',  value: '#fef3c7' },
  { name: 'أسود',   value: '#111111' },
];

const THEMES = [
  { id:1,  label:'ليلي',     from:'#0d1952', via:'#1a2a6c', to:'#03050f' },
  { id:2,  label:'بنفسجي',   from:'#2e004f', via:'#4a0080', to:'#03050f' },
  { id:3,  label:'زمرد',     from:'#003d2e', via:'#006d4e', to:'#03050f' },
  { id:4,  label:'قرمزي',    from:'#4b0000', via:'#800000', to:'#03050f' },
  { id:5,  label:'ذهبي',     from:'#7a5c1e', via:'#a07830', to:'#03050f' },
  { id:6,  label:'أخضر',     from:'#134e1b', via:'#166534', to:'#052e16' },
  { id:7,  label:'عنبر',     from:'#92400e', via:'#b45309', to:'#3b1f00' },
  { id:8,  label:'نيلي',     from:'#1e3a8a', via:'#1d4ed8', to:'#0f172a' },
  { id:9,  label:'فيروزي',   from:'#134e4a', via:'#0f766e', to:'#042f2e' },
  { id:10, label:'وردي',     from:'#7f1d1d', via:'#9f1239', to:'#0f0f1a' },
  { id:11, label:'داكن',     from:'#1e1b4b', via:'#312e81', to:'#0f0f0f' },
  { id:12, label:'رمادي',    from:'#1e293b', via:'#334155', to:'#0f172a' },
  { id:13, label:'كريم',     from:'#fdfbf7', via:'#f5e6d3', to:'#e8d5b5' },
  { id:14, label:'أردوازي',  from:'#1a1c23', via:'#2d3748', to:'#1a202c' },
  { id:15, label:'أصفر',     from:'#fffbeb', via:'#fef3c7', to:'#fde68a' },
  { id:16, label:'غرافيت',   from:'#111827', via:'#1f2937', to:'#030712' },
];

const DEFAULT_MESSAGES = [
  'رمضان كريم - كل عام وأنتم بخير',
  'تقبل الله صيامكم وقيامكم وصالح أعمالكم',
  'مبارك عليكم الشهر الفضيل',
  'اللهم بلغنا ليلة القدر ونحن في أحسن حال',
  'عساكم من عواده - كل عام وأنتم إلى الله أقرب',
  'يا رب اجعل رمضان هذا جبرًا لقلوبنا',
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const themeGradient = (t) =>
  t.via
    ? `linear-gradient(135deg, ${t.from}, ${t.via}, ${t.to})`
    : `linear-gradient(135deg, ${t.from}, ${t.to})`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function RamadanCards() {
  const cardRef = useRef(null);

  const [isExporting, setIsExporting]   = useState(false);
  const [customText,  setCustomText]    = useState('');
  const [selectedIcon,setSelectedIcon]  = useState('🌙');
  const [selectedPat, setSelectedPat]   = useState('stars');
  const [fontSize,    setFontSize]      = useState(26);
  const [fontColor,   setFontColor]     = useState('#d4af37');
  const [theme,       setTheme]         = useState(THEMES[0]);
  const [msgIdx,      setMsgIdx]        = useState(0);
  const [toast,       setToast]         = useState('');

  /* displayed text */
  const displayText = customText.trim() || DEFAULT_MESSAGES[msgIdx];

  /* cycle default messages */
  const nextMsg = () => setMsgIdx(i => (i + 1) % DEFAULT_MESSAGES.length);

  /* show toast */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  /* export */
  const exportCard = useCallback(async (action = 'download') => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      // render twice – first render warms up fonts/images
      await toJpeg(cardRef.current, { quality: 0.92, pixelRatio: 2, cacheBust: true });
      const dataUrl = await toJpeg(cardRef.current, { quality: 0.95, pixelRatio: 3, cacheBust: true });

    const hasFilesystem = !!window.Capacitor?.Plugins?.Filesystem;
      const hasShare = !!window.Capacitor?.Plugins?.Share;

      if (Capacitor.isNativePlatform()) {
        const base64Data = dataUrl.split(',')[1];
        const fileName = `ramadan-card-${Date.now()}.jpg`;

        if (action === 'download' && hasFilesystem) {
          try {
            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents,
            });
            showToast('✅ تم حفظ الصورة في المستندات');
          } catch (fsErr) {
            console.error('FS Error:', fsErr);
            handleWebExport(action, dataUrl);
          }
        } else if (action === 'share' && hasShare) {
          try {
            const savedFile = await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Cache,
            });
            await Share.share({
              title: 'بطاقة رمضانية 🌙',
              text: 'أهديك هذه التهنئة بمناسبة شهر رمضان المبارك',
              url: savedFile.uri,
            });
            showToast('✅ تمت المشاركة');
          } catch (shareErr) {
            console.error('Share Error:', shareErr);
            handleWebExport(action, dataUrl);
          }
        } else {
          handleWebExport(action, dataUrl);
        }
      } else {
        handleWebExport(action, dataUrl);
      }
    } catch (err) {
      console.error(err);
      showToast('❌ حدث خطأ - حاول مجددًا');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const handleWebExport = (action, dataUrl) => {
    if (action === 'download') {
      const a = document.createElement('a');
      a.download = `ramadan-${Date.now()}.jpg`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('✅ تم حفظ الصورة');
    } else {
      if (navigator.share) {
        fetch(dataUrl).then(res => res.blob()).then(blob => {
          const file = new File([blob], 'ramadan-card.jpg', { type: 'image/jpeg' });
          navigator.share({ files: [file], title: 'بطاقة رمضانية 🌙' })
            .then(() => showToast('✅ تمت المشاركة'))
            .catch(() => {
              window.open(dataUrl, '_blank');
              showToast('🔗 تم فتح الصورة');
            });
        });
      } else {
        window.open(dataUrl, '_blank');
        showToast('🔗 تم فتح الصورة');
      }
    }
  };

  /* ── render ── */
  return (
    <div style={styles.root} dir="rtl">

      {/* ── TOAST ── */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* ══ HEADER ══ */}
      <header style={styles.header}>
        <Sparkles size={20} style={{ color: '#d4af37' }} />
        <h1 style={styles.headerTitle}>بطاقات رمضان</h1>
        <Sparkles size={20} style={{ color: '#d4af37' }} />
      </header>
      <p style={styles.headerSub}>صمّم بطاقتك الخاصة وشاركها كصورة عالية الجودة</p>

      {/* ══ CARD PREVIEW ══ */}
      <div style={styles.previewWrap}>
        <div
          ref={cardRef}
          style={{
            ...styles.card,
            background: themeGradient(theme),
          }}
        >
          {/* pattern overlay */}
          {selectedPat !== 'none' && (
            <div style={{
              ...styles.patternOverlay,
              backgroundImage: PATTERNS[selectedPat],
              backgroundSize: '50px 50px',
            }} />
          )}

          {/* corner decorations */}
          <span style={{ ...styles.cornerIcon, top: 20, right: 20, fontSize: 44 }}>{selectedIcon}</span>
          <span style={{ ...styles.cornerIcon, bottom: 64, left: 20, fontSize: 32, transform:'rotate(15deg)' }}>{selectedIcon}</span>

          {/* divider + text */}
          <div style={styles.cardInner}>
            <div style={{ ...styles.divider, backgroundColor: fontColor + '55' }} />
            <p style={{ ...styles.cardText, fontSize, color: fontColor }}>
              {displayText}
            </p>
            <div style={{ ...styles.divider, backgroundColor: fontColor + '55' }} />
          </div>

          {/* branding */}
          <div style={styles.branding}>
            <span style={styles.brandApp}>تطبيق أثر</span>
            <span style={styles.brandSub}>ATHAR APP · RAMADAN 1447</span>
          </div>
        </div>
      </div>

      {/* ══ CONTROLS ══ */}
      <div style={styles.controls}>

        {/* ── default message cycle ── */}
        <Section label="💬 النص الافتراضي">
          <button style={styles.cycleBtn} onClick={nextMsg}>
            <RefreshCw size={14} />
            <span>تغيير الرسالة</span>
          </button>
          <p style={styles.cyclePreview}>{DEFAULT_MESSAGES[msgIdx]}</p>
        </Section>

        {/* ── custom text ── */}
        <Section label="✏️ اكتب نصك الخاص">
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="اكتب تهنئة خاصة هنا..."
            style={styles.textarea}
            rows={3}
          />
        </Section>

        {/* ── icon ── */}
        <Section label="✨ الأيقونة">
          <div style={styles.iconGrid}>
            {ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setSelectedIcon(ic)}
                style={{
                  ...styles.iconBtn,
                  background: selectedIcon === ic ? '#d4af37' : 'rgba(0,0,0,0.05)',
                  transform: selectedIcon === ic ? 'scale(1.15)' : 'scale(1)',
                }}
              >{ic}</button>
            ))}
          </div>
        </Section>

        {/* ── pattern ── */}
        <Section label="🎨 الزخرفة">
          <div style={styles.pillRow}>
            {Object.keys(PATTERNS).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPat(p)}
                style={{
                  ...styles.pill,
                  background: selectedPat === p ? '#d4af37' : 'rgba(0,0,0,0.05)',
                  color: selectedPat === p ? '#111' : '#444',
                  fontWeight: selectedPat === p ? 700 : 400,
                }}
              >
                {p === 'none' ? 'بدون' : p === 'stars' ? 'نجوم' : p === 'dots' ? 'نقاط' : p === 'outline' ? 'إطار' : 'مربعات'}
              </button>
            ))}
          </div>
        </Section>

        {/* ── font size ── */}
        <Section label={`🔤 حجم الخط — ${fontSize}px`}>
          <input
            type="range" min={16} max={48} value={fontSize}
            onChange={e => setFontSize(+e.target.value)}
            style={styles.range}
          />
        </Section>

        {/* ── font color ── */}
        <Section label="🖌️ لون الخط">
          <div style={styles.colorRow}>
            {TEXT_COLORS.map(c => (
              <button
                key={c.value}
                title={c.name}
                onClick={() => setFontColor(c.value)}
                style={{
                  ...styles.colorSwatch,
                  backgroundColor: c.value,
                  border: fontColor === c.value
                    ? '3px solid #d4af37'
                    : '2px solid rgba(255,255,255,0.15)',
                  transform: fontColor === c.value ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </Section>

        {/* ── theme ── */}
        <Section label="🌅 خلفية البطاقة">
          <div style={styles.themeGrid}>
            {THEMES.map(t => (
              <button
                key={t.id}
                title={t.label}
                onClick={() => setTheme(t)}
                style={{
                  ...styles.themeBtn,
                  background: themeGradient(t),
                  border: theme.id === t.id
                    ? '3px solid #d4af37'
                    : '2px solid rgba(255,255,255,0.1)',
                  transform: theme.id === t.id ? 'scale(1.12)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </Section>

      </div>

      {/* ══ ACTION BUTTONS ══ */}
      <div style={styles.actionRow}>
        <button
          onClick={() => exportCard('download')}
          disabled={isExporting}
          style={{ ...styles.btn, ...styles.btnSecondary }}
        >
          {isExporting
            ? <Loader2 size={18} style={styles.spin} />
            : <Download size={18} />}
          حفظ صورة
        </button>
        <button
          onClick={() => exportCard('share')}
          disabled={isExporting}
          style={{ ...styles.btn, ...styles.btnPrimary }}
        >
          {isExporting
            ? <Loader2 size={18} style={styles.spin} />
            : <Share2 size={18} />}
          مشاركة الآن
        </button>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: labeled section
───────────────────────────────────────────── */
function Section({ label, children }) {
  return (
    <div style={styles.section}>
      <p style={styles.sectionLabel}>{label}</p>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES  (inline – no Tailwind dependency)
───────────────────────────────────────────── */
const styles = {
  root: {
    minHeight: '100vh',
    background: 'transparent',
    color: '#f0ece0',
    fontFamily: "'Noto Sans Arabic', 'Cairo', sans-serif",
    maxWidth: 520,
    margin: '0 auto',
    padding: '0 0 100px',
    position: 'relative',
  },

  /* toast */
  toast: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a2a1a',
    border: '1px solid #d4af37',
    color: '#d4af37',
    padding: '10px 24px',
    borderRadius: 40,
    fontSize: 13,
    fontWeight: 600,
    zIndex: 9999,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    whiteSpace: 'nowrap',
  },

  /* header */
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 32,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#d4af37',
    margin: 0,
    letterSpacing: '0.03em',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  headerSub: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    margin: '0 0 20px',
  },

  /* preview */
  previewWrap: {
    padding: '0 20px 8px',
  },
  card: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4/5',
    borderRadius: 36,
    border: '5px solid rgba(212,175,55,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  patternOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  cornerIcon: {
    position: 'absolute',
    opacity: 0.28,
    lineHeight: 1,
    pointerEvents: 'none',
  },
  cardInner: {
    position: 'relative',
    zIndex: 2,
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 18,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 1,
    borderRadius: 4,
  },
  cardText: {
    lineHeight: 1.7,
    fontWeight: 700,
    fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
    margin: 0,
  },
  branding: {
    position: 'absolute',
    bottom: 18,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    zIndex: 2,
  },
  brandApp: {
    fontSize: 9,
    color: 'rgba(212,175,55,0.5)',
    letterSpacing: '0.25em',
    fontFamily: 'serif',
  },
  brandSub: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.15em',
  },

  /* controls */
  controls: {
    padding: '4px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#888',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    margin: 0,
  },

  /* cycle button */
  cycleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(212,175,55,0.12)',
    border: '1px solid rgba(212,175,55,0.3)',
    color: '#d4af37',
    borderRadius: 20,
    padding: '7px 16px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  cyclePreview: {
    fontSize: 13,
    color: '#666',
    margin: 0,
    lineHeight: 1.6,
    fontFamily: "'Noto Naskh Arabic', serif",
  },

  /* textarea */
  textarea: {
    width: '100%',
    background: 'rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 16,
    padding: '12px 14px',
    color: '#333',
    fontSize: 14,
    fontFamily: "'Noto Naskh Arabic', serif",
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    lineHeight: 1.7,
  },

  /* icons */
  iconGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.05)',
    transition: 'transform 0.15s, background 0.15s',
  },

  /* pills */
  pillRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '7px 16px',
    borderRadius: 20,
    border: 'none',
    fontSize: 12,
    cursor: 'pointer',
    background: 'rgba(0,0,0,0.05)',
    color: '#444',
    transition: 'background 0.15s, transform 0.15s',
  },

  /* range */
  range: {
    width: '100%',
    accentColor: '#d4af37',
    cursor: 'pointer',
  },

  /* color swatches */
  colorRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.15s, border 0.15s',
  },

  /* theme grid */
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: 8,
  },
  themeBtn: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'transform 0.15s, border 0.15s',
  },

  /* action buttons */
  actionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '16px 20px 0',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '15px',
    borderRadius: 18,
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Noto Sans Arabic', sans-serif",
    transition: 'opacity 0.2s, transform 0.1s',
  },
  btnSecondary: {
    background: 'rgba(0,0,0,0.05)',
    color: '#333',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg,#d4af37,#a0832a)',
    color: '#111',
    boxShadow: '0 8px 24px rgba(212,175,55,0.25)',
  },
  spin: {
    animation: 'spin 1s linear infinite',
  },
};