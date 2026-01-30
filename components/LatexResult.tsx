
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileCode, Download, ExternalLink, Info } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-latex';
import 'prismjs/themes/prism-tomorrow.css';
import { cn } from '../lib/utils';

interface LatexResultProps {
  latex: string;
}

const LatexResult: React.FC<LatexResultProps> = ({ latex }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  useEffect(() => {
    Prism.highlightAll();
  }, [latex, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTexFile = () => {
    const element = document.createElement("a");
    const file = new Blob([latex], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "solution.tex";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-12"
    >
      <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-200 overflow-hidden">
        {/* Header Tabs */}
        <div className="bg-slate-900 px-6 pt-4 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('code')}
              className={cn(
                "pb-3 px-2 text-sm font-bold transition-all border-b-2",
                activeTab === 'code' ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                MÃ LATEX
              </div>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={cn(
                "pb-3 px-2 text-sm font-bold transition-all border-b-2",
                activeTab === 'guide' ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                HƯỚNG DẪN XUẤT
              </div>
            </button>
          </div>

          <div className="flex gap-2 pb-3">
            <button
              onClick={downloadTexFile}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Tải về file .tex"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                copied ? "bg-green-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Đã sao chép
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Sao chép mã
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          {activeTab === 'code' ? (
            <div className="max-h-[600px] overflow-auto bg-slate-900 custom-scrollbar">
              <pre className="m-0 p-6 !bg-transparent">
                <code className="language-latex text-sm leading-relaxed">
                  {latex}
                </code>
              </pre>
            </div>
          ) : (
            <div className="p-8 bg-slate-50 min-h-[400px]">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-indigo-500" />
                Làm thế nào để sử dụng mã này?
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-bold text-slate-700">Truy cập Overleaf</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Mở trình soạn thảo <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">Overleaf</a> và đăng nhập.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-bold text-slate-700">Tạo mới project</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Tạo một Blank Project mới và xóa hết nội dung mặc định trong file main.tex.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-bold text-slate-700">Dán mã & Biên dịch</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Dán toàn bộ mã bạn vừa copy vào và nhấn "Recompile" để xem kết quả PDF chuẩn đẹp.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Lưu ý:</strong> Mã LaTeX này đã bao gồm đầy đủ các packages cần thiết (amsmath, amssymb, etc.).
                  Nếu bạn dùng trình soạn thảo offline, hãy đảm bảo đã cài đặt TeX Live hoặc MiKTeX bản mới nhất.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Generated with precision for professional educational documents.
          </p>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100 uppercase tracking-tight">UT8-Support</span>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md uppercase tracking-tight">Vn-Fonts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LatexResult;
