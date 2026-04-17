import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // Busca TODOS os usuários, sem filtros complexos por enquanto, para garantir que apareçam
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        display_name: true,
        avatar_url: true,
        subnick: true,
        isAdmin: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("ERRO NA API DE LISTA:", error);
    return res.status(500).json([]); // Retorna array vazio em caso de erro para não travar o front
  }
}
