const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.session.userId).lean();
  res.render('profile', {
    user,
    erro: null,
    sucesso: null,
    userName: req.session.userName
  });
});

router.post('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const { senhaAtual, novaSenha, confirmarSenha } = req.body;

    const match = await bcrypt.compare(senhaAtual, user.password);
    if (!match) {
      return res.render('profile', { user: user.toObject(), erro: 'Senha atual incorreta', sucesso: null, userName: req.session.userName });
    }
    if (novaSenha.length < 4) {
      return res.render('profile', { user: user.toObject(), erro: 'Nova senha deve ter no mínimo 4 caracteres', sucesso: null, userName: req.session.userName });
    }
    if (novaSenha !== confirmarSenha) {
      return res.render('profile', { user: user.toObject(), erro: 'Nova senha e confirmação não conferem', sucesso: null, userName: req.session.userName });
    }

    user.password = await bcrypt.hash(novaSenha, 10);
    await user.save();

    res.render('profile', { user: user.toObject(), erro: null, sucesso: 'Senha alterada com sucesso!', userName: req.session.userName });
  } catch (err) {
    res.redirect('/profile');
  }
});

router.get('/users', isAuthenticated, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.render('users', { users, erro: null, sucesso: null, userName: req.session.userName });
});

router.post('/users', isAuthenticated, async (req, res) => {
  try {
    const { nome, username, password } = req.body;
    const existente = await User.findOne({ username });
    if (existente) {
      const users = await User.find().sort({ createdAt: -1 }).lean();
      return res.render('users', { users, erro: 'Usuário já existe', sucesso: null, userName: req.session.userName });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ nome, username, password: hashed });
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.render('users', { users, erro: null, sucesso: 'Usuário criado com sucesso!', userName: req.session.userName });
  } catch (err) {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.render('users', { users, erro: 'Erro ao criar usuário', sucesso: null, userName: req.session.userName });
  }
});

router.post('/users/delete/:id', isAuthenticated, async (req, res) => {
  try {
    if (req.params.id === req.session.userId.toString()) {
      return res.redirect('/users');
    }
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.redirect('/users');
  }
});

module.exports = router;
