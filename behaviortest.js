const mongoose = require('mongoose');

const BehaviortestSchema = new mongoose.Schema({
  date: { type: String, default: '' },
  sorumlu: {  type: String, default: '' },
  katilimcino: {  type: String, default: '' },
  tip: { type: String, default: '' },
  yas: { type: Number, default: 0 },
  testsirasi: { type: String, default: '' },
  sinif: { type: Number, default: 0 },
  aciklama: { type: String, default: '' },
  cinsiyet: { type: String, default: '' },
});

module.exports = mongoose.model('Behaviortest', BehaviortestSchema);
