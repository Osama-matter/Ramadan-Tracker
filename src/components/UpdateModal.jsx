import React, { useEffect, useState } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const CURRENT_VERSION = 'v2.0';

const UpdateModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Note: To re-trigger this for testing, delete 'athr_last_version_seen' from localStorage
        const lastVersion = STORAGE_SERVICE.getItem('athr_last_version_seen', null);

        if (lastVersion !== CURRENT_VERSION) {
            // Clear problematic cache to avoid conflicts
            STORAGE_SERVICE.removeItem('athr_prayer_times');
            STORAGE_SERVICE.removeItem('athr_last_prayer_fetch');
            // If we have other significant data structures changed, remove them here.

            setIsOpen(true);
        }
    }, []);

    const handleGotIt = () => {
        STORAGE_SERVICE.setItem('athr_last_version_seen', CURRENT_VERSION);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
            <div className="relative w-full max-w-lg bg-surface dark:bg-[#1a1c23] rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-right overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />

                <div className="flex justify-between items-center mb-8 relative z-10 border-b border-black/5 dark:border-white/5 pb-4">
                    <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full text-gold-dark text-xl hover:bg-black/10 transition-colors">✕</button>
                </div>

                {/* Header Image Area */}
                <div className="h-40 bg-gradient-to-br from-green-main to-[#3d8b68] relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('/Imge/Dad.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                    <img src="/Imge/Dad.png" alt="الوالد رحمه الله" className="w-24 h-24 object-cover rounded-full border-4 border-white/20 shadow-lg relative z-10" />
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold font-scheherazade text-gold-dark dark:text-gold">تحديث جديد لتطبيق أثر! 🎉</h2>
                        <p className="text-xs text-text-mid dark:text-gray-400">الإصدار {CURRENT_VERSION}</p>
                    </div>

                    <div className="text-sm text-text-dark dark:text-gray-200 leading-relaxed max-h-48 overflow-y-auto w-full text-right px-2 space-y-3">
                        <p><strong>أهلاً بك في التحديث الجديد لتطبيق "أثر"!</strong> لقد قمنا بمسح البيانات المؤقتة لضمان عمل التحديثات بكفاءة واختصار الميزات المتضاربة القديمة.</p>
                        <ul className="list-disc list-inside bg-black/5 dark:bg-white/5 p-3 rounded-xl">
                            <li><strong>المصحف الشريف:</strong> تم إعادة تصميمه بالكامل ليطابق شكل المصحف الورقي بدقة بملء الشاشة.</li>
                            <li><strong>تنبيهات تعمل في الخلفية:</strong> إشعارات دقيقة للأذان والصلاة على النبي ﷺ.</li>
                            <li><strong>المظهر الداكن (Dark Mode):</strong> مريح للعين في الليل.</li>
                            <li><strong>القبلة المحدثة:</strong> حل مشاكل البوصلة في بعض الأجهزة.</li>
                        </ul>
                        <p className="text-xs text-green-main dark:text-green-light mt-4">اللهم اجعل هذا العمل خالصاً لوجهك الكريم، واجعله صدقة جارية عن والدي وعنا جميعاً.</p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleGotIt}
                        className="w-full mt-4 bg-gold hover:bg-gold-dark text-green-main font-bold py-3 rounded-xl transition-colors active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                        دعنا نبدأ 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
