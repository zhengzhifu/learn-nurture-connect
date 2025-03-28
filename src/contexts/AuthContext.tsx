
import React, { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create and export the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Re-export from types for backward compatibility
export type { UserRole, Profile } from '@/types/auth';
