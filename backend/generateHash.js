// Generador de hash para contraseñas
const bcrypt = require('bcryptjs');

async function generarHashes() {
  const passwords = ['admin123', 'vendedor123', 'supervisor123'];

  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${password}: ${hash}`);
  }
}

generarHashes();