import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

// ─── Full 30-day Ramadan plan ─────────────────────────────────────────────────
const FULL_PLAN = {
    1: {
        title: 'اليوم الأول — تجديد النية', emoji: '🌱', color: '#4ade80', theme: 'emerald',
        desc: 'ابدأ رمضان بنية خالصة. الأعمال بالنيات، وكل خطوة صادقة تُحتسب.',
        quote: '«إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى»', quoteSrc: 'متفق عليه',
        tasks: [
            { id: 1, text: 'نية رمضان بقلب حاضر', cat: 'نية', icon: '💚' },
            { id: 2, text: 'صلاة الفجر في وقتها', cat: 'صلاة', icon: '🕌' },
            { id: 3, text: 'قراءة ربع جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'ذكر أذكار الصباح والمساء', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'الإفطار على تمر وماء', cat: 'سنة', icon: '🌙' },
        ]
    },
    2: {
        title: 'اليوم الثاني — الصلاة العمود', emoji: '🕌', color: '#60a5fa', theme: 'blue',
        desc: 'الصلاة عمود الدين، حافظ عليها في أوقاتها مع الجماعة.',
        quote: '«أول ما يُحاسَب عنه العبد يوم القيامة الصلاة»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'الصلوات الخمس في وقتها', cat: 'صلاة', icon: '🕌' },
            { id: 2, text: 'صلاة التراويح كاملة', cat: 'صلاة', icon: '🌙' },
            { id: 3, text: 'قراءة نصف جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'الاستغفار ٧٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'الدعاء عند الإفطار', cat: 'دعاء', icon: '🤲' },
        ]
    },
    3: {
        title: 'اليوم الثالث — القرآن الكريم', emoji: '📖', color: '#a78bfa', theme: 'violet',
        desc: 'رمضان شهر القرآن، خصّص وقتاً يومياً للتلاوة والتدبر.',
        quote: '«خيركم من تعلّم القرآن وعلّمه»', quoteSrc: 'البخاري',
        tasks: [
            { id: 1, text: 'تلاوة جزء كامل بتدبر', cat: 'قرآن', icon: '📖' },
            { id: 2, text: 'حفظ آية جديدة', cat: 'قرآن', icon: '🧠' },
            { id: 3, text: 'صلاة التراويح خاشعاً', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'تسبيح ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'إكرام الضيف أو الجار', cat: 'أخلاق', icon: '🤝' },
        ]
    },
    4: {
        title: 'اليوم الرابع — الصدقة والعطاء', emoji: '💝', color: '#f472b6', theme: 'pink',
        desc: 'الصدقة تطفئ الخطيئة كما يطفئ الماء النار.',
        quote: '«الصدقة تطفئ الخطيئة كما يطفئ الماء النار»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'الصدقة ولو بدرهم واحد', cat: 'صدقة', icon: '💝' },
            { id: 2, text: 'إطعام صائم', cat: 'صدقة', icon: '🍽️' },
            { id: 3, text: 'صلاة التراويح + الوتر', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'قراءة جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 5, text: 'كلمة طيبة لكل من قابلته', cat: 'أخلاق', icon: '😊' },
        ]
    },
    5: {
        title: 'اليوم الخامس — صلة الرحم', emoji: '👨‍👩‍👧', color: '#fb923c', theme: 'orange',
        desc: 'صلة الرحم تزيد في الرزق وتطيل في العمر.',
        quote: '«من أحب أن يُبسط له في رزقه، ويُنسأ له في أثره، فليصل رحمه»', quoteSrc: 'متفق عليه',
        tasks: [
            { id: 1, text: 'الاتصال بأحد الأقارب', cat: 'صلة', icon: '📞' },
            { id: 2, text: 'زيارة الوالدين أو الأرحام', cat: 'صلة', icon: '🏠' },
            { id: 3, text: 'صلاة التراويح جماعة', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'تلاوة نصف جزء', cat: 'قرآن', icon: '📖' },
            { id: 5, text: 'الدعاء للوالدين', cat: 'دعاء', icon: '🤲' },
        ]
    },
    6: {
        title: 'اليوم السادس — التوبة والاستغفار', emoji: '🕊️', color: '#67e8f9', theme: 'cyan',
        desc: 'لا يزال باب التوبة مفتوحاً، والله يفرح بتوبة عبده.',
        quote: '«كلّ بني آدم خطّاء، وخير الخطّائين التوّابون»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'الاستغفار ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 2, text: 'التوبة من ذنب محدد', cat: 'نفس', icon: '💔' },
            { id: 3, text: 'صلاة الوتر بدعاء القنوت', cat: 'صلاة', icon: '🌙' },
            { id: 4, text: 'تلاوة سورة الفرقان', cat: 'قرآن', icon: '📖' },
            { id: 5, text: 'الصدقة السرية', cat: 'صدقة', icon: '🤫' },
        ]
    },
    7: {
        title: 'اليوم السابع — شكر النعم', emoji: '✨', color: '#fbbf24', theme: 'amber',
        desc: 'الشكر يزيد النعم، وكل نفس تتنفسه نعمة.',
        quote: '«لئن شكرتم لأزيدنّكم»', quoteSrc: 'سورة إبراهيم ٧',
        tasks: [
            { id: 1, text: 'كتابة ١٠ نعم أشكر الله عليها', cat: 'شكر', icon: '📝' },
            { id: 2, text: 'سجدة شكر بعد كل صلاة', cat: 'صلاة', icon: '🙏' },
            { id: 3, text: 'تلاوة سورة الرحمن', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'سبحان الله وبحمده ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'مساعدة أحد في المنزل', cat: 'أخلاق', icon: '💪' },
        ]
    },
    8: {
        title: 'اليوم الثامن — الإخلاص', emoji: '💎', color: '#818cf8', theme: 'indigo',
        desc: 'الإخلاص سر القبول — أعمل لله وحده بلا رياء.',
        quote: '«قُلْ هُوَ اللَّهُ أَحَدٌ»', quoteSrc: 'سورة الإخلاص',
        tasks: [
            { id: 1, text: 'مراجعة النية في كل عمل', cat: 'نية', icon: '💚' },
            { id: 2, text: 'قراءة سورة الإخلاص ١٠ مرات', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'عمل خير سري لا يعلمه أحد', cat: 'صدقة', icon: '🤫' },
            { id: 4, text: 'صلاة التراويح بخشوع', cat: 'صلاة', icon: '🕌' },
            { id: 5, text: 'تجنب الرياء والمدح', cat: 'نفس', icon: '🎭' },
        ]
    },
    9: {
        title: 'اليوم التاسع — حسن الخلق', emoji: '😇', color: '#34d399', theme: 'emerald',
        desc: 'أكمل المؤمنين إيماناً أحسنهم خلقاً.',
        quote: '«إنَّ من أحبِّكم إليَّ وأقربِكم منِّي مجلساً يوم القيامة أحاسنَكم أخلاقاً»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'الابتسامة في وجه كل إنسان', cat: 'أخلاق', icon: '😊' },
            { id: 2, text: 'تجنب الغيبة والنميمة', cat: 'لسان', icon: '🤐' },
            { id: 3, text: 'الصبر عند الاستفزاز', cat: 'نفس', icon: '🧘' },
            { id: 4, text: 'تلاوة جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 5, text: 'صلاة الضحى ٢ ركعة', cat: 'صلاة', icon: '☀️' },
        ]
    },
    10: {
        title: 'اليوم العاشر — إطعام الصائمين', emoji: '🍽️', color: '#f87171', theme: 'red',
        desc: 'من فطّر صائماً كان له مثل أجره دون أن ينقص من أجره شيء.',
        quote: '«من فطَّر صائماً كان له مثل أجره»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'إعداد إفطار للصائمين', cat: 'صدقة', icon: '🍽️' },
            { id: 2, text: 'التصدق بثمن وجبة', cat: 'صدقة', icon: '💝' },
            { id: 3, text: 'صلاة التراويح كاملة', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'تلاوة جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 5, text: 'دعاء ختام العشر الأوائل', cat: 'دعاء', icon: '🤲' },
        ]
    },
    11: {
        title: 'اليوم الحادي عشر — العشر الوسطى', emoji: '🌿', color: '#4ade80', theme: 'green',
        desc: 'رحمة الله في العشر الوسطى تغمر المؤمنين — اطلبها بصدق.',
        quote: '«رمضان أوله رحمة، وأوسطه مغفرة، وآخره عتق من النار»', quoteSrc: 'ابن خزيمة',
        tasks: [
            { id: 1, text: 'دعاء الرحمة: اللهم ارحمنا برحمتك', cat: 'دعاء', icon: '🤲' },
            { id: 2, text: 'صلاة التراويح + الوتر', cat: 'صلاة', icon: '🕌' },
            { id: 3, text: 'تلاوة جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'الاستغفار ٧٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'الصدقة على يتيم', cat: 'صدقة', icon: '💝' },
        ]
    },
    12: {
        title: 'اليوم الثاني عشر — حفظ اللسان', emoji: '🤐', color: '#a78bfa', theme: 'violet',
        desc: 'كم من كلمة أوبقت صاحبها — احفظ لسانك يحفظك الله.',
        quote: '«من صام رمضان وكفّ لسانه وفرجه كتب له ما مضى من ذنبه»', quoteSrc: 'الطبراني',
        tasks: [
            { id: 1, text: 'الصمت إلا عن الخير', cat: 'لسان', icon: '🤐' },
            { id: 2, text: 'تجنب الكلام الفارغ', cat: 'نفس', icon: '🎯' },
            { id: 3, text: 'تلاوة سورة الكهف', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'صلاة التراويح خاشعاً', cat: 'صلاة', icon: '🕌' },
            { id: 5, text: 'الذكر بدلاً من الكلام العادي', cat: 'ذكر', icon: '📿' },
        ]
    },
    13: {
        title: 'اليوم الثالث عشر — التدبر في الكون', emoji: '🌌', color: '#60a5fa', theme: 'blue',
        desc: 'التفكر في خلق الله ساعة خير من عبادة سنة.',
        quote: '«إن في خلق السماوات والأرض لآيات لأولي الألباب»', quoteSrc: 'آل عمران ١٩٠',
        tasks: [
            { id: 1, text: 'التأمل في خلق الله ١٥ دقيقة', cat: 'تفكر', icon: '🌌' },
            { id: 2, text: 'قراءة آيات الكون في القرآن', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'صلاة التراويح بتدبر', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'الحمد والشكر ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'كتابة أثر التدبر في قلبك', cat: 'نفس', icon: '✍️' },
        ]
    },
    14: {
        title: 'اليوم الرابع عشر — الصيام الكامل', emoji: '⚡', color: '#fbbf24', theme: 'amber',
        desc: 'الصيام الكامل ليس فقط عن الطعام — صُم عيناك وأذنيك ولسانك.',
        quote: '«ليس الصيام من الأكل والشرب، إنما الصيام من اللغو والرفث»', quoteSrc: 'ابن حبان',
        tasks: [
            { id: 1, text: 'غض البصر طوال اليوم', cat: 'نفس', icon: '👁️' },
            { id: 2, text: 'الإمساك عن كل محرم', cat: 'نفس', icon: '🚫' },
            { id: 3, text: 'تلاوة ربع جزء بتدبر', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'صلاة التراويح كاملة', cat: 'صلاة', icon: '🕌' },
            { id: 5, text: 'الدعاء عند الإفطار بما تريد', cat: 'دعاء', icon: '🤲' },
        ]
    },
    15: {
        title: 'اليوم الخامس عشر — منتصف الطريق', emoji: '🏁', color: '#34d399', theme: 'teal',
        desc: 'وصلت للنصف — قيّم نفسك وجدد العزم على الاستمرار.',
        quote: '«المؤمن القوي خير وأحبّ إلى الله من المؤمن الضعيف»', quoteSrc: 'مسلم',
        tasks: [
            { id: 1, text: 'تقييم نفسي في ١٥ يوماً الأولى', cat: 'نفس', icon: '📊' },
            { id: 2, text: 'تجديد العهد مع الله', cat: 'نية', icon: '💚' },
            { id: 3, text: 'صلاة التراويح بخشوع مضاعف', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'ختم نصف القرآن أو أكثر', cat: 'قرآن', icon: '📖' },
            { id: 5, text: 'الدعاء بتثبيت القلب على الطاعة', cat: 'دعاء', icon: '🤲' },
        ]
    },
    16: {
        title: 'اليوم السادس عشر — قيام الليل', emoji: '🌙', color: '#818cf8', theme: 'indigo',
        desc: 'قيام الليل كان سمة الصالحين — ولو ركعتان تحيان القلب.',
        quote: '«عليكم بقيام الليل فإنه دأب الصالحين قبلكم»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'قيام الليل ٢ ركعة على الأقل', cat: 'صلاة', icon: '🌙' },
            { id: 2, text: 'الدعاء في الثلث الأخير', cat: 'دعاء', icon: '🤲' },
            { id: 3, text: 'تلاوة سورة البقرة أو جزء منها', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'الاستغفار في السحر', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'السحور تبركاً', cat: 'سنة', icon: '🌙' },
        ]
    },
    17: {
        title: 'اليوم السابع عشر — العلم النافع', emoji: '📚', color: '#f472b6', theme: 'pink',
        desc: 'طلب العلم فريضة — ولو آية تتعلمها تنير طريقك.',
        quote: '«من يرد الله به خيراً يفقّهه في الدين»', quoteSrc: 'متفق عليه',
        tasks: [
            { id: 1, text: 'قراءة كتاب إسلامي ٣٠ دقيقة', cat: 'علم', icon: '📚' },
            { id: 2, text: 'تعلم معنى سورة تحفظها', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'صلاة التراويح بفهم ما يتلى', cat: 'صلاة', icon: '🕌' },
            { id: 4, text: 'مشاركة علم نافع مع أحد', cat: 'دعوة', icon: '💬' },
            { id: 5, text: 'الاستغفار ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
        ]
    },
    18: {
        title: 'اليوم الثامن عشر — الزهد', emoji: '🍃', color: '#4ade80', theme: 'green',
        desc: 'الزهد في الدنيا يفتح القلب لحب الآخرة.',
        quote: '«ازهد في الدنيا يحبك الله، وازهد فيما عند الناس يحبك الناس»', quoteSrc: 'ابن ماجة',
        tasks: [
            { id: 1, text: 'التصدق بشيء أحبه', cat: 'صدقة', icon: '💝' },
            { id: 2, text: 'تجنب الترف والإسراف', cat: 'نفس', icon: '🍃' },
            { id: 3, text: 'قراءة جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'صلاة التراويح كاملة', cat: 'صلاة', icon: '🕌' },
            { id: 5, text: 'التفكر في زوال الدنيا', cat: 'تفكر', icon: '🌅' },
        ]
    },
    19: {
        title: 'اليوم التاسع عشر — الرحمة بالضعفاء', emoji: '🤗', color: '#fb923c', theme: 'orange',
        desc: 'من لا يرحم لا يُرحم — ابحث عن ضعيف تسعده اليوم.',
        quote: '«الراحمون يرحمهم الرحمن، ارحموا من في الأرض يرحمكم من في السماء»', quoteSrc: 'أبو داود',
        tasks: [
            { id: 1, text: 'زيارة مريض أو عجوز', cat: 'رحمة', icon: '🤗' },
            { id: 2, text: 'الصدقة على فقير بيدك', cat: 'صدقة', icon: '💝' },
            { id: 3, text: 'مساعدة شخص محتاج', cat: 'أخلاق', icon: '🤝' },
            { id: 4, text: 'صلاة التراويح جماعة', cat: 'صلاة', icon: '🕌' },
            { id: 5, text: 'الدعاء للمسلمين المحتاجين', cat: 'دعاء', icon: '🤲' },
        ]
    },
    20: {
        title: 'اليوم العشرون — الوداع الأوسط', emoji: '🌠', color: '#67e8f9', theme: 'cyan',
        desc: 'آخر أيام الغفران قبل العشر الأواخر — أحسن الختام.',
        quote: '«لعل الله اطلع على أهل بدر فقال: اعملوا ما شئتم فقد غفرت لكم»', quoteSrc: 'متفق عليه',
        tasks: [
            { id: 1, text: 'دعاء المغفرة بخشوع', cat: 'دعاء', icon: '🤲' },
            { id: 2, text: 'إكمال جزء كبير من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'صلاة التراويح + قيام الليل', cat: 'صلاة', icon: '🌙' },
            { id: 4, text: 'الاستغفار ٢٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'التحضير للعشر الأواخر', cat: 'نية', icon: '⭐' },
        ]
    },
    21: {
        title: 'اليوم الحادي والعشرون — بداية النور ⭐', emoji: '⭐', color: '#fbbf24', theme: 'gold',
        desc: 'أول ليالي العشر الأواخر — ابدأ باستعداد روحي كامل.',
        quote: '«تحرّوا ليلة القدر في العشر الأواخر من رمضان»', quoteSrc: 'متفق عليه',
        tasks: [
            { id: 1, text: 'صلاة التراويح كاملة', cat: 'صلاة', icon: '🕌' },
            { id: 2, text: 'قيام الليل ركعتان على الأقل', cat: 'صلاة', icon: '🌙' },
            { id: 3, text: 'قراءة جزء من القرآن', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'الاستغفار ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'دعاء ليلة القدر', cat: 'دعاء', icon: '🤲' },
            { id: 6, text: 'التصدق ولو بالقليل', cat: 'صدقة', icon: '💝' },
        ]
    },
    22: {
        title: 'اليوم الثاني والعشرون — جهاد النفس', emoji: '⚔️', color: '#f87171', theme: 'red',
        desc: 'جاهد نفسك على الطاعة وابتعد عن كل ملهٍ.',
        quote: '«أفضل الجهاد أن يجاهد الرجل نفسه وهواه»', quoteSrc: 'ابن النجار',
        tasks: [
            { id: 1, text: 'الصلوات الخمس في وقتها', cat: 'صلاة', icon: '🕌' },
            { id: 2, text: 'تلاوة سورة الكهف كاملة', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'إزالة تطبيقات مشتتة ليوم واحد', cat: 'نفس', icon: '📵' },
            { id: 4, text: 'الصلاة على النبي ﷺ ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'صلة رحم — اتصال بأحد أقاربك', cat: 'صلة', icon: '📞' },
            { id: 6, text: 'دعاء الثلث الأخير', cat: 'دعاء', icon: '🤲' },
        ]
    },
    23: {
        title: 'اليوم الثالث والعشرون — ليلة الرجاء', emoji: '🌟', color: '#a78bfa', theme: 'violet',
        desc: 'الرجاء في الله ركن الدعاء — ادعُ بيقين الإجابة.',
        quote: '«ادعوا الله وأنتم موقنون بالإجابة»', quoteSrc: 'الترمذي',
        tasks: [
            { id: 1, text: 'قيام الليل ٨ ركعات', cat: 'صلاة', icon: '🌙' },
            { id: 2, text: 'ختم جزء عمّ مع التأمل', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'كتابة قائمة أدعيتي الخاصة', cat: 'دعاء', icon: '✍️' },
            { id: 4, text: 'الاستغفار في السحر ٣٠ دقيقة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'إطعام مسكين', cat: 'صدقة', icon: '🍽️' },
            { id: 6, text: 'تسبيح ١٠٠ مرة', cat: 'ذكر', icon: '✨' },
        ]
    },
    24: {
        title: 'اليوم الرابع والعشرون — يوم التجديد', emoji: '🔄', color: '#34d399', theme: 'teal',
        desc: 'جدّد نيتك وعاهد الله على الثبات على الطاعة بعد رمضان.',
        quote: '«أحبّ الأعمال إلى الله أدومها وإن قلّ»', quoteSrc: 'متفق عليه',
        tasks: [
            { id: 1, text: 'صلاة التراويح + الوتر', cat: 'صلاة', icon: '🕌' },
            { id: 2, text: 'حفظ آية جديدة', cat: 'قرآن', icon: '🧠' },
            { id: 3, text: 'كتابة عهد مع الله', cat: 'نفس', icon: '✍️' },
            { id: 4, text: 'ذكر الصباح والمساء كاملاً', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'دعاء القدر مع البكاء والخشوع', cat: 'دعاء', icon: '🤲' },
            { id: 6, text: 'زيارة الأرحام', cat: 'صلة', icon: '🏠' },
        ]
    },
    25: {
        title: 'اليوم الخامس والعشرون — ليلة السجود', emoji: '🙏', color: '#60a5fa', theme: 'blue',
        desc: 'أكثر من السجود فهو أقرب ما يكون العبد من ربه.',
        quote: '«أقرب ما يكون العبد من ربه وهو ساجد»', quoteSrc: 'مسلم',
        tasks: [
            { id: 1, text: 'سجدة شكر بعد كل صلاة', cat: 'صلاة', icon: '🙏' },
            { id: 2, text: 'صلاة الضحى ٤ ركعات', cat: 'صلاة', icon: '☀️' },
            { id: 3, text: 'تلاوة سورة يس مع التدبر', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'لا إله إلا الله ٥٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'الصدقة بشيء نفيس', cat: 'صدقة', icon: '💍' },
            { id: 6, text: 'دعاء القنوت في الوتر', cat: 'دعاء', icon: '🤲' },
        ]
    },
    26: {
        title: 'اليوم السادس والعشرون — يوم التوبة', emoji: '💧', color: '#67e8f9', theme: 'cyan',
        desc: 'اليوم أفضل وقت للتوبة الصادقة والعودة الكاملة إلى الله.',
        quote: '«إن الله يبسط يده بالليل ليتوب مسيء النهار»', quoteSrc: 'مسلم',
        tasks: [
            { id: 1, text: 'غسل التوبة والوضوء المجدد', cat: 'طهارة', icon: '💧' },
            { id: 2, text: 'مراجعة ذنوبي والتوبة منها', cat: 'نفس', icon: '💔' },
            { id: 3, text: 'قراءة سورة الفرقان', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'الاستغفار ٣٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'رد مظلمة أو الاعتذار لمن أسأت إليه', cat: 'نفس', icon: '🤝' },
            { id: 6, text: 'دعاء التوبة الكامل', cat: 'دعاء', icon: '🤲' },
        ]
    },
    27: {
        title: 'ليلة ٢٧ — أرجى ليالي القدر 🌙✨', emoji: '🌙', color: '#f59e0b', theme: 'gold',
        isQadr: true,
        desc: 'ليلة ٢٧ أرجى ليالي القدر — ليلة خير من ألف شهر. اغتنمها.',
        quote: '«لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ»', quoteSrc: 'سورة القدر ٣',
        tasks: [
            { id: 1, text: 'إحياء الليل كله بالصلاة', cat: 'صلاة', icon: '🌙' },
            { id: 2, text: 'ختم القرآن أو جزء كبير', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'دعاء ليلة القدر ١٠٠٠ مرة', cat: 'دعاء', icon: '🤲' },
            { id: 4, text: 'قراءة سورة القدر ٢١ مرة', cat: 'قرآن', icon: '⭐' },
            { id: 5, text: 'تصدق بأكبر صدقة تستطيعها', cat: 'صدقة', icon: '💝' },
            { id: 6, text: 'كتابة دعاء مفصل لك وأهلك', cat: 'دعاء', icon: '✍️' },
            { id: 7, text: 'صلاة التهجد ١٣ ركعة', cat: 'صلاة', icon: '🙏' },
        ]
    },
    28: {
        title: 'اليوم الثامن والعشرون — يوم الشكر', emoji: '🌸', color: '#f472b6', theme: 'pink',
        desc: 'اشكر الله على نعمة رمضان وأن أعاشك لأفضل عشر فيه.',
        quote: '«من لم يشكر الناس لم يشكر الله»', quoteSrc: 'أبو داود',
        tasks: [
            { id: 1, text: 'صلاة التراويح بخشوع', cat: 'صلاة', icon: '🕌' },
            { id: 2, text: 'تلاوة سورة الرحمن مع التأمل', cat: 'قرآن', icon: '📖' },
            { id: 3, text: 'كتابة ١٠ نعم أشكر الله عليها', cat: 'شكر', icon: '📝' },
            { id: 4, text: 'سبحان الله وبحمده ١٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'مساعدة أحد في المنزل', cat: 'أخلاق', icon: '🤲' },
            { id: 6, text: 'التخطيط لعادة بعد رمضان', cat: 'نفس', icon: '🎯' },
        ]
    },
    29: {
        title: 'اليوم التاسع والعشرون — ليلة الوداع', emoji: '🌅', color: '#fb923c', theme: 'orange',
        desc: 'ودّع رمضان بأحسن ما تستطيع — ربما لا يعود.',
        quote: '«اللهم بارك لنا في رجب وشعبان وبلّغنا رمضان»', quoteSrc: 'الطبراني',
        tasks: [
            { id: 1, text: 'إخراج زكاة الفطر', cat: 'زكاة', icon: '💰' },
            { id: 2, text: 'إحياء ليلة العيد بالذكر', cat: 'صلاة', icon: '🌙' },
            { id: 3, text: 'تلاوة سورة الكهف', cat: 'قرآن', icon: '📖' },
            { id: 4, text: 'الاستغفار ٢٠٠ مرة', cat: 'ذكر', icon: '📿' },
            { id: 5, text: 'كتابة رسالة شكر للعائلة', cat: 'صلة', icon: '💌' },
            { id: 6, text: 'دعاء: اللهم بلّغنا رمضان القادم', cat: 'دعاء', icon: '🤲' },
        ]
    },
    30: {
        title: 'اليوم الثلاثون — الختام والعهد 🎉', emoji: '🎉', color: '#fbbf24', theme: 'gold',
        desc: 'آخر أيام رمضان — اختم بأحسن الأعمال واستقبل العيد بقلب صافٍ.',
        quote: '«اللهم تقبّل منا إنك أنت السميع العليم»', quoteSrc: 'البقرة ١٢٧',
        tasks: [
            { id: 1, text: 'الغسل والتطيب ولبس أحسن الثياب', cat: 'طهارة', icon: '💧' },
            { id: 2, text: 'التكبير من المغرب حتى صلاة العيد', cat: 'ذكر', icon: '📿' },
            { id: 3, text: 'إخراج زكاة الفطر إن لم تُخرج', cat: 'زكاة', icon: '💰' },
            { id: 4, text: 'المسامحة وفتح صفحة جديدة', cat: 'نفس', icon: '🤝' },
            { id: 5, text: 'دعاء ختام رمضان بالقبول', cat: 'دعاء', icon: '🤲' },
            { id: 6, text: 'التعهد بعبادة واحدة بعد العيد', cat: 'نفس', icon: '🎯' },
        ]
    },
};

const CAT_COLORS = {
    صلاة: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.4)', text: '#16a34a' },
    قرآن: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.4)', text: '#2563eb' },
    ذكر: { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.4)', text: '#7c3aed' },
    دعاء: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.4)', text: '#d97706' },
    صدقة: { bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.4)', text: '#db2777' },
    نفس: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.4)', text: '#0d9488' },
    صلة: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.4)', text: '#ea580c' },
    طهارة: { bg: 'rgba(103,232,249,0.12)', border: 'rgba(103,232,249,0.4)', text: '#0891b2' },
    شكر: { bg: 'rgba(163,230,53,0.12)', border: 'rgba(163,230,53,0.4)', text: '#65a30d' },
    زكاة: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.4)', text: '#ca8a04' },
    لسان: { bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.4)', text: '#4f46e5' },
    أخلاق: { bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.4)', text: '#0e7490' },
    سنة: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.4)', text: '#15803d' },
    نية: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.4)', text: '#0f766e' },
    تفكر: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.4)', text: '#1d4ed8' },
    علم: { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.4)', text: '#6d28d9' },
    دعوة: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.4)', text: '#c2410c' },
    رحمة: { bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.4)', text: '#be185d' },
    عام: { bg: 'rgba(156,163,175,0.12)', border: 'rgba(156,163,175,0.4)', text: '#4b5563' },
};

const ALL_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

function getStorageKey(day) { return `athr_plan_day_${day}`; }
function getExtraKey(day) { return `athr_plan_extra_${day}`; }
function loadProgress(day) { return STORAGE_SERVICE.getItem(getStorageKey(day), {}); }
function saveProgress(day, m) { STORAGE_SERVICE.setItem(getStorageKey(day), m); }

// ─── Component ────────────────────────────────────────────────────────────────
const RamadanPlanner = () => {
    const RAMADAN_START = new Date('2026-02-20T00:00:00');

    const todayDay = useMemo(() => {
        const diff = new Date() - RAMADAN_START;
        const d = Math.floor(diff / 86400000) + 1;
        return Math.min(Math.max(d, 1), 30);
    }, []);

    const [selectedDay, setSelectedDay] = useState(todayDay);
    const [completed, setCompleted] = useState(() => loadProgress(todayDay));
    const [extraTasks, setExtraTasks] = useState(() =>
        STORAGE_SERVICE.getItem(getExtraKey(todayDay), [])
    );
    const [addText, setAddText] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        setCompleted(loadProgress(selectedDay));
        setExtraTasks(STORAGE_SERVICE.getItem(getExtraKey(selectedDay), []));
    }, [selectedDay]);

    // Scroll selected day into view in the strip
    useEffect(() => {
        const el = document.getElementById(`day-btn-${selectedDay}`);
        el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, [selectedDay, showCalendar]);

    const plan = FULL_PLAN[selectedDay];
    const allTasks = [...plan.tasks, ...extraTasks];
    const doneCount = allTasks.filter(t => completed[t.id]).length;
    const progress = allTasks.length > 0 ? Math.round((doneCount / allTasks.length) * 100) : 0;

    // Overall across 30 days
    const overallStats = useMemo(() => {
        let total = 0, done = 0, daysCompleted = 0;
        ALL_DAYS.forEach(d => {
            const tasks = FULL_PLAN[d].tasks;
            const extra = STORAGE_SERVICE.getItem(getExtraKey(d), []);
            const prog = loadProgress(d);
            const all = [...tasks, ...extra];
            total += all.length;
            const dayDone = all.filter(t => prog[t.id]).length;
            done += dayDone;
            if (all.length > 0 && dayDone === all.length) daysCompleted++;
        });
        return { total, done, daysCompleted, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }, [completed]);

    const toggle = (id) => {
        const updated = { ...completed, [id]: !completed[id] };
        setCompleted(updated);
        saveProgress(selectedDay, updated);
    };

    const addExtra = (e) => {
        e?.preventDefault?.();
        if (!addText.trim()) return;
        const newTask = { id: `ex_${Date.now()}`, text: addText.trim(), cat: 'عام', icon: '✅' };
        const updated = [...extraTasks, newTask];
        setExtraTasks(updated);
        STORAGE_SERVICE.setItem(getExtraKey(selectedDay), updated);
        setAddText('');
    };

    const deleteExtra = (id) => {
        const updated = extraTasks.filter(t => t.id !== id);
        setExtraTasks(updated);
        STORAGE_SERVICE.setItem(getExtraKey(selectedDay), updated);
        const { [id]: _, ...rest } = completed;
        setCompleted(rest);
        saveProgress(selectedDay, rest);
    };

    const getDayMeta = (d) => {
        const p = loadProgress(d);
        const ex = STORAGE_SERVICE.getItem(getExtraKey(d), []);
        const all = [...FULL_PLAN[d].tasks, ...ex];
        const done = all.filter(t => p[t.id]).length;
        return { pct: all.length ? Math.round((done / all.length) * 100) : 0, done, total: all.length };
    };

    const accentColor = plan.color || '#fbbf24';
    const isLastTen = selectedDay >= 21;
    const isQadr = plan.isQadr;

    return (
        <div className="pb-32 animate-in fade-in duration-500" dir="rtl"
            style={{ fontFamily: "'Noto Naskh Arabic', 'Tajawal', sans-serif" }}>

            {/* ══ HEADER ═══════════════════════════════════════════════════════════ */}
            <div className="relative px-4 pt-6 pb-4 overflow-hidden">
                {/* bg glow */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor} 0%, transparent 70%)` }} />

                <div className="relative text-center">
                    <div className="text-4xl mb-1">{plan.emoji}</div>
                    <h2 className="text-2xl font-bold text-gold-light font-scheherazade leading-tight">
                        خطة رمضان الكاملة
                    </h2>
                    <p className="text-xs opacity-60 mt-0.5" style={{ color: accentColor }}>
                        من اليوم ١ إلى ٣٠ — يوماً بيوم
                    </p>
                </div>

                {/* overall stats row */}
                <div className="relative mt-4 grid grid-cols-3 gap-2">
                    {[
                        { label: 'إجمالي التقدم', val: `${overallStats.percent}%`, icon: '📊' },
                        { label: 'أيام مكتملة', val: overallStats.daysCompleted, icon: '✅' },
                        { label: 'مهام منجزة', val: `${overallStats.done}/${overallStats.total}`, icon: '🎯' },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl p-3 text-center"
                            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                            <div className="text-lg">{s.icon}</div>
                            <div className="text-sm font-bold text-gold-light">{s.val}</div>
                            <div className="text-[9px] opacity-60 text-gold-light mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* overall progress bar */}
                <div className="relative mt-3 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${overallStats.percent}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)` }} />
                </div>
            </div>

            {/* ══ VIEW TOGGLE ══════════════════════════════════════════════════════ */}
            <div className="px-4 mb-3 flex items-center justify-between">
                <span className="text-xs opacity-60 text-gold-light">اختر اليوم</span>
                <button onClick={() => setShowCalendar(!showCalendar)}
                    className="text-xs px-3 py-1.5 rounded-full font-bold transition-all"
                    style={{
                        background: showCalendar ? accentColor : 'rgba(255,255,255,0.08)',
                        color: showCalendar ? '#1a1a1a' : 'white',
                        border: `1px solid ${showCalendar ? accentColor : 'rgba(255,255,255,0.15)'}`,
                    }}>
                    {showCalendar ? '📋 شريط' : '🗓️ تقويم'}
                </button>
            </div>

            {/* ══ DAY STRIP ════════════════════════════════════════════════════════ */}
            {!showCalendar && (
                <div ref={scrollRef} className="overflow-x-auto pb-2 no-scrollbar">
                    <div className="flex gap-2 px-4 w-max">
                        {ALL_DAYS.map(d => {
                            const meta = getDayMeta(d);
                            const isSel = d === selectedDay;
                            const isToday = d === todayDay;
                            const dPlan = FULL_PLAN[d];
                            const isPast = d < todayDay;
                            return (
                                <button key={d} id={`day-btn-${d}`} onClick={() => setSelectedDay(d)}
                                    className="flex-shrink-0 flex flex-col items-center gap-1 w-14 h-[72px] rounded-2xl transition-all duration-300"
                                    style={{
                                        background: isSel
                                            ? dPlan.color
                                            : 'rgba(255,255,255,0.06)',
                                        border: `1.5px solid ${isSel ? dPlan.color : isToday ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                        transform: isSel ? 'translateY(-3px) scale(1.05)' : 'none',
                                        boxShadow: isSel ? `0 8px 20px ${dPlan.color}50` : 'none',
                                        opacity: isPast && !isSel ? 0.6 : 1,
                                    }}>
                                    <span className="text-[8px] font-bold mt-1.5"
                                        style={{ color: isSel ? '#1a1a1a' : 'rgba(255,255,255,0.4)' }}>
                                        {isToday ? '📍' : d >= 21 ? '⭐' : ''}
                                    </span>
                                    <span className="text-base font-bold font-scheherazade"
                                        style={{ color: isSel ? '#1a1a1a' : 'white' }}>
                                        {d}
                                    </span>
                                    {/* mini ring */}
                                    <div className="relative w-5 h-5 mb-1">
                                        <svg viewBox="0 0 20 20" className="w-5 h-5 -rotate-90">
                                            <circle cx="10" cy="10" r="8" fill="none"
                                                stroke={isSel ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)'} strokeWidth="2" />
                                            <circle cx="10" cy="10" r="8" fill="none"
                                                stroke={isSel ? '#1a1a1a' : dPlan.color}
                                                strokeWidth="2"
                                                strokeDasharray={`${(meta.pct / 100) * 50.3} 50.3`}
                                                className="transition-all duration-700" />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center"
                                            style={{ fontSize: 6, fontWeight: 700, color: isSel ? '#1a1a1a' : 'rgba(255,255,255,0.6)' }}>
                                            {meta.pct}%
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ══ CALENDAR GRID ════════════════════════════════════════════════════ */}
            {showCalendar && (
                <div className="mx-4 rounded-3xl p-4 mb-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* weekday labels */}
                    <div className="grid grid-cols-7 mb-2">
                        {['ج', 'س', 'خ', 'ع', 'ث', 'ن', 'أ'].map(l => (
                            <div key={l} className="text-center text-[9px] opacity-40 text-gold-light font-bold py-1">{l}</div>
                        ))}
                    </div>
                    {/* days grid — 30 days in 5 rows */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* offset for first day if needed */}
                        {Array.from({ length: 2 }, (_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {ALL_DAYS.map(d => {
                            const meta = getDayMeta(d);
                            const isSel = d === selectedDay;
                            const isToday = d === todayDay;
                            const dPlan = FULL_PLAN[d];
                            return (
                                <button key={d} id={`day-btn-${d}`} onClick={() => { setSelectedDay(d); setShowCalendar(false); }}
                                    className="aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative"
                                    style={{
                                        background: isSel ? dPlan.color : 'rgba(255,255,255,0.05)',
                                        border: `1.5px solid ${isSel ? dPlan.color : isToday ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                        boxShadow: isSel ? `0 4px 12px ${dPlan.color}60` : 'none',
                                    }}>
                                    <span className="text-[11px] font-bold font-scheherazade"
                                        style={{ color: isSel ? '#1a1a1a' : 'white' }}>
                                        {d}
                                    </span>
                                    {meta.pct > 0 && (
                                        <div className="w-4 h-0.5 rounded-full mt-0.5"
                                            style={{ background: isSel ? 'rgba(0,0,0,0.3)' : dPlan.color, width: `${meta.pct * 0.6}%` + 8 }} />
                                    )}
                                    {d >= 21 && (
                                        <span style={{ fontSize: 6 }}>⭐</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ══ NAV ARROWS ═══════════════════════════════════════════════════════ */}
            <div className="flex items-center justify-between px-4 mb-3">
                <button onClick={() => setSelectedDay(d => Math.max(1, d - 1))}
                    disabled={selectedDay === 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all active:scale-90"
                    style={{ background: 'rgba(201,168,76,0.15)', color: '#e8c97a' }}>
                    ›
                </button>
                <span className="text-xs font-bold opacity-60 text-gold-light">
                    اليوم {selectedDay} من ٣٠
                </span>
                <button onClick={() => setSelectedDay(d => Math.min(30, d + 1))}
                    disabled={selectedDay === 30}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all active:scale-90"
                    style={{ background: 'rgba(201,168,76,0.15)', color: '#e8c97a' }}>
                    ‹
                </button>
            </div>

            {/* ══ DAY CARD ═════════════════════════════════════════════════════════ */}
            <div className="mx-4 rounded-3xl p-5 mb-4 relative overflow-hidden"
                style={{
                    background: isQadr
                        ? 'linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a1200 100%)'
                        : `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)`,
                    border: `1px solid ${accentColor}30`,
                    boxShadow: isQadr ? `0 0 40px ${accentColor}20` : 'none',
                }}>
                {/* bg glow */}
                <div className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ background: `radial-gradient(circle at 80% 20%, ${accentColor}, transparent 60%)` }} />

                {isLastTen && (
                    <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                        style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}>
                        {isQadr ? '🌙 ليلة القدر' : '⭐ العشر الأواخر'}
                    </div>
                )}

                <div className="relative">
                    <h3 className="text-lg font-bold font-scheherazade leading-tight mb-1"
                        style={{ color: accentColor }}>
                        {plan.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {plan.desc}
                    </p>

                    {/* Quote */}
                    <div className="rounded-2xl p-3 mb-3"
                        style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                        <p className="text-xs font-amiri leading-relaxed text-right"
                            style={{ color: accentColor }}>
                            {plan.quote}
                        </p>
                        <p className="text-[9px] opacity-60 mt-1 text-gold-light">{plan.quoteSrc}</p>
                    </div>

                    {/* Day progress */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)` }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: accentColor }}>
                            {doneCount}/{allTasks.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* ══ TASKS ════════════════════════════════════════════════════════════ */}
            <div className="px-4 space-y-2.5">
                {allTasks.map((task, idx) => {
                    const done = !!completed[task.id];
                    const cat = CAT_COLORS[task.cat] || CAT_COLORS['عام'];
                    const isExtra = String(task.id).startsWith('ex_');

                    return (
                        <div key={task.id}
                            className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300"
                            style={{
                                background: done ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.07)'}`,
                                opacity: done ? 0.65 : 1,
                            }}>
                            {/* Index */}
                            <span className="text-[10px] font-bold opacity-30 text-gold-light w-4 flex-shrink-0">
                                {idx + 1}
                            </span>

                            {/* Checkbox */}
                            <button onClick={() => toggle(task.id)}
                                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                                style={{
                                    background: done ? '#4ade80' : 'rgba(255,255,255,0.06)',
                                    border: `2px solid ${done ? '#4ade80' : accentColor + '50'}`,
                                    boxShadow: done ? '0 0 12px rgba(74,222,128,0.4)' : 'none',
                                }}>
                                {done && <span className="text-gold-dark text-sm font-black">✓</span>}
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{task.icon}</span>
                                    <span className="text-sm font-tajawal"
                                        style={{
                                            color: done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)',
                                            textDecoration: done ? 'line-through' : 'none',
                                        }}>
                                        {task.text}
                                    </span>
                                </div>
                                <span className="mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}>
                                    {task.cat}
                                </span>
                            </div>

                            {isExtra && (
                                <button onClick={() => deleteExtra(task.id)}
                                    className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors"
                                    style={{ color: 'rgba(248,113,113,0.5)', background: 'rgba(248,113,113,0.1)' }}>
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ══ ADD TASK ═════════════════════════════════════════════════════════ */}
            <div className="px-4 mt-4">
                <div className="flex gap-2 rounded-2xl p-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <input
                        value={addText}
                        onChange={e => setAddText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addExtra()}
                        placeholder="أضف هدفاً خاصاً لهذا اليوم..."
                        className="flex-1 bg-transparent outline-none text-sm font-tajawal text-right placeholder:opacity-25"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                    />
                    <button onClick={addExtra}
                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xl font-black transition-all active:scale-90"
                        style={{ background: accentColor, color: '#1a1a1a' }}>
                        +
                    </button>
                </div>
            </div>

            {/* ══ DAY JUMP (quick numeric) ══════════════════════════════════════════ */}
            <div className="px-4 mt-4">
                <div className="rounded-2xl p-4"
                    style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}>
                    <p className="text-[10px] opacity-50 text-gold-light text-center mb-3 font-bold">انتقل مباشرة لأي يوم</p>
                    <div className="grid grid-cols-10 gap-1">
                        {ALL_DAYS.map(d => {
                            const meta = getDayMeta(d);
                            const isSel = d === selectedDay;
                            const dPlan = FULL_PLAN[d];
                            return (
                                <button key={d} onClick={() => setSelectedDay(d)}
                                    className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-200"
                                    style={{
                                        background: isSel ? dPlan.color : meta.pct === 100 ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)',
                                        color: isSel ? '#1a1a1a' : meta.pct === 100 ? '#4ade80' : 'rgba(255,255,255,0.5)',
                                        border: `1px solid ${isSel ? dPlan.color : 'rgba(255,255,255,0.06)'}`,
                                        transform: isSel ? 'scale(1.15)' : 'none',
                                    }}>
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ══ MOTIVATIONAL FOOTER ══════════════════════════════════════════════ */}
            <div className="mx-4 mt-6 text-center py-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-amiri leading-relaxed"
                    style={{ color: accentColor }}>
                    «مَن قامَ ليلةَ القَدرِ إيماناً واحتساباً غُفِرَ له ما تقدَّمَ من ذنبه»
                </p>
                <p className="text-[10px] opacity-50 mt-1 text-gold-light font-tajawal">متفق عليه</p>
            </div>
        </div>
    );
};

export default RamadanPlanner;