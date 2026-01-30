
import React from 'react';
import { motion } from 'framer-motion';
import { Sigma, Sparkles, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-200/50 py-4 mb-8 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Sigma className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              LaTeX Solve AI
            </h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-500" />
              Giải bài tập & Xuất code LaTeX chuyên nghiệp
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex items-center gap-2"
        >
          <span className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-bold border border-indigo-100/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Gemini 1.5 Flash
          </span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
