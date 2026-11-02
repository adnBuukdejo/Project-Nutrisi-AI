import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircleQuestion,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';
import { FoodAnalysisResult } from '../types';

interface Message {
  id: string;
  sender: 'nutribot' | 'user';
  text: string;
  timestamp: string;
}

interface AskNutriBotChatProps {
  currentFoodContext?: FoodAnalysisResult | null;
}

export const AskNutriBotChat: React.FC<AskNutriBotChatProps> = ({
  currentFoodContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'nutribot',
      text: 'Halo Sobat Sehat! Aku NutriBot, detektif nutrisi dan sahabat tumbuh kembangmu. Ada yang ingin kamu tanyakan tentang makanan sehat, rahasia tambah tinggi, atau energi buat belajar di sekolah? Tanya apa saja ya! 🚀🍎',
      timestamp: 'Baru saja',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    '🥦 Makanan apa yang bikin badan cepat tinggi?',
    '🥚 Berapa banyak protein yang kubutuhkan setiap hari?',
    '🍫 Camilan apa yang sehat sebelum ujian sekolah?',
    '💧 Kenapa kita harus minum minimal 8 gelas air?',
    '🍕 Kalau makan pizza, bagaimana cara menyeimbangkannya?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-nutribot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          currentFoodContext: currentFoodContext
            ? {
                foodName: currentFoodContext.foodName,
                calories: currentFoodContext.calories,
                protein: currentFoodContext.protein,
                carbs: currentFoodContext.carbs,
                fat: currentFoodContext.fat,
              }
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menerima jawaban dari NutriBot');
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'nutribot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'nutribot',
        text: 'Waduh, koneksi detektif agak terputus sebentar. Boleh tanyakan lagi atau coba tanyakan hal lain ya!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (isPlayingAudioId === msgId) {
      stopSpeaking();
      setIsPlayingAudioId(null);
      return;
    }

    setIsPlayingAudioId(msgId);
    speakText(text, () => {
      setIsPlayingAudioId(null);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden flex flex-col h-[650px]">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">
            🤖
          </div>
          <div>
            <h3 className="font-extrabold text-base font-['Fredoka',sans-serif]">
              Tanya Detektif NutriBot
            </h3>
            <p className="text-xs text-emerald-100">
              {currentFoodContext
                ? `Sedang membahas: ${currentFoodContext.foodName}`
                : 'Teman tanya-jawab gizi & tumbuh kembang anak SMP'}
            </p>
          </div>
        </div>

        <span className="text-xs bg-white/20 text-white font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
          Online ⚡
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isBot = msg.sender === 'nutribot';
          const isPlaying = isPlayingAudioId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-base shrink-0 mt-1">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs relative ${
                  isBot
                    ? 'bg-white text-slate-800 border border-amber-200/80 rounded-tl-xs'
                    : 'bg-emerald-600 text-white rounded-tr-xs'
                }`}
              >
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isBot ? 'text-slate-400' : 'text-emerald-200'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isBot && (
                    <button
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className="ml-2 p-1 hover:text-emerald-600 transition-colors"
                      title="Dengarkan suara NutriBot"
                    >
                      {isPlaying ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs">
                  Kamu
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-base animate-spin">
              🤖
            </div>
            <div className="bg-white border border-amber-200 rounded-2xl p-3 shadow-2xs text-xs font-bold text-slate-500 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>NutriBot sedang meracik jawaban seru...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Question Pills */}
      <div className="p-2 sm:px-4 bg-white border-t border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center space-x-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Saran:</span>
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-950 px-2.5 py-1 rounded-full whitespace-nowrap border border-amber-200 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Tanyakan apa saja seputar makanan & tumbuh kembangmu..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center space-x-1.5 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
};
