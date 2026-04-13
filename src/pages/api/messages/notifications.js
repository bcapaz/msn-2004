import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).end();

  try {
    // Busca mensagens não lidas para o usuário logado
    const messages = await prisma.message.findMany({
      where: {
        receiverId: parseInt(userId),
        isRead: false // Precisamos dessa coluna no banco se quiser persistência real
      }
    });

    // Agrupa por quem enviou
    const counts = messages.reduce((acc, msg) => {
      acc[msg.senderId] = (acc[msg.senderId] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({});
  }
}
