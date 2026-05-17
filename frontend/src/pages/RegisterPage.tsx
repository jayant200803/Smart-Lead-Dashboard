import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';
import { authApi } from '../api/auth';
import { useAuthStore } from '../contexts/authStore';
import { UserRole } from '../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SALES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim() || name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { user, token } = await authApi.register({ name, email, password, role });
      setAuth(user, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const axiosErr = error as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#020817]">
      {/* Animated background orbs */}
      <div className="auth-orb w-96 h-96 bg-violet-600 top-[-15%] right-[-10%] animate-blob" />
      <div className="auth-orb w-80 h-80 bg-indigo-600 bottom-[-10%] left-[-5%] animate-blob-slow animation-delay-2000" />
      <div className="auth-orb w-64 h-64 bg-pink-600 top-[50%] left-[30%] animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-glow-violet">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-sm text-slate-400 mt-1">
            Get started with SmartLeads
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl p-6 shadow-glass-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError('name'); }}
              error={errors.name}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: UserRole.SALES, label: 'Sales User' },
                { value: UserRole.ADMIN, label: 'Admin' },
              ]}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Create account
            </Button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-xs text-slate-600">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
