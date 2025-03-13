
export const useAuth = () => {
  return {
    isAuthenticated: true,
    isLoading: false,
    user: {
      id: '1',
      email: 'demo@example.com',
      role: 'parent',
      name: 'Demo User'
    },
    signIn: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
    signOut: () => {}
  };
};
