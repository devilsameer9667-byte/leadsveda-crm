import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js/dist/common.js';

export interface AppUser {
  id: string;
  agentId: string;
  name: string;
  email: string;
  role: 'agent' | 'manager';
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUserId: string, email?: string) => {
    try {
      const profileFields = 'id, agent_id, name, email, monthly_target';

      const { data: directProfile, error: directProfileError } = await supabase
        .from('profiles')
        .select(profileFields)
        .eq('id', authUserId)
        .maybeSingle();

      if (directProfileError) {
        console.error('Profile fetch by id error:', directProfileError.message);
      }

      let profile = directProfile;

      if (!profile) {
        const { data: legacyProfile, error: legacyProfileError } = await supabase
          .from('profiles')
          .select(profileFields)
          .eq('user_id', authUserId)
          .maybeSingle();

        if (legacyProfileError && !legacyProfileError.message.toLowerCase().includes('user_id')) {
          console.error('Legacy profile fetch error:', legacyProfileError.message);
        }

        profile = legacyProfile;
      }

      if (!profile) {
        console.error('No profile found for user:', authUserId);
        setUser(null);
        return;
      }

      // Fetch role from user_roles table
      let role: 'agent' | 'manager' = 'agent';
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUserId)
        .single();

      if (roleError || !roleData) {
        console.warn('Role not found, defaulting to agent');
      } else {
        role = roleData.role as 'agent' | 'manager';
      }

      console.log('Final role:', role);

      setUser({
        id: profile.id || authUserId,
        agentId: profile.agent_id || '',
        name: profile.name || email || '',
        email: profile.email || email || '',
        role,
      });
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    // Restore session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for subsequent auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email).finally(() => setLoading(false));
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
