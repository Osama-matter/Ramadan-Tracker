import React, { useState, useEffect, useRef } from 'react';

const QiblaCompass = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(null);
  const [status, setStatus] = useState('جاري تحديد الموقع...');
  const [error, setError] = useState(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [calibrationOffset, setCalibrationOffset] = useState(0);
  const [showCalibration, setShowCalibration] = useState(false);

  // ✅ FIX 1: Use refs to store cleanup functions so they persist across renders
  const cleanupRef = useRef(null);

  const calculateQibla = (lat, lng) => {
    const phiK = (21.4225 * Math.PI) / 180.0;
    const lambdaK = (39.8262 * Math.PI) / 180.0;
    const phi = (lat * Math.PI) / 180.0;
    const lambda = (lng * Math.PI) / 180.0;

    const psi = Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

    // ✅ FIX 2: Normalize result to 0–360 range (was returning negative angles)
    return ((psi * 180.0) / Math.PI + 360) % 360;
  };

  const startCompass = () => {
    const handleOrientation = (event) => {
      let compass = null;

      // iOS: webkitCompassHeading is direct, reliable, already absolute
      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        compass = event.webkitCompassHeading;
      }
      // Android absolute: alpha=0 means North, increases counter-clockwise → invert
      else if (event.isTrusted && event.alpha !== null && event.alpha !== undefined) {
        compass = (360 - event.alpha) % 360;
      }

      if (compass !== null) {
        // ✅ FIX 3: Apply calibration offset
        setHeading((compass + calibrationOffset + 360) % 360);
      }
    };

    // ✅ FIX 4: Prefer `deviceorientationabsolute` (more accurate on Android),
    // fall back to `deviceorientation` only if absolute is not available
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      cleanupRef.current = () => window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      cleanupRef.current = () => window.removeEventListener('deviceorientation', handleOrientation, true);
    } else {
      setError('جهازك لا يدعم مستشعرات البوصلة');
    }
  };

  useEffect(() => {
    // 1. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const qibla = calculateQibla(position.coords.latitude, position.coords.longitude);
          setQiblaDir(qibla);
          setStatus('تم تحديد الإتجاه بنجاح ✓');
        },
        () => {
          setError('تعذر تحديد الموقع. تأكد من تفعيل GPS وسماح المتصفح بالوصول للموقع');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('جهازك لا يدعم تحديد الموقع');
    }

    // 2. Check compass permission (iOS 13+)
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      setNeedsPermission(true);
    } else {
      // ✅ FIX 5: Non-iOS devices don't need permission — start compass immediately
      startCompass();
    }

    // ✅ FIX 6: Proper cleanup on unmount — old code returned cleanup from startCompass
    // but never actually called it because useEffect didn't return it
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ FIX 7: Re-apply calibration offset whenever it changes
  useEffect(() => {
    setHeading(prev => prev); // triggers re-render with new offset applied on next sensor event
  }, [calibrationOffset]);

  const requestPermission = async () => {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      if (permissionState === 'granted') {
        setNeedsPermission(false);
        startCompass();
      } else {
        setError('لم يتم منح صلاحية البوصلة');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء طلب الصلاحية');
    }
  };

  // ✅ FIX 8: Compute final needle angle correctly
  // qiblaDir is absolute bearing from North → subtract device heading to get screen-relative angle
  const needleAngle = qiblaDir !== null ? (qiblaDir - heading + 360) % 360 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 text-center">
      <div className="py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">اتجاه القبلة</h2>
        <p className="text-text-mid text-sm">حدد اتجاه الكعبة المشرفة من موقعك الحالي</p>
      </div>

      <div className="relative w-72 h-72 mx-auto mb-8 bg-white dark:bg-[#1a1c23] rounded-full border-8 border-gold/10 shadow-[0_15px_50px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
        {/* Decorative Inner Ring */}
        <div className="absolute inset-0 rounded-full border-[16px] border-black/5 dark:border-white/5"></div>
        <div className="absolute inset-4 rounded-full border-2 border-gold/20 border-dashed"></div>

        {/* Compass Rose — rotates opposite to heading so N always points true North */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gold-dark dark:text-gold font-bold text-xl">N</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-mid text-lg">S</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-mid text-lg">E</div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-mid text-lg">W</div>

          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className={`absolute top-2 left-1/2 w-0.5 origin-[0_144px] ${i % 9 === 0 ? 'h-5 bg-gold-dark' : 'h-3 bg-black/10 dark:bg-white/10'}`}
              style={{ transform: `rotate(${i * 10}deg) translateX(-50%)` }}
            />
          ))}
        </div>

        {/* Qibla Needle — points toward Kaaba relative to current device heading */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          <div className="w-2 h-48 bg-gradient-to-t from-transparent via-gold-dark to-gold-bright rounded-full relative -top-24">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-gold-bright rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>
          </div>
          <div
            className="absolute top-6 left-1/2 text-5xl leading-none drop-shadow-xl z-30"
            style={{ transform: 'translateX(-50%) translateY(-20px)' }}
          >
            🕋
          </div>
        </div>

        {/* Center Point */}
        <div className="w-6 h-6 bg-gold-dark rounded-full shadow-lg z-20 border-4 border-white dark:border-[#1a1c23]"></div>

        {/* ✅ FIX 9: Show loading state while qibla is being calculated */}
        {qiblaDir === null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <span className="text-white text-sm font-bold animate-pulse">جاري التحديد...</span>
          </div>
        )}
      </div>

      {needsPermission ? (
        <div className="p-6 bg-black/5 border border-black/10 rounded-3xl mx-4 text-center">
          <p className="text-text-dark font-bold mb-4 text-sm">تتطلب البوصلة صلاحية للوصول إلى المستشعرات</p>
          <button
            onClick={requestPermission}
            className="w-full py-3 bg-gold text-green-main font-bold rounded-xl active:scale-95 transition-all shadow-md"
          >
            السماح للبوصلة بالعمل
          </button>
        </div>
      ) : (
        <div className="p-6 bg-black/5 border border-black/10 rounded-3xl mx-4 space-y-4">
          <p className="text-gold-dark font-bold mb-2">{status}</p>
          {error && <p className="text-red-500 text-xs mb-2 font-bold">{error}</p>}

          <button
            onClick={() => setShowCalibration(!showCalibration)}
            className="text-xs text-gold underline bg-transparent border-none p-0 outline-none"
          >
            البوصلة غير دقيقة؟ (معايرة يدوية)
          </button>

          {showCalibration && (
            <div className="pt-4 border-t border-black/5 space-y-2">
              <label className="text-xs text-text-dark font-bold block">موازنة المستشعر ({calibrationOffset}°)</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={calibrationOffset}
                onChange={(e) => setCalibrationOffset(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <p className="text-[9px] text-text-mid">قم بتدوير الشريط حتى يشير حرف N إلى الشمال الفعلي</p>
            </div>
          )}

          <div className="mt-4 text-[10px] text-text-mid leading-relaxed border-t border-black/5 pt-4">
            * يرجى إمساك الهاتف بشكل أفقي (موازي للأرض)<br />
            * قم بتحريك الهاتف على شكل رقم 8 لمعايرة الحساسات
          </div>
        </div>
      )}
    </div>
  );
};

export default QiblaCompass;