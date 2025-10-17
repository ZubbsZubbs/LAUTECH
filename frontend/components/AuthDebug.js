"use client";

import { useSelector } from 'react-redux';

export default function AuthDebug() {
  const { user, token, isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>loading: {loading ? 'true' : 'false'}</div>
      <div>token: {token ? 'exists' : 'null'}</div>
      <div>user: {user ? user.email : 'null'}</div>
      <div>localStorage token: {localStorage.getItem('authToken') ? 'exists' : 'null'}</div>
      <div>localStorage userData: {localStorage.getItem('userData') ? 'exists' : 'null'}</div>
    </div>
  );
}
