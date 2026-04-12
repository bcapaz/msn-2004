import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { delegacao, password, avatarUrl } = req.body;

  try {
    // Usamos o nome da delegação para criar um e-mail único interno
    const safeName = delegacao.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    const user = await prisma.user.create({
      data: {
        username: delegacao,
        password: password,
        email: `${safeName}-${Math.floor(Math.random() * 1000)}@msn.com`,
        avatar_url: avatarUrl,
        display_name: delegacao
      }
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error("ERRO NO REGISTRO:", error);
    return res.status(400).json({ message: 'Erro: Nome já existe ou banco fora do ar.' });
  }
}
