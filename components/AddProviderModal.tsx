
import React, { useState } from 'react';
import { X, Loader2, Sparkles, Check, ArrowRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { MacroCategory, Provider } from '../types';
import { analyzeProviderService } from '../services/geminiService';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (provider: Provider) => void;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [step, setStep] = useState<'input' | 'review'>('input');
  const [suggestedCategory, setSuggestedCategory] = useState<MacroCategory>(MacroCategory.OTHER);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const validatePhone = (value: string): boolean => {
    const cleanPhone = value.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setPhoneError('Telefone deve ter 10 ou 11 dígitos (com DDD)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) validatePhone(value);
  };

  if (!isOpen) return null;

  const handleNext = async () => {
    if (!name || !phone || !description) return;
    if (!validatePhone(phone)) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeProviderService(name, description);
      if (suggestedCategory === MacroCategory.OTHER) {
        setSuggestedCategory(result.category);
      }
      setSuggestedTags(result.suggestedTags);
      setStep('review');
    } catch (error) {
      // AI analysis failed - continue to review step
      setStep('review');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    const newProvider: Provider = {
      id: crypto.randomUUID(),
      name,
      phone,
      description,
      category: suggestedCategory,
      tags: suggestedTags,
      reviews: [],
      creatorId: 'current-user',
      createdAt: Date.now()
    };

    onAdd(newProvider);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setPhoneError('');
    setDescription('');
    setStep('input');
    setSuggestedTags([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto my-4 sm:hidden shrink-0" />

        <div className="flex justify-between items-center px-8 py-4 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            {step === 'review' && (
              <button onClick={() => setStep('input')} className="p-2 -ml-3 text-slate-400"><ChevronLeft /></button>
            )}
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Indicar
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 bg-slate-50 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8 overflow-y-auto">
          {step === 'input' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Quem você indica?</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800"
                  placeholder="Ex: João Eletricista"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Telefone (com DDD)</label>
                <input
                  type="tel"
                  className={`w-full px-5 py-4 bg-slate-50 border-2 ${phoneError ? 'border-rose-500 bg-rose-50' : 'border-transparent'} focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800`}
                  placeholder="(11) 98888-0000"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
                {phoneError && <p className="text-rose-500 text-xs font-bold mt-2 px-1">{phoneError}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Macro Categoria</label>
                <div className="relative">
                  <select
                    value={suggestedCategory}
                    onChange={(e) => setSuggestedCategory(e.target.value as MacroCategory)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none"
                  >
                    {Object.values(MacroCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">O que ele(a) faz?</label>
                <textarea
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none h-32 resize-none transition-all font-medium text-slate-700"
                  placeholder="Relate sua experiência ou serviços prestados..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex items-center gap-2 mt-4 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl w-fit border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase">IA NewAge Ativa</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!name || !phone || !description || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 mt-4 shadow-xl shadow-blue-100 active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ANALISANDO...
                  </>
                ) : (
                  <>
                    CONTINUAR
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Classificação Sugerida</h3>

                <div className="mb-6">
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-2">Macro Categoria</label>
                  <p className="px-4 py-3 bg-slate-100 rounded-2xl text-sm font-bold text-slate-700 border border-slate-200">{suggestedCategory}</p>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-2">Palavras-chave</label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag, i) => (
                      <span key={i} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-700 flex items-center shadow-sm">
                        #{tag.toUpperCase()}
                        <button
                          onClick={() => setSuggestedTags(prev => prev.filter((_, idx) => idx !== i))}
                          className="ml-2 text-slate-300 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => {
                        const newTag = prompt("Nova tag:");
                        if (newTag) setSuggestedTags([...suggestedTags, newTag.toLowerCase()]);
                      }}
                      className="text-[10px] font-black text-blue-600 px-3 py-1.5 border border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-emerald-100 uppercase text-sm active:scale-95"
              >
                <Check className="w-5 h-5 mr-2" />
                CONCLUIR INDICAÇÃO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProviderModal;
