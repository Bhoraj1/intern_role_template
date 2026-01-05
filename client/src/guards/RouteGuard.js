'use client';
import { useSelector } from 'react-redux';
import LoginPage from '../components/LoginPage';

export default function RouteGuard({ children }) {
  const { isAuth } = useSelector(state => state.user);

  if (!isAuth) {
    return <LoginPage />;
  }

  return children;
}