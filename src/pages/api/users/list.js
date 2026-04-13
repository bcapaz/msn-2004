import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { senderId, receiverId } = req.query;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(senderId), receiverId: parseInt(receiverId) },
          { senderId: parseInt(receiverId), receiverId: parseInt(senderId) }
        ]
      },
      orderBy: { timestamp: 'asc' },
      include: { sender: true } // ESSENCIAL PARA O NOME APARECER
    });
    res.status(200).json(messages);
  } catch (e) {
    res.status(500).json([]);
  }
}
