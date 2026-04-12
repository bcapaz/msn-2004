import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { adminId, userA, userB } = req.query;

  // Verificação básica de segurança
  const admin = await prisma.user.findUnique({ where: { id: parseInt(adminId) } });
  if (!admin || !admin.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado. Apenas diretores.' });
  }

  // Se userA e userB não forem passados, retorna um resumo de quem está falando com quem
  if (!userA || !userB) {
    const recentConvos = await prisma.message.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: { sender: true, receiver: true }
    });
    return res.status(200).json(recentConvos);
  }

  // Se os IDs forem passados, traz a conversa específica para o diretor ler
  const conversation = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: parseInt(userA), receiverId: parseInt(userB) },
        { senderId: parseInt(userB), receiverId: parseInt(userA) },
      ],
    },
    orderBy: { timestamp: 'asc' },
  });

  res.status(200).json(conversation);
}
