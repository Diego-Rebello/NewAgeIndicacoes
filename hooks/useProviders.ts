
import { useState, useMemo } from 'react';
import { Provider, MacroCategory, User, Review, ReviewType } from '../types';
import { INITIAL_PROVIDERS } from '../constants';

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MacroCategory | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const filteredProviders = useMemo(() => {
    return providers
      .filter((p) => {
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        const matchesSearch = !searchTerm || [
          p.name,
          ...p.tags,
          p.category,
          p.description
        ].some(text => text.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.reviews.length - a.reviews.length);
  }, [providers, searchTerm, selectedCategory]);

  const addProvider = (newProvider: Provider) => {
    setProviders(prev => [newProvider, ...prev]);
  };

  const addReview = (providerId: string, review: Review) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, reviews: [review, ...p.reviews] } : p
    ));
  };

  const deleteProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  const deleteReview = (providerId: string, reviewId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, reviews: p.reviews.filter(r => r.id !== reviewId) } : p
    ));
  };

  return {
    providers: filteredProviders,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentUser,
    setCurrentUser,
    addProvider,
    addReview,
    deleteProvider,
    deleteReview
  };
};
