
import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Trash2, ChevronDown, ChevronUp, User as UserIcon } from 'lucide-react';
import { Provider, ReviewType, User } from '../types';
import { formatWhatsAppLink } from '../utils/formatters';

interface ProviderCardProps {
  provider: Provider;
  currentUser: User | null;
  onAddReview: (providerId: string) => void;
  onDeleteProvider: (providerId: string) => void;
  onDeleteReview: (providerId: string, reviewId: string) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  currentUser, 
  onAddReview, 
  onDeleteProvider,
  onDeleteReview 
}) => {
  const [showReviews, setShowReviews] = useState(false);
  const isAdmin = currentUser?.role === 'ADMIN';

  const stats = React.useMemo(() => {
    const pos = provider.reviews.filter(r => r.type === ReviewType.POSITIVE).length;
    const neg = provider.reviews.length - pos;
    const rate = provider.reviews.length > 0 ? Math.round((pos / provider.reviews.length) * 100) : 0;
    return { pos, neg, rate, total: provider.reviews.length };
  }, [provider.reviews]);

  const whatsappUrl = formatWhatsAppLink(
    provider.phone, 
    "Olá, recebi sua recomendação no Condominio Clube New Age"
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative group/card">
      {isAdmin && (
        <button 
          onClick={() => onDeleteProvider(provider.id)}
          className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition-colors z-10 sm:opacity-0 group-hover/card:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="p-6 flex-grow">
        <header className="mb-3">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[9px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{provider.category}</span>
          </div>
          <h3 className="font-black text-xl text-slate-900 leading-tight">{provider.name}</h3>
        </header>
        
        <p className="text-sm text-slate-500 mb-4 line-clamp-3 font-medium leading-relaxed">{provider.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {provider.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">#{tag.toUpperCase()}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
           <div className="text-center min-w-[60px]">
             <div className={`text-2xl font-black ${stats.rate >= 70 ? 'text-emerald-600' : stats.rate >= 40 ? 'text-amber-500' : 'text-slate-300'}`}>
               {stats.total > 0 ? `${stats.rate}%` : '--'}
             </div>
             <div className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Confiança</div>
           </div>
           <div className="h-10 w-px bg-slate-200"></div>
           <div className="flex gap-5">
             <div className="flex flex-col items-center text-emerald-600">
               <ThumbsUp className="w-5 h-5 mb-0.5" />
               <span className="text-xs font-black">{stats.pos}</span>
             </div>
             <div className="flex flex-col items-center text-rose-500">
               <ThumbsDown className="w-5 h-5 mb-0.5" />
               <span className="text-xs font-black">{stats.neg}</span>
             </div>
           </div>
        </div>
      </div>

      <footer className="px-6 pb-6 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 flex items-center justify-center text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 p-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 mr-2" /> Contato
          </a>
          <button 
            onClick={() => onAddReview(provider.id)} 
            className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 active:scale-95 transition-all border border-blue-100"
            title="Avaliar"
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={() => setShowReviews(!showReviews)}
          className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
        >
          {showReviews ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showReviews ? 'Ocultar' : `${stats.total} Relatos`}
        </button>

        {showReviews && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1">
            {provider.reviews.length === 0 ? (
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase py-2">Sem relatos ainda.</p>
            ) : (
              provider.reviews.map(review => (
                <div key={review.id} className="bg-slate-50 p-4 rounded-[1.5rem] relative group/review border border-slate-100">
                  {isAdmin && (
                    <button onClick={() => onDeleteReview(provider.id, review.id)} className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-rose-500 sm:opacity-0 group-hover/review:opacity-100">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-700 flex items-center bg-white px-2 py-0.5 rounded-full shadow-sm">
                      <UserIcon className="w-2.5 h-2.5 mr-1" /> {review.userName}
                    </span>
                    {review.type === ReviewType.POSITIVE ? <ThumbsUp className="w-3 h-3 text-emerald-500" /> : <ThumbsDown className="w-3 h-3 text-rose-500" />}
                  </div>
                  <p className="text-xs text-slate-600 font-medium italic">"{review.comment}"</p>
                </div>
              ))
            )}
          </div>
        )}
      </footer>
    </div>
  );
};

export default ProviderCard;
