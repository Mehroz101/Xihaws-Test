'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { loadUserFromStorage } from '@/store/slices/authSlice';

export const useAuthInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
};
