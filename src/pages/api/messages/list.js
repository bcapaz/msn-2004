import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) return res.status(400).json([]);

  try {
    const sId = parseInt(senderId);
    const rId = parseInt(receiverId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: sId, receiverId: rId },
          { senderId: rId, receiverId: sId }
        ]
      },
      orderBy: { timestamp: 'asc' }
    });

    return res.status(200).json(messages);
  } catch (e) {
    console.error("Erro na busca de mensagens:", e);
    return res.status(500).json([]);
  }
}
