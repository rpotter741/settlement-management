import store from '@/app/store.ts';

export default function verifyUserAdmin() {
  // Placeholder implementation; replace with actual auth logic
  const user = store.getState().user;
  return user.role === 'admin';
}
