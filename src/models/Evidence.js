const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  plataforma: {
    type: String,
    required: true,
    enum: ['iFood', 'Uber Eats', '99', 'Outro']
  },
  tipoProblema: {
    type: String,
    required: true,
    enum: ['Cancelamento', 'Atraso', 'Problema no local', 'Cliente ausente', 'App travou', 'Acidente', 'Outro']
  },
  descricao: { type: String, required: true },
  dataOcorrido: { type: Date, default: Date.now },
  statusPedido: { type: String, default: '' },
  valorCorrida: { type: String, default: '' },
  fileIds: [{ type: mongoose.Schema.Types.ObjectId }],
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Evidence', EvidenceSchema);
