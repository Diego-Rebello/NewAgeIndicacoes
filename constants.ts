
import { MacroCategory, Provider, CategoryInfo, ReviewType } from './types';

export const CATEGORIES: CategoryInfo[] = [
  { id: MacroCategory.RENOVATION_REPAIR, label: 'Reformas/Reparos', iconName: 'Hammer', color: 'bg-orange-100 text-orange-700' },
  { id: MacroCategory.CLEANING_HYGIENE, label: 'Limpeza/Higiene', iconName: 'Sparkles', color: 'bg-teal-100 text-teal-700' },
  { id: MacroCategory.WOODWORK_FURNITURE, label: 'Marcenaria/Móveis', iconName: 'Sofa', color: 'bg-amber-100 text-amber-700' },
  { id: MacroCategory.TECH_ASSISTANCE, label: 'Assist. Técnica', iconName: 'Wrench', color: 'bg-blue-100 text-blue-700' },
  { id: MacroCategory.HEALTH_WELLNESS, label: 'Saúde/Bem-Estar', iconName: 'HeartPulse', color: 'bg-red-100 text-red-700' },
  { id: MacroCategory.AUTOMOTIVE, label: 'Automotivos', iconName: 'Car', color: 'bg-slate-200 text-slate-700' },
  { id: MacroCategory.FOOD_EVENTS, label: 'Alimentos/Festas', iconName: 'PartyPopper', color: 'bg-yellow-100 text-yellow-700' },
  { id: MacroCategory.PROFESSIONAL_SERVICES, label: 'Serv. Profissionais', iconName: 'Briefcase', color: 'bg-indigo-100 text-indigo-700' },
  { id: MacroCategory.BEAUTY_ESTHETICS, label: 'Beleza/Estética', iconName: 'Scissors', color: 'bg-pink-100 text-pink-700' },
  { id: MacroCategory.OTHER, label: 'Outros', iconName: 'MoreHorizontal', color: 'bg-gray-100 text-gray-700' },
];


