import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate('/shop');
    } catch (error) {
      // Error is already handled in AuthContext, we don't need to show another toast here
      // The AuthContext will show the specific error message from the API
    }
  };

  const socialLogins = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-500 hover:text-white',
      onClick: () => console.log('Login with Facebook'),
    },
    {
      name: 'Google',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M21.35 11.1h-9.36v2.96h5.44c-.23 1.26-1.42 3.7-5.44 3.7-3.28 0-5.95-2.7-5.95-6.03s2.67-6.03 5.95-6.03c1.87 0 3.12.8 3.84 1.49l2.62-2.53C17.2 3.38 15.1 2.5 12 2.5 6.96 2.5 2.92 6.54 2.92 11.58s4.04 9.08 9.08 9.08c5.24 0 8.7-3.68 8.7-8.88 0-.6-.07-1.04-.17-1.49z" />
        </svg>
      ),
      color: 'hover:bg-red-500 hover:text-white',
      onClick: () => console.log('Login with Google'),
    },
    {
      name: 'Apple',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M16.365 1.43c0 1.14-.48 2.24-1.26 3.06-.84.84-2.1 1.5-3.27 1.5-.12-1.08.36-2.22 1.2-3.06.84-.84 2.04-1.5 3.24-1.5.03 0 .06 0 .09 0zm3.72 16.14c-.69 1.47-1.53 2.94-2.76 2.97-1.2.03-1.59-.78-3-1.59-1.38-.78-2.4-.78-3.78 0-1.44.81-1.8 1.59-3 .63-1.23-.96-2.13-2.43-2.82-3.9-1.53-3.12-.78-6.96 1.23-8.94.87-.9 2.1-1.56 3.36-1.56 1.26 0 2.43.84 3.78.81 1.32-.03 2.13-.81 3.72-.81 1.29 0 2.64.69 3.54 1.86-3.12 1.83-2.64 6.33.72 7.53z" />
        </svg>
      ),
      color: 'hover:bg-black hover:text-white',
      onClick: () => console.log('Login with Apple'),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-2xl shadow-large border border-border p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold font-heading">Phoenix</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-4 py-3"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-12 py-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                }
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full hero-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-3">
            {socialLogins.map((social) => {
              const Icon = social.icon;
              return (
                <motion.button
                  key={social.name}
                  type="button"
                  onClick={social.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center p-3 rounded-xl border border-border text-muted-foreground transition-all duration-300 ${social.color}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              );
            })}
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
