const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const { isAuthenticated } = require('../middleware/auth');
const Evidence = require('../models/Evidence');
const { getGridFSBucket, getDB } = require('../config/db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', isAuthenticated, async (req, res) => {
  const { plataforma, tipo } = req.query;
  let query = { criadoPor: req.session.userId };
  if (plataforma) query.plataforma = plataforma;
  if (tipo) query.tipoProblema = tipo;

  const evidencias = await Evidence.find(query)
    .sort({ createdAt: -1 })
    .lean();

  res.render('dashboard', {
    evidencias,
    filtroPlataforma: plataforma || '',
    filtroTipo: tipo || '',
    userName: req.session.userName
  });
});

router.get('/new', isAuthenticated, (req, res) => {
  res.render('new', { erro: null, userName: req.session.userName });
});

router.post('/', isAuthenticated, upload.array('arquivos', 10), async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const fileIds = [];

    for (const file of (req.files || [])) {
      const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
      const id = new mongoose.Types.ObjectId();

      await new Promise((resolve, reject) => {
        const stream = bucket.openUploadStreamWithId(id, filename, {
          contentType: file.mimetype,
          metadata: {
            originalname: file.originalname,
            mimetype: file.mimetype,
            uploader: req.session.userId
          }
        });
        stream.end(file.buffer);
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      fileIds.push(id);
    }

    await Evidence.create({
      plataforma: req.body.plataforma,
      tipoProblema: req.body.tipoProblema,
      descricao: req.body.descricao,
      dataOcorrido: req.body.dataOcorrido || new Date(),
      statusPedido: req.body.statusPedido || '',
      valorCorrida: req.body.valorCorrida || '',
      fileIds,
      criadoPor: req.session.userId
    });

    res.redirect('/');
  } catch (err) {
    res.render('new', { erro: 'Erro ao salvar: ' + err.message, userName: req.session.userName });
  }
});

router.get('/:id', isAuthenticated, async (req, res) => {
  const ev = await Evidence.findById(req.params.id).lean();
  if (!ev) return res.redirect('/');
  if (ev.criadoPor.toString() !== req.session.userId.toString()) {
    return res.redirect('/');
  }
  res.render('view', { ev, userName: req.session.userName });
});

router.get('/file/:id', isAuthenticated, async (req, res) => {
  const bucket = getGridFSBucket();

  try {
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(req.params.id) }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).send('Arquivo não encontrado');
    }
    const file = files[0];
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `inline; filename="${file.filename}"`);
    const stream = bucket.openDownloadStream(file._id);
    stream.pipe(res);
  } catch (err) {
    res.status(404).send('Arquivo não encontrado');
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const ev = await Evidence.findById(req.params.id);
    if (!ev) return res.status(404).send('Não encontrado');
    if (ev.criadoPor.toString() !== req.session.userId.toString()) {
      return res.status(403).send('Sem permissão');
    }

    const db = getDB();
    const filesCol = db.collection('uploads.files');
    const chunksCol = db.collection('uploads.chunks');

    for (const fid of ev.fileIds) {
      const oid = new mongoose.Types.ObjectId(fid);
      await filesCol.deleteOne({ _id: oid });
      await chunksCol.deleteMany({ files_id: oid });
    }

    await Evidence.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao excluir');
  }
});

module.exports = router;
