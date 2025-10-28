'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { signupUser, clearError } from '@/store/slices/authSlice';
import Link from 'next/link';
import styled from 'styled-components';
import { PageContainer, Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Title, Text, ErrorText, FormRow } from '@/styles/GlobalStyles';

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  margin: 20px;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  margin: 0 auto 16px;
`;

const InputContainer = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const StyledInput = styled(Input)`
  padding-left: 40px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  
  &:hover {
    color: #6b7280;
  }
`;

interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();

  const password = watch('password');

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: SignupForm) => {
    dispatch(signupUser({
      username: data.username,
      email: data.email,
      password: data.password,
    }));
  };

  return (
    <PageContainer>
      <SignupContainer>
        <SignupCard>
          <CardBody>
            <LogoContainer>
              <LogoIcon>SL</LogoIcon>
              <Title style={{ fontSize: '24px', marginBottom: '8px' }}>Create your account</Title>
              <Text>
                Or{' '}
                <Link href="/login" style={{ color: '#3b82f6', fontWeight: '500' }}>
                  sign in to your existing account
                </Link>
              </Text>
            </LogoContainer>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label>Username</Label>
                <InputContainer>
                  <InputIcon>👤</InputIcon>
                  <StyledInput
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters',
                      },
                    })}
                    type="text"
                    placeholder="Enter your username"
                  />
                </InputContainer>
                {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Email address</Label>
                <InputContainer>
                  <InputIcon>@</InputIcon>
                  <StyledInput
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    placeholder="Enter your email"
                  />
                </InputContainer>
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <InputContainer>
                  <InputIcon>🔒</InputIcon>
                  <StyledInput
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </PasswordToggle>
                </InputContainer>
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Confirm Password</Label>
                <InputContainer>
                  <InputIcon>🔒</InputIcon>
                  <StyledInput
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </PasswordToggle>
                </InputContainer>
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
              </FormGroup>

              {error && <ErrorText style={{ marginBottom: '16px' }}>{error}</ErrorText>}

              <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </Form>
          </CardBody>
        </SignupCard>
      </SignupContainer>
    </PageContainer>
  );
}