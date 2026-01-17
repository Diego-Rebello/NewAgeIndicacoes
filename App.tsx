
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from './constants';
import { MacroCategory, ReviewType, Review } from './types';
import ProviderCard from './components/ProviderCard';
import AddProviderModal from './components/AddProviderModal';
import { useProviders } from './hooks/useProviders';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon className={className} />;
};

function App() {
  const {
    providers, searchTerm, setSearchTerm,
    selectedCategory, setSelectedCategory,
    currentUser, setCurrentUser,
    addProvider, addReview, deleteProvider, deleteReview
  } = useProviders();

  const [modals, setModals] = useState({
    login: false,
    addProvider: false,
    review: false,
    search: false
  });
  const [activeProviderId, setActiveProviderId] = useState<string | null>(null);

  const requireAuth = (action: () => void) => {
    if (!currentUser) setModals(m => ({ ...m, login: true }));
    else action();
  };

  const handleAddReviewClick = (id: string) => {
    setActiveProviderId(id);
    requireAuth(() => setModals(m => ({ ...m, review: true })));
  };

  const handleReviewSubmit = (type: ReviewType, comment: string) => {
    if (!currentUser || !activeProviderId) return;
    const review: Review = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      type,
      comment,
      createdAt: Date.now()
    };
    addReview(activeProviderId, review);
    setModals(m => ({ ...m, review: false }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 sm:pb-0">
      {/* Header - Desktop & Mobile */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>
            <div className="bg-blue-600 p-1.5 rounded-xl shadow-md">
              <Icons.ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight">NewAge Condo</span>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-2xl bg-slate-100/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Busque serviços..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{currentUser.role}</span>
                </div>
                <button onClick={() => setCurrentUser(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Icons.LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <button onClick={() => setModals(m => ({ ...m, login: true }))} className="text-sm font-black text-blue-600 hidden sm:block px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">Entrar</button>
            )}
            <button onClick={() => requireAuth(() => setModals(m => ({ ...m, addProvider: true })))} className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-slate-200 hidden sm:flex active:scale-95 transition-all">
              <Icons.Plus className="w-4 h-4" /> <span>Indicar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-6 w-full">
        {/* Search Bar - Otimizada para Mobile */}
        <div className="sm:hidden mb-8">
           <div className="relative">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-5 border-2 border-white rounded-3xl bg-white shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                placeholder="O que você procura?"
              />
            </div>
        </div>

        {!searchTerm && (
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6 px-1">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Categorias</h2>
               {selectedCategory && (
                 <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 animate-pulse">
                   Limpar Filtro
                 </button>
               )}
            </div>
            
            {/* Grid 5x2 Mobile / 10x1 Desktop - Sem rolagem, ícones gigantes e legíveis */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 sm:gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`w-full aspect-square rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center border-2 transition-all active:scale-90 touch-manipulation ${selectedCategory === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 z-10' : 'bg-white border-white shadow-sm hover:shadow-md active:bg-slate-50'}`}
                >
                  <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-3xl mb-1.5 sm:mb-3 ${selectedCategory === cat.id ? 'bg-white/20' : cat.color} shadow-sm transition-transform`}>
                    <IconRenderer name={cat.iconName} className="w-7 h-7 sm:w-8 h-8" />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase text-center px-1 leading-none tracking-tighter line-clamp-2 ${selectedCategory === cat.id ? 'text-white' : 'text-slate-600'}`}>
                    {cat.label.includes('/') ? cat.label.split('/')[0] : cat.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            {selectedCategory || (searchTerm ? 'Resultados' : 'Mais Recomentados')} 
            <span className="ml-3 text-xs bg-slate-900 text-white px-3 py-1 rounded-full font-black shadow-sm">{providers.length}</span>
          </h2>
          {currentUser?.role === 'ADMIN' && <div className="text-[10px] bg-rose-500 text-white font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-rose-100"><Icons.ShieldAlert className="w-3 h-3" /> ADMIN</div>}
        </div>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(p => (
              <ProviderCard 
                key={p.id} provider={p} currentUser={currentUser} 
                onAddReview={handleAddReviewClick}
                onDeleteProvider={deleteProvider}
                onDeleteReview={deleteReview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center mx-1 shadow-inner">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <Icons.SearchX className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Ops! Nada encontrado</h3>
            <p className="text-slate-500 font-medium max-w-[240px] mx-auto leading-relaxed">Não encontramos prestadores para essa busca específica.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory(null); }} className="mt-8 text-blue-600 font-black uppercase text-xs tracking-widest border-2 border-blue-50 px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-sm">Ver tudo</button>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Mobile Only) - Acesso Rápido */}
      <nav className="sm:hidden fixed bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-lg px-10 h-20 flex items-center justify-between z-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        <button 
          onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
          className={`flex flex-col items-center gap-1.5 transition-all ${!selectedCategory && !searchTerm ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
        >
          <Icons.LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Início</span>
        </button>
        
        <button 
          onClick={() => requireAuth(() => setModals(m => ({ ...m, addProvider: true })))}
          className="bg-blue-600 text-white p-5 rounded-3xl -translate-y-8 shadow-2xl shadow-blue-500/50 active:scale-90 transition-all border-[6px] border-slate-50 sm:border-transparent"
        >
          <Icons.Plus className="w-8 h-8" strokeWidth={3} />
        </button>

        <button 
          onClick={() => requireAuth(() => setModals(m => ({ ...m, login: false })))} 
          className={`flex flex-col items-center gap-1.5 transition-all ${currentUser ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
        >
          <Icons.UserCircle className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{currentUser ? 'Perfil' : 'Login'}</span>
        </button>
      </nav>

      {/* Modals de Login e Avaliação permanecem otimizados */}
      {modals.login && <LoginModal onClose={() => setModals(m => ({ ...m, login: false }))} onLogin={(role) => {
        setCurrentUser({ id: 'u' + Date.now(), name: role === 'ADMIN' ? 'Síndico' : 'Morador', apt: '101', role });
        setModals(m => ({ ...m, login: false }));
      }} />}

      {modals.review && <ReviewModal onClose={() => setModals(m => ({ ...m, review: false }))} onSubmit={handleReviewSubmit} />}

      <AddProviderModal 
        isOpen={modals.addProvider} 
        onClose={() => setModals(m => ({ ...m, addProvider: false }))} 
        onAdd={(p) => { addProvider({ ...p, creatorId: currentUser?.id || 'sys' }); setModals(m => ({ ...m, addProvider: false })); }} 
      />
    </div>
  );
}

const LoginModal = ({ onClose, onLogin }: { onClose: () => void, onLogin: (role: 'USER' | 'ADMIN') => void }) => (
  <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
    <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] p-10 w-full max-w-sm text-center shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
      <div className="bg-blue-50 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-6 shadow-sm">
        <Icons.User className="w-10 h-10 text-blue-600" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Bem-vindo!</h2>
      <p className="text-slate-500 mb-10 font-medium text-lg leading-snug">Acesse as recomendações do condomínio.</p>
      <div className="space-y-4">
        <button onClick={() => onLogin('USER')} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-200 text-lg">Sou Morador</button>
        <button onClick={() => onLogin('ADMIN')} className="w-full bg-slate-50 text-slate-900 font-black py-5 rounded-[2rem] border-2 border-slate-100 hover:bg-slate-100 active:scale-95 transition-all text-lg">Acesso Síndico</button>
        <button onClick={onClose} className="text-sm font-black text-slate-400 mt-8 py-2 uppercase tracking-widest">Fechar</button>
      </div>
    </div>
  </div>
);

const ReviewModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (t: ReviewType, c: string) => void }) => {
  const [type, setType] = useState(ReviewType.POSITIVE);
  const [comment, setComment] = useState('');
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[95vh] overflow-y-auto">
        <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Avaliar</h2>
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"><Icons.X className="w-6 h-6" /></button>
        </div>
        <div className="flex gap-4 mb-8">
          <button onClick={() => setType(ReviewType.POSITIVE)} className={`flex-1 p-6 rounded-[2.5rem] border-4 flex flex-col items-center gap-3 transition-all ${type === ReviewType.POSITIVE ? 'border-emerald-500 bg-emerald-50 text-emerald-700 scale-105 shadow-lg' : 'border-slate-50 text-slate-300'}`}>
            <Icons.ThumbsUp className="w-10 h-10" />
            <span className="font-black text-[11px] uppercase tracking-widest">Recomendo</span>
          </button>
          <button onClick={() => setType(ReviewType.NEGATIVE)} className={`flex-1 p-6 rounded-[2.5rem] border-4 flex flex-col items-center gap-3 transition-all ${type === ReviewType.NEGATIVE ? 'border-rose-500 bg-rose-50 text-rose-700 scale-105 shadow-lg' : 'border-slate-50 text-slate-300'}`}>
            <Icons.ThumbsDown className="w-10 h-10" />
            <span className="font-black text-[11px] uppercase tracking-widest">Evitar</span>
          </button>
        </div>
        <textarea 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          className="w-full h-40 p-6 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none resize-none font-medium text-slate-700 text-lg shadow-inner transition-all mb-8" 
          placeholder="Como foi sua experiência?" 
        />
        <button 
          disabled={!comment.trim()} 
          onClick={() => onSubmit(type, comment)} 
          className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] disabled:opacity-50 active:scale-95 transition-all shadow-2xl text-lg uppercase tracking-widest"
        >
          Enviar Avaliação
        </button>
      </div>
    </div>
  );
};

export default App;
