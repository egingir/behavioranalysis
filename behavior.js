const mongoose = require('mongoose');

const BehaviorSchema = new mongoose.Schema({
  behaviortest: { type: mongoose.Types.ObjectId, ref: 'behaviortest' },
  uyarici: {  type: String, default: '' },
  sekil: { type: String, default: '' },
  beklenen: { type: String, default: '' },
  tepki:  { type: String, default: '' },
  sure: { type: Number, default: 0 },
  sonuc: { type: String, default: 0 },
});

module.exports = mongoose.model('Behavior', BehaviorSchema);
