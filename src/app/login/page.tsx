'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff, Code2, Mail, Lock } from 'lucide-react';
import NavBar from '@/app/homeComponents/NavBar';

type Errors = {
  email?: string;
  password?: string;
  credentials?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      const newErrors: Errors = {};
      console.log(formData);

      const handleSignIn = async (data: { email: string, password: string }) => {
        const signInData = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInData?.status === 401) {
          console.log("Error is : ", signInData)
          newErrors.credentials = 'Your credentials do not seem to match with ours! Check again?';
          setErrors(newErrors);
        } else {
          const session = await fetch('/api/auth/session').then(res => res.json());
          const userRole = session?.user?.role;

          if (userRole === 'ADMIN') {
            router.push('/admin');
          } else if (userRole === 'COMPETITOR') {
            router.push('/competitor');
          } else if (userRole === 'PARENT') {
            router.push('/parent');
          } else {
            router.push('/');
          }

          setFormData({
            email: '',
            password: ''
          });
        }
      };
      const signInData_ = await handleSignIn(formData);

    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Navigation */}
        <NavBar />

        {/* Login Form Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="max-w-md w-full">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-black" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-300 text-lg">
                Sign in to continue your coding journey
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
              {/* Credentials Error */}
              {errors.credentials && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm">{errors.credentials}</p>
                  </div>
              )}

              <form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.email && (
                      <p className="mt-2 text-sm text-red-300">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                      <p className="mt-2 text-sm text-red-300">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                        type="checkbox"
                        className="h-4 w-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Remember me for 30 days</span>
                  </label>
                  <a href="#" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                        Logging in...
                      </div>
                  ) : (
                      'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-400">or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center">
                <button className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 transition-all">
                  <Image src="/Images/google.svg" alt="Google" width={24} height={24} />
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don&#39;t have an account?{' '}
                  <a href="/signup/registration/" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                    Sign up now
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}