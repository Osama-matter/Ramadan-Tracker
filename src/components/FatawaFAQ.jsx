import React, { useState } from 'react';

const FAQS = [
  {
    question: "ما هي مبطلات الصيام؟",
    answer: "مبطلات الصيام الأساسية هي: الأكل والشرب عمداً، الجماع، القيء عمداً، خروج دم الحيض أو النفاس، والعزم على الفطر."
  },
  {
    question: "هل استخدام بخاخ الربو يفطر؟",
    answer: "أفتى كثير من العلماء المعاصرين بأن بخاخ الربو لا يفطر لأنه غاز يذهب إلى الرئتين وليس طعاماً ولا شراباً يذهب إلى الجوف."
  },
  {
    question: "ما حكم من أكل أو شرب ناسياً؟",
    answer: "من أكل أو شرب ناسياً فليتم صومه، فإنما أطعمه الله وسقاه، ولا قضاء عليه ولا كفارة."
  },
  {
    question: "هل قطرة العين أو الأذن تفطر؟",
    answer: "الصحيح أن قطرة العين والأذن لا تفطر حتى لو وجد طعمها في الحلق، لأن العين والأذن ليستا منفذاً معتاداً للجوف."
  },
  {
    question: "ما هو ضابط المرض المبيح للفطر؟",
    answer: "هو المرض الذي يشق معه الصيام مشقة شديدة، أو يخشى منه زيادة المرض أو تأخر الشفاء."
  },
  {
    question: "متى تجب زكاة الفطر؟",
    answer: "تجب بغروب شمس آخر يوم من رمضان، ويسن إخراجها قبل صلاة العيد، ويجوز تقديمها ليوم أو يومين."
  },
  {
    question: "هل القيء غير المتعمد يفطر؟",
    answer: "لا، من ذرعه القيء (أي غلبه وخرج بغير إرادته) فلا قضاء عليه، أما من استقاء عمداً فليقضِ."
  },
  {
    question: "ما حكم استخدام معجون الأسنان أثناء الصيام؟",
    answer: "يجوز استخدام معجون الأسنان بشرط الحذر الشديد من بلع شيء منه، والأفضل استخدامه قبل الفجر أو بعد الإفطار خروجاً من الخلاف."
  },
  {
    question: "هل الحقن الوريدية أو العضلية تفطر؟",
    answer: "الحقن العلاجية (غير المغذية) لا تفطر سواء كانت في العضل أو الوريد، أما الحقن المغذية التي تقوم مقام الطعام والشراب فهي مفطرة."
  }
];

const FatawaFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 px-2">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-gold/20 shadow-inner">
          ❓
        </div>
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">فتاوى الصيام</h2>
        <p className="text-text-mid text-sm font-amiri px-6 leading-relaxed">أهم الأحكام الفقهية والأسئلة الشائعة التي تهمك في شهر رمضان</p>
      </div>

      <div className="space-y-3 px-2">
        {FAQS.map((faq, index) => (
          <div 
            key={index}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              activeIndex === index 
                ? 'bg-white shadow-lg border-gold/30' 
                : 'bg-white/40 border-black/5 hover:bg-white/60'
            }`}
          >
            <button 
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full p-5 text-right flex items-center justify-between gap-4"
            >
              <span className={`font-bold font-tajawal text-sm leading-relaxed transition-colors ${activeIndex === index ? 'text-gold-dark' : 'text-text-dark'}`}>
                {faq.question}
              </span>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeIndex === index ? 'bg-gold text-green-main rotate-180' : 'bg-black/5 text-gold'
              }`}>
                <span className="text-[10px]">▼</span>
              </div>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-2 text-text-dark font-amiri text-lg leading-loose bg-gold/5 border-t border-gold/10">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-green-main/5 border border-green-main/10 rounded-[2rem] text-center mx-4">
        <p className="text-xs text-text-mid italic leading-relaxed font-amiri">
          ملاحظة: هذه الفتاوى مستمدة من آراء كبار العلماء المعاصرين لتيسير الأحكام، ويُنصح بمراجعة أهل العلم في المسائل الخاصة.
        </p>
      </div>
    </div>
  );
};

export default FatawaFAQ;
