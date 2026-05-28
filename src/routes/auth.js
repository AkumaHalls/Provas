const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { erro: 'Usuário não encontrado' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { erro: 'Senha incorreta' });
    }
    req.session.userId = user._id;
    req.session.userName = user.nome;
    res.redirect('/');
  } catch (err) {
    res.render('login', { erro: 'Erro interno' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
