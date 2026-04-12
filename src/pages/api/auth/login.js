import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.password === password) { // Em produção, use bcrypt!
    return res.status(200).json({ 
      id: user.id, 
      username: user.username, 
      isAdmin: user.isAdmin,
      display_name: user.display_name 
    });
  }

  res.status(401).json({ message: 'Credenciais inválidas' });
}
