import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { delegacao, password, avatarUrl } = req.body;

  try {
    // Verifica se já existe
    const exists = await prisma.user.findUnique({ where: { username: delegacao } });
    if (exists) return res.status(400).json({ message: 'Essa delegação já está registrada.' });

    const newUser = await prisma.user.create({
      data: {
        username: delegacao,
        display_name: delegacao,
        email: `${delegacao.replace(/\s+/g, '').toLowerCase()}@modelo.com`, // Email fake obrigatório pelo schema
        password: password,
        avatar_url: avatarUrl || '/images/avatar-blue.png',
        isAdmin: false
      }
    });

    return res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao salvar no banco de dados.' });
  }
}
