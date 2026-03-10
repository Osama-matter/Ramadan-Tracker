import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#03050f] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gold mb-4 font-scheherazade">عذراً، حدث خطأ غير متوقع</h1>
          <p className="text-white/60 mb-8 font-tajawal text-sm leading-relaxed">
            واجه التطبيق مشكلة تقنية. يرجى محاولة إعادة التشغيل أو التواصل مع الدعم إذا استمرت المشكلة.
          </p>
          <div className="bg-black/20 p-4 rounded-xl text-left w-full max-w-md overflow-auto mb-8">
            <code className="text-red-400 text-xs break-all">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gold text-green-main rounded-xl font-bold active:scale-95 transition-all"
          >
            إعادة تحميل التطبيق
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
