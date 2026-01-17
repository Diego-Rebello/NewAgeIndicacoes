
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

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    phone: '11999991234',
    category: MacroCategory.RENOVATION_REPAIR,
    tags: ['eletricista', 'chuveiro', 'tomada'],
    description: 'Eletricista residencial com 10 anos de experiência.',
    createdAt: Date.now(),
    creatorId: 'admin-1',
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Ricardo Ap 12', type: ReviewType.POSITIVE, comment: 'Muito atencioso e resolveu rápido.', createdAt: Date.now() },
      { id: 'r2', userId: 'u2', userName: 'Julia Ap 44', type: ReviewType.POSITIVE, comment: 'Preço justo.', createdAt: Date.now() }
    ]
  },
  {
    id: '2',
    name: 'Diarista Maria',
    phone: '11988885678',
    category: MacroCategory.CLEANING_HYGIENE,
    tags: ['faxina', 'limpeza de vidros'],
    description: 'Especialista em limpeza pesada.',
    createdAt: Date.now() - 100000,
    creatorId: 'admin-1',
    reviews: [
      { id: 'r3', userId: 'u3', userName: 'Marcos Ap 101', type: ReviewType.POSITIVE, comment: 'Deixou tudo brilhando.', createdAt: Date.now() }
    ]
  }
];
