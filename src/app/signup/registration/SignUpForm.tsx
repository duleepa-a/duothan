'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import FormInput from '@/app/components/FormInput';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
      <>
      <div className="flex w-3/4  bg-primary h-4/5 justify-between rounded-br-2xl rounded-tr-2xl rounded-2xl">
        {/* Left side - Yellow background with logo */}
        <div className="hidden lg:block overflow-hidden justify-items-center pl-20 pt-4">
          <h1 className='mt-10 m-0'>Oasis</h1>
        </div>
        {/* Right side - Form */}
        <div className="w-full lg:w-2/3 flex items-center justify-center h-min">
          <div className="w-full ">
            <div className="bg-white rounded-2xl shadow-xl pt-14 pl-14 pr-7 pb-7 ">
            <AnimatePresence mode="wait">
      {currentStep === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <div className='flex justify-start'>
                  <h2 className="text-lg font-semibold text-active-text text-center mb-2.5">
                      Create Account
                  </h2>
              </div>
              <form  className="ml-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                      <FormInput
                          label="First Name"
                          name="firstName"
                          placeholder="Type your first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          error={errors.firstName}
                      />
                  </div>
                  <div>
                      <FormInput
                          label="Last Name"
                          name="lastName"
                          placeholder='Type your last name'
                          value={formData.lastName}
                          onChange={handleInputChange}
                          error={errors.lastName}
                      />
                  </div>
                </div>
                <div>
                  <FormInput
                          label="Email"
                          name="email"
                          value={formData.email}
                          type="email"
                          placeholder='Type your email address'
                          onChange={handleInputChange}
                          error={errors.email}
                  />
                </div>
                <div>
                  <FormInput
                          label="Password"
                          name="password"
                          value={formData.password}
                          type="password"
                          placeholder='Type your password'
                          onChange={handleInputChange}
                          error={errors.password}
                  />
                </div>
                <div>
                  <FormInput
                          label="Confirm Password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          type="password"
                          placeholder='Retype your password'
                          onChange={handleInputChange}
                          error={errors.confirmPassword}
                  />
                </div>
                <div className='w-full flex justify-center'>
                  <button
                    type="button"
                    onClick={handleNext} disabled={userExists}
                    className={!userExists?"w-max bg-black hover:bg-active-text text-white font-semibold px-18 py-2.5 rounded-xs transition-colors duration-200  cursor-pointer text-sm":"w-max bg-gray-600  text-gray-400 font-semibold px-18 py-2.5 rounded-xs  duration-200  cursor-pointer text-sm"}
                  >
                    Proceed
                  </button>
                </div>
              </form>
              <p className="text-center text-sm text-gray-600 mt-5">
                Already have an account?{' '}
                <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">
                  Login
                </Link>
              </p>
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              <div className="flex space-y-3">
                <button
                  type="button"
                  onClick={() => signIn("google",{ callbackUrl: "/" })}                
                  className="submit-bttn"
                >
                  <span className="text-gray-700 font-medium text-sm">Sign up with Google</span>
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
          <div className='flex justify-start'>
                  <h2 className="text-lg font-semibold text-active-text text-center mb-2.5">
                  Contact Details
                  </h2>
                </div>
                <form className="ml-1">
                  <div>
                  <FormInput
                    label="Contact Number"
                    name="contactNumber"
                    placeholder="Type your contact number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    error={errors.contactNumber}
                  />
                  </div>
                  <div className="flex flex-col items-center mt-4 space-y-2">
                    <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-max bg-black hover:bg-active-text text-white font-semibold px-18 py-2.5 rounded-xs transition-colors duration-200  cursor-pointer text-sm"
                    >
                    {isSubmitting ? 'Submitting...' : 'Sign Up'}
                    </button>
                    <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-xs transition-colors duration-200 text-sm"
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
  </>
    )
}

export default SignUpForm