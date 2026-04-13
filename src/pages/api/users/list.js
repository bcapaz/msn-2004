import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // Busca usuários que NÃO são admins
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false
      },
      select: {
        id: true,
        username: true,
        display_name: true,
        avatar_url: true,
        subnick: true,
        status: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ message: 'Erro ao buscar delegados.' });
  }
}
