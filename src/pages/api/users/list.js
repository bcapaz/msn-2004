import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const { senderId, receiverId } = req.query;

  // Garantimos que os IDs são números inteiros
  const sId = parseInt(senderId);
  const rId = parseInt(receiverId);

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: sId, receiverId: rId },
          { senderId: rId, receiverId: sId },
        ],
      },
      orderBy: { timestamp: 'asc' },
      include: {
        sender: { select: { username: true, display_name: true } }
      }
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Erro na API de mensagens:", error);
    return res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
}
