import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { senderId, receiverId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        content: content
      }
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
}
