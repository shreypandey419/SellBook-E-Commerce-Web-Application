import { useState, useEffect } from 'react';
import userApi from './userApi';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await userApi.login({ email, password });
    setUser(data);
  };

  const register = async (name, email, password) => {
    const data = await userApi.register({ name, email, password });
    setUser(data);
  };

  const loginWithGoogle = async () => {
    const data = await userApi.loginWithGoogle();
    setUser(data);
  };

  const logout = () => {
    userApi.logout();
    setUser(null);
  };

  return { user, login, register, loginWithGoogle, logout, loading };
};

export default useAuth;
