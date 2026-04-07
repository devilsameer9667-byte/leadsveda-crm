import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, Headphones, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      console.log('Logged in user role:', user.role);

      if (user.role === 'manager') {
        navigate('/manager');
      } else if (user.role === 'agent') {
        navigate('/dashboard');
      } else {
        console.error('Unexpected user role on login:', user.role);
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();
    if (!trimmedEmail || !trimmedPass) {
      setError('Please enter both Email and Password.');
      return;
    }
    setSubmitting(true);
    const result = await login(trimmedEmail, trimmedPass);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="card-surface p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              SmartCall CRM
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Secure Login for Authorized Users
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full h-11 text-sm"
                placeholder="you@company.com"
                autoFocus
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full h-11 text-sm"
                placeholder="••••••••"
                maxLength={50}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-destructive text-sm bg-destructive/5 rounded-lg px-3 py-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground font-semibold px-4 h-11 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          SmartCall CRM • Lead Management & Order System
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
