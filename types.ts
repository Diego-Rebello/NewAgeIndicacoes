
export enum MacroCategory {
  RENOVATION_REPAIR = 'Reformas e Reparos',
  CLEANING_HYGIENE = 'Limpeza e Higiene',
  WOODWORK_FURNITURE = 'Marcenaria e Móveis',
  TECH_ASSISTANCE = 'Assistência Técnica',
  HEALTH_WELLNESS = 'Saúde e Bem-Estar',
  AUTOMOTIVE = 'Serviços Automotivos',
  FOOD_EVENTS = 'Alimentação e Festas',
  PROFESSIONAL_SERVICES = 'Serviços Profissionais',
  BEAUTY_ESTHETICS = 'Beleza e Estética',
  OTHER = 'Outros'
}

export enum ReviewType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  type: ReviewType;
  comment: string;
  createdAt: number;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  category: MacroCategory;
  tags: string[];
  description: string;
  createdAt: number;
  reviews: Review[];
  creatorId: string;
}

export interface User {
  id: string;
  name: string;
  apt: string;
  role: 'USER' | 'ADMIN';
}

export interface CategoryInfo {
  id: MacroCategory;
  label: string;
  iconName: string; 
  color: string;
}

export interface AIAnalysisResult {
  category: MacroCategory;
  suggestedTags: string[];
}
