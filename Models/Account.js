const { Schema, model } = require('mongoose');

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
  
const Counter = model("Counter", CounterSchema);

const AccountSchema = new Schema({
  numeroCuenta: {
    type: Number,
    required: true
},
  documentoCliente: {
    type: String,
    required: true
  },
  FechaApertura: {
    type: Date,
    default: Date.now()
  },
  saldo: {
    type: Number,
    default: 0,
  },
  claveAcceso: {
    type: String,
    required: true,
  }
},{
  validateBeforeSave: false
});

AccountSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.isNew) return next();

  const counter = await Counter.findByIdAndUpdate(
    { _id: 'account_seq' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  doc.numeroCuenta = counter.seq;
  next();
});

module.exports = model('AccountSchema', AccountSchema, 'accountSchema'); 
module.exports.Counter = Counter;