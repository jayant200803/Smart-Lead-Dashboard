import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { authApi } from '../api/auth';
import { useAuthStore } from '../contexts/authStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { user, token } = await authApi.login({ email, password });
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#020817]">
      {/* Animated background orbs */}
      <div className="auth-orb w-96 h-96 bg-indigo-600 top-[-10%] left-[-10%] animate-blob" />
      <div className="auth-orb w-80 h-80 bg-violet-600 bottom-[-10%] right-[-5%] animate-blob-slow animation-delay-2000" />
      <div className="auth-orb w-72 h-72 bg-cyan-500 top-[40%] right-[20%] animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-glow-indigo">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to your SmartLeads dashboard
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl p-6 shadow-glass-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign in
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-5 p-3 bg-indigo-500/[0.08] border border-indigo-500/20 rounded-lg">
            <p className="text-xs font-medium text-indigo-400 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-slate-300 font-mono">
              <p>Admin: admin@smartleads.com / Admin@123</p>
              <p>Sales: sales@smartleads.com / Sales@123</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-xs text-slate-600">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
