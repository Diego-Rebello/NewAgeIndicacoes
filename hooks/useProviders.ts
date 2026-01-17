
import { useState, useMemo, useEffect } from 'react';
import { Provider, MacroCategory, User, Review } from '../types';
import { supabase } from '../services/supabase';

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MacroCategory | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select(`
          *,
          reviews (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database fields to our type if necessary (snake_case to camelCase)
      // Since we kept most fields the same, just need to ensure created_at is handled if date format differs
      const formattedProviders: Provider[] = (data || []).map(p => ({
        ...p,
        createdAt: new Date(p.created_at).getTime(),
        reviews: (p.reviews || []).map((r: any) => ({
          ...r,
          userId: r.user_id,
          userName: r.user_name,
          createdAt: new Date(r.created_at).getTime()
        })).sort((a: any, b: any) => b.createdAt - a.createdAt)
      }));

      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();

    // Optional: Realtime subscription
    const subscription = supabase
      .channel('public:providers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, () => {
        fetchProviders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        fetchProviders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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

  const addProvider = async (newProvider: Provider) => {
    try {
      const { error } = await supabase.from('providers').insert({
        name: newProvider.name,
        phone: newProvider.phone,
        category: newProvider.category,
        tags: newProvider.tags,
        description: newProvider.description,
        creator_id: currentUser?.id
      });

      if (error) throw error;
      // Realtime will update the list
    } catch (error) {
      console.error('Error adding provider:', error);
      alert('Erro ao adicionar indicação.');
    }
  };

  const addReview = async (providerId: string, review: Review) => {
    try {
      const { error } = await supabase.from('reviews').insert({
        provider_id: providerId,
        user_id: currentUser?.id,
        user_name: currentUser?.name || 'Anônimo',
        type: review.type,
        comment: review.comment
      });

      if (error) throw error;
      // Realtime will update the list
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Erro ao adicionar avaliação.');
    }
  };

  const deleteProvider = async (id: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('providers').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting provider:', error);
      alert('Erro ao excluir indicação.');
    }
  };

  const deleteReview = async (providerId: string, reviewId: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Erro ao excluir avaliação.');
    }
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
    deleteReview,
    loading
  };
};

