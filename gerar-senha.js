const bcrypt = require('bcrypt');

const senha = 'gestor123';
const saltRounds = 10;

bcrypt.hash(senha, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('Hash gerado:', hash);
});