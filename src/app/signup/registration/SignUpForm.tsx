'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import FormInput from '@/app/components/FormInput';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/app/homeComponents/NavBar';
import { Code2, Users, ChevronRight, Play } from 'lucide-react';

const SignUpForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [userExists, setUserExists] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Email duplicate check
    if (name === "email" && value !== email ) {
      setEmail(value);
      const duplicate = await fetch('/api/signup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'email': value
        }
      });
      if(duplicate.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: 'User with this email already exists'
        }));
        setUserExists(true);
      }else{
        setUserExists(false);
      }
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^0\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must start with 0 and be exactly 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Prepare payload for backend
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber
      };
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          contactNumber: ''
        });
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <NavBar />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              {/* Left side - Branding */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                    <Code2 className="w-7 h-7 text-black" />
                  </div>
                  <h1 className="text-4xl font-bold text-white">Oasis</h1>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Join the Ultimate
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Coding Challenge
                  </span>
                </h2>

                <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                  Create your account and start competing with developers worldwide in algorithmic challenges and buildathons.
                </p>

                <div className="hidden lg:block">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                      <Users className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-lg font-semibold text-white">Team Play</div>
                      <div className="text-sm text-gray-300">Collaborate & compete</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                      <Play className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-lg font-semibold text-white">Real-time</div>
                      <div className="text-sm text-gray-300">Instant feedback</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="w-full max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              Create Account
                            </h3>
                            <p className="text-gray-300 text-sm">Step 1 of 2 - Personal Information</p>
                          </div>

                          <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormInput
                                  label="First Name"
                                  name="firstName"
                                  placeholder="John"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  error={errors.firstName}
                              />
                              <FormInput
                                  label="Last Name"
                                  name="lastName"
                                  placeholder="Doe"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  error={errors.lastName}
                              />
                            </div>

                            <FormInput
                                label="Email"
                                name="email"
                                value={formData.email}
                                type="email"
                                placeholder="john@example.com"
                                onChange={handleInputChange}
                                error={errors.email}
                            />

                            <FormInput
                                label="Password"
                                name="password"
                                value={formData.password}
                                type="password"
                                placeholder="Min. 6 characters"
                                onChange={handleInputChange}
                                error={errors.password}
                            />

                            <FormInput
                                label="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                type="password"
                                placeholder="Confirm your password"
                                onChange={handleInputChange}
                                error={errors.confirmPassword}
                            />

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={userExists}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                                    !userExists
                                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                              <span>Continue</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </form>

                          <div className="mt-6">
                            <p className="text-center text-sm text-gray-300 mb-4">
                              Already have an account?{' '}
                              <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
                                Sign in
                              </Link>
                            </p>

                            <div className="flex items-center my-4">
                              <div className="flex-1 border-t border-gray-600"></div>
                              <span className="px-4 text-sm text-gray-400">or</span>
                              <div className="flex-1 border-t border-gray-600"></div>
                            </div>

                            <button
                                type="button"
                                onClick={() => signIn("google", { callbackUrl: "/" })}
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              <span>Continue with Google</span>
                            </button>
                          </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                        >
                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              Contact Details
                            </h3>
                            <p className="text-gray-300 text-sm">Step 2 of 2 - Almost done!</p>
                          </div>

                          <form className="space-y-6">
                            <FormInput
                                label="Contact Number"
                                name="contactNumber"
                                placeholder="0123456789"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                error={errors.contactNumber}
                            />

                            <div className="space-y-3">
                              <button
                                  type="button"
                                  onClick={handleSubmit}
                                  disabled={isSubmitting}
                                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                              >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                              </button>

                              <button
                                  type="button"
                                  onClick={handleBack}
                                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-all"
                              >
                                Back
                              </button>
                            </div>
                          </form>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignUpForm;