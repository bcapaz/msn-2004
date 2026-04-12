import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { delegacao, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username: delegacao } });

    if (user && user.password === password) {
      // Retornamos os dados para o frontend salvar no localStorage
      return res.status(200).json({ 
        id: user.id, 
        username: user.username, 
        avatar_url: user.avatar_url,
        isAdmin: user.isAdmin 
      });
    }

    return res.status(401).json({ message: 'Nome da delegação ou senha incorretos.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro na conexão com o banco.' });
  }
}
