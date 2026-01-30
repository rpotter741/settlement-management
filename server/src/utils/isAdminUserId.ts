import prisma from '../db/db.ts';

export default async function isAdminUserId(userId: string): Promise<boolean> {
  const adminUsernames = ['admin', 'superuser', 'root', 'robbiepottsdm'];
  return adminUsernames.includes(userId);

  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { isAdmin: true },
  // });
  // return user?.isAdmin || false;
}

//lmao needs a lot of work to be better. Just need user model and then we can use prisma to check if user is admin or not
