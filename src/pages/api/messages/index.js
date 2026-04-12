import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { senderId, receiverId, content } = req.body;

  if (req.method === 'POST') {
    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
      },
    });
    return res.status(201).json(newMessage);
  }

  if (req.method === 'GET') {
    const { sId, rId } = req.query;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(sId), receiverId: parseInt(rId) },
          { senderId: parseInt(rId), receiverId: parseInt(sId) },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });
    return res.status(200).json(messages);
  }
}
