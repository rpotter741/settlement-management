export default function isAdmin(userRoles: string[] | undefined): boolean {
  if (!userRoles) return false;
  return userRoles.includes('admin');
}
