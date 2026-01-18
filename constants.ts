
import { MacroCategory, Provider, CategoryInfo, ReviewType } from './types';

export const CATEGORIES: CategoryInfo[] = [
  { id: MacroCategory.HOME_REPAIRS, label: 'Casa e Reparos', iconName: 'Hammer', color: 'bg-orange-100 text-orange-700' },
  { id: MacroCategory.CLEANING, label: 'Limpeza', iconName: 'Sparkles', color: 'bg-teal-100 text-teal-700' },
  { id: MacroCategory.VEHICLES, label: 'Veículos', iconName: 'Car', color: 'bg-slate-200 text-slate-700' },
  { id: MacroCategory.BEAUTY_HEALTH, label: 'Beleza e Saúde', iconName: 'HeartPulse', color: 'bg-pink-100 text-pink-700' },
  { id: MacroCategory.FOOD, label: 'Alimentação', iconName: 'UtensilsCrossed', color: 'bg-yellow-100 text-yellow-700' },
  { id: MacroCategory.PROFESSIONALS, label: 'Profissionais', iconName: 'Briefcase', color: 'bg-indigo-100 text-indigo-700' },
  { id: MacroCategory.OTHER, label: 'Outros', iconName: 'MoreHorizontal', color: 'bg-gray-100 text-gray-700' },
];


