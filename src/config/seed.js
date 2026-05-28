const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seedAdmin() {
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      nome: 'Administrador',
      username: 'admin',
      password: hashed
    });
    console.log('Usuário admin criado (senha: admin123)');
  }
}

module.exports = seedAdmin;
