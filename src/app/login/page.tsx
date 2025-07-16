'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff, Code2 } from 'lucide-react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
          } else if (userRole === 'SERVICE') {
            router.push('/vanowner');
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
      setErrors({ credentials: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <NavBar />

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-black" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-300">Sign in to your CodeChallenge account</p>
            </div>

            {/* Error Message */}
            {errors.credentials && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {errors.credentials}
                </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm pr-12"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                      type="checkbox"
                      className="w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <span>Remember me for 30 days</span>
                </label>
                <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Signing in...
                    </div>
                ) : (
                    'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <hr className="flex-grow border-white/20" />
              <span className="px-4 text-sm text-gray-400">or continue with</span>
              <hr className="flex-grow border-white/20" />
            </div>

            {/* Social Login */}
            <div className="flex justify-center">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg p-3 transition-all hover:scale-105">
                <Image src="/Images/google.svg" alt="Google" width={24} height={24} />
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-gray-400">
                Don&#39;t have an account?{' '}
                <a href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}