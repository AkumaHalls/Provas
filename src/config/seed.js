const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Settings = require('../models/Settings');

async function seedAdmin() {
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      nome: 'Administrador',
      username: 'admin',
      password: hashed,
      role: 'admin'
    });
    console.log('Usuário admin criado (senha: admin123)');
  }

  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({ allowRegistration: true });
    console.log('Configurações padrão criadas');
  }
}

module.exports = seedAdmin;
