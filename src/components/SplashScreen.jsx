import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Show splash for 2.5 seconds, then fade out
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Wait for the fade-out transition to complete before unmounting
            setTimeout(onFinish, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-cream dark:bg-[#03050f] transition-opacity duration-500 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="relative flex flex-col items-center animate-in fade-in zoom-in-75 duration-1000">

                {/* App Logo / Icon */}
                <div className="w-28 h-28 rounded-[2.5rem] shadow-[0_15px_40px_rgba(212,175,55,0.3)] flex items-center justify-center mb-8 rotate-3 transition-transform overflow-hidden border-4 border-gold/30">
                    <img src="/Imge/Atherlogo.jpeg" alt="شعار أثر" className="w-full h-full object-cover -rotate-3" />
                </div>

                {/* App Typography */}
                <h1 className="text-5xl font-bold text-gold-dark dark:text-gold font-scheherazade mb-3 drop-shadow-sm">
                    أثــر
                </h1>
                <p className="text-lg text-text-mid dark:text-gray-400 font-tajawal tracking-wider opacity-90">
                    رَفِيقُكَ الإِيمَانِي
                </p>

                {/* Loading Indicator (Bouncing Dots) */}
                <div className="absolute -bottom-20 flex justify-center space-x-2 space-x-reverse opacity-80">
                    <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
                    <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
                    <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce"></div>
                </div>

            </div>
        </div>
    );
};

export default SplashScreen;
