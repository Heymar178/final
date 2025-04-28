// app/index.tsx
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null; // or splash/loading screen
  }

  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/Login" />;
}
