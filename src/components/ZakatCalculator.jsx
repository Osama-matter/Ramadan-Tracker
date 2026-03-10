import React, { useState, useMemo } from 'react';

const ZakatCalculator = () => {
  const [amount, setAmount] = useState('');
  const [goldPrice, setGoldPrice] = useState('');

  const result = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const price = parseFloat(goldPrice) || 0;
    const nisabThreshold = price * 85;

    const isNisabReached = amt >= nisabThreshold && nisabThreshold > 0;
    const zakatValue = isNisabReached ? (amt * 0.025) : 0;

    return {
      amt,
      price,
      nisabThreshold,
      isNisabReached,
      zakatValue: zakatValue.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      nisabText: nisabThreshold > 0 ? nisabThreshold.toLocaleString('ar-SA') : '...'
    };
  }, [amount, goldPrice]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="text-center p-6 bg-gradient-to-br from-gold/10 to-transparent rounded-3xl border border-gold/5">
        <h2 className="text-2xl font-bold text-gold font-scheherazade mb-2">حاسبة الزكاة</h2>
        <p className="text-text-mid text-xs font-amiri">احسب زكاة مالك بدقة بناءً على سعر الذهب الحالي</p>
      </div>

      <div className="bg-black/5 border border-black/10 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-gold text-[10px] mb-2 font-bold uppercase tracking-widest">سعر جرام الذهب اليوم (عيار ٢٤):</label>
            <input
              type="number"
              value={goldPrice}
              onChange={(e) => setGoldPrice(e.target.value)}
              placeholder="ادخل السعر بالعملة المحلية"
              className="w-full bg-surface border border-black/5 rounded-xl px-4 py-3 text-lg font-bold text-text-dark outline-none focus:border-gold/50 transition-all text-center placeholder:text-text-mid/50"
            />
          </div>

          <div>
            <label className="block text-gold text-[10px] mb-2 font-bold uppercase tracking-widest">إجمالي المبلغ المدخر (حال عليه الحول):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-surface border border-black/5 rounded-xl px-4 py-3 text-lg font-bold text-text-dark outline-none focus:border-gold/50 transition-all text-center placeholder:text-text-mid/50"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-black/5 space-y-6">
          <div className="flex justify-between items-center bg-black/5 p-4 rounded-2xl border border-black/5">
            <span className="text-text-mid text-xs font-amiri">نصاب الزكاة (٨٥ جرام):</span>
            <span className="text-gold-light font-bold font-amiri">{result.nisabText}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[10px] text-text-mid uppercase tracking-widest mb-2 font-bold">مقدار الزكاة الواجبة (٢.٥%)</div>
            <div className={`text-5xl font-black font-amiri transition-all ${result.isNisabReached ? 'text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-text-mid opacity-30'}`}>
              {result.isNisabReached ? result.zakatValue : '٠٫٠٠'}
            </div>
            {!result.isNisabReached && amount && goldPrice && (
              <p className="mt-3 text-red-400/80 text-[10px] font-amiri animate-pulse">المبلغ لم يبلغ النصاب بعد</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-gold/5 border border-gold/10 text-[11px] text-text-dark leading-relaxed font-amiri text-right">
        <h4 className="text-gold font-bold mb-2 flex items-center gap-2">
          <span>💡</span> تنبيهات هامة:
        </h4>
        <ul className="list-disc pr-4 space-y-1 opacity-80">
          <li>تجب الزكاة إذا ملكت النصاب (قيمة ٨٥ جرام ذهب عيار ٢٤) ومر عليه عام هجري كامل.</li>
          <li>نسبة الزكاة هي ٢.٥٪ من إجمالي المال المدخر.</li>
          <li>الذهب المستعمل للزينة (للمرأة) لا تجب فيه الزكاة عند جمهور العلماء، وإنما الزكاة في الذهب المدخر أو السبائك.</li>
        </ul>
      </div>
    </div>
  );
};

export default ZakatCalculator;
