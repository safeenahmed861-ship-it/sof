import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, X, Lightbulb } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'مرحباً بك! أنا مساعد الذكاء الاصطناعي الخاص بنظام مسار للموارد البشرية. كيف يمكنني مساعدتك اليوم في صياغة التعاميم، استشارات نظام العمل، أو حساب المكافآت؟',
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'صياغة تعميم رسمي بخصوص إجازة العيد',
    'كيف يتم حساب مكافأة نهاية الخدمة لمن قضى 5 سنوات؟',
    'اكتب خطاب موافقة رسمي على طلب إجازة سنوية',
    'مقترحات لتحسين انضباط الحضور والانصراف بالشركة',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text:
          data.text ||
          'عذراً، لم أستطع معالجة الإجابة حالياً. يرجى التأكد من توفر المفتاح وصحة الاتصال.',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text:
          'حدث خطأ في الاتصال بسيرفر المساعد الذكي. يرجى إعادة المحاولة لاحقاً.',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 w-full max-w-2xl h-[600px] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>مساعد مسار الذكي للموارد البشرية</span>
                <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-extrabold">
                  Gemini AI
                </span>
              </h2>
              <p className="text-[11px] text-emerald-100">
                استشارات وصياغة فورية للقرارات واللوائح الإدارية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            اقتراحات:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-[11px] font-semibold transition shrink-0 shadow-xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[9px] ${
                    m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  } text-left font-mono`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                جاري التفكير والتوليد بالذكاء الاصطناعي...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="اسأل المساعد الذكي شيئاً أو اطلب صياغة خطاب..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition shadow-xs"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
