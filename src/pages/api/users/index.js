import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Retorna todos os usuários exceto senhas
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      display_name: true,
      subnick: true,
      status: true,
      avatar_url: true,
    }
  });
  res.status(200).json(users);
}
