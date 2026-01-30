
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import LatexResult from './components/LatexResult';
import { AppStatus } from './types';
import { solveProblemFromImage } from './services/geminiService';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [latexResult, setLatexResult] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<{ base64: string, mime: string } | null>(null);

  const handleFileSelect = (base64: string, mimeType: string) => {
    setCurrentImage({ base64, mime: mimeType });
    setError(null);
    setLatexResult('');
    if (status === AppStatus.SUCCESS || status === AppStatus.ERROR) {
      setStatus(AppStatus.IDLE);
    }
  };

  const handleSolve = async () => {
    if (!currentImage) return;

    setStatus(AppStatus.SOLVING);
    setError(null);

    try {
      const result = await solveProblemFromImage(currentImage.base64, currentImage.mime);
      setLatexResult(result);
      setStatus(AppStatus.SUCCESS);
      // Scroll to result after a short delay
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Upload & Action */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[2rem] p-10 shadow-2xl shadow-slate-200/50 border border-white/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bước 1: Tải ảnh</h2>
                  <p className="text-slate-500 mt-2 font-medium">Chụp hoặc chọn ảnh bài tập cần giải.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <ImageUploader
                onFileSelect={handleFileSelect}
                disabled={status === AppStatus.SOLVING}
              />

              <div className="mt-10">
                <motion.button
                  whileHover={currentImage && status !== AppStatus.SOLVING ? { scale: 1.02, y: -2 } : {}}
                  whileTap={currentImage && status !== AppStatus.SOLVING ? { scale: 0.98 } : {}}
                  onClick={handleSolve}
                  disabled={!currentImage || status === AppStatus.SOLVING}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-extrabold text-xl shadow-2xl transition-all duration-300",
                    !currentImage || status === AppStatus.SOLVING
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-200/50 active:shadow-inner"
                  )}
                >
                  {status === AppStatus.SOLVING ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Brain className="w-7 h-7" />
                      </motion.div>
                      AI Đang giải bài tập...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Giải Ngay & Xuất LaTeX
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <p className="font-bold">Có lỗi xảy ra</p>
                        <p className="text-sm mt-1 opacity-90">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Steps/Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                Tại sao chọn AI của chúng tôi?
              </h3>
              <ul className="space-y-6">
                {[
                  { title: "Công nghệ Gemini 1.5", desc: "Xử lý hình ảnh và chữ viết tay cực tốt." },
                  { title: "Chuẩn LaTeX Overleaf", desc: "Cấu hình sẵn các package toán học chuyên dụng." },
                  { title: "Lời giải chi tiết", desc: "Từng bước logic, dễ hiểu theo chuẩn sư phạm." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-indigo-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">{item.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 italic">
              <p className="text-indigo-800 text-sm leading-relaxed">
                "Công cụ này giúp tôi tiết kiệm hàng giờ đồng hồ gõ LaTeX cho các tập tài liệu ôn thi.
                Độ chính xác của các công thức phức tạp thực sự ấn tượng."
              </p>
              <p className="text-indigo-600 font-bold mt-4 text-xs">— Thầy giáo Toán học Hà Nội</p>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div id="result-section">
          {status === AppStatus.SUCCESS && latexResult && (
            <LatexResult latex={latexResult} />
          )}
        </div>
      </main>

      <footer className="mt-24 pt-12 pb-8 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8 text-slate-300">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">
            © 2024 LaTeX Solution AI Tool. Professional STEM Solutions.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-slate-600 cursor-pointer">Điều khoản</span>
            <span className="hover:text-slate-600 cursor-pointer">Bảo mật</span>
            <span className="hover:text-slate-600 cursor-pointer">Liên hệ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
