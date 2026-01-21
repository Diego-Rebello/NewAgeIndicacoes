
import React from 'react';
import { UserPlus, Plus, Sparkles } from 'lucide-react';

interface InviteToIndicateCardProps {
    onClick: () => void;
}

const InviteToIndicateCard: React.FC<InviteToIndicateCardProps> = ({ onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-[2rem] shadow-sm border-2 border-dashed border-blue-200 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer flex flex-col h-full relative group active:scale-[0.98]"
        >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-blue-300 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-5 h-5" />
            </div>

            <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
                {/* Icon */}
                <div className="bg-blue-100 p-5 rounded-[2rem] mb-5 group-hover:bg-blue-200 group-hover:scale-110 transition-all shadow-inner">
                    <UserPlus className="w-10 h-10 text-blue-600" />
                </div>

                {/* Content */}
                <h3 className="font-black text-xl text-slate-900 leading-tight mb-2">
                    Indique um Profissional!
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 max-w-[200px]">
                    Conhece alguém que presta um bom serviço? Compartilhe com o condomínio!
                </p>

                {/* CTA Button */}
                <button className="flex items-center justify-center gap-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 group-hover:shadow-xl group-hover:shadow-blue-300 active:scale-95">
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    <span>Fazer Indicação</span>
                </button>
            </div>

            {/* Bottom accent */}
            <div className="h-2 bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default InviteToIndicateCard;
