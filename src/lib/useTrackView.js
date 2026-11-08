import { useEffect } from 'react';
import { supabase } from './supabase';

export default function useTrackView(id) {
  useEffect(() => {
    if (id) supabase.rpc('track_product_view', { p_product: String(id) }).then(() => {});
  }, [id]);
}
