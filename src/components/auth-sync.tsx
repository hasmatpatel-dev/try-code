'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store';
import { setSession, clearSession } from '@/features/authSlice';
import { supabase } from '@/lib/supabase/client';

export default function AuthSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const userMetadata = data.session.user.user_metadata || {};
          dispatch(
            setSession({
              session: data.session,
              user: {
                id: data.session.user.id,
                email: data.session.user.email!,
                name: userMetadata.name || data.session.user.email!.split('@')[0],
                avatarUrl: userMetadata.avatarUrl || userMetadata.avatar_url || userMetadata.picture || null,
                role: userMetadata.role || 'Student',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            })
          );
        } else {
          dispatch(clearSession());
        }
      } catch (err) {
        console.error('Auth synchronization error:', err);
      }
    };

    syncSession();

    // Listen for auth state changes (e.g. login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const userMetadata = session.user.user_metadata || {};
        dispatch(
          setSession({
            session,
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: userMetadata.name || session.user.email!.split('@')[0],
              avatarUrl: userMetadata.avatarUrl || userMetadata.avatar_url || userMetadata.picture || null,
              role: userMetadata.role || 'Student',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          })
        );
      } else {
        dispatch(clearSession());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}
