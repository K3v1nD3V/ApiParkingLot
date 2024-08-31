const { Schema, model } = require('mongoose');

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
    max: { type: Number, default: 10 }
});
  
const Counter = model("Counter", CounterSchema);

const ParkinglotSchema = new Schema({
  numeroCelda: {
    type: Number,
    required: true
},
  estado: {
    type: String,
    default: 'Disponible',
    required: true
  },
  placaVehiculo: {
    type: String,
    default: '',
    maxlength: [6, 'Max length 6'],
  },
  fechaIngreso: {
    type: Date,
    default: null,
    required: false
  },
  fechaSalida: {
    type: Date,
    default: null,
    required: false
  },
  pin: {
    type: String,
    default: '',
    required: false
  }
}, {
  validateBeforeSave: false
});

ParkinglotSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.isNew) return next();

  const counter = await Counter.findByIdAndUpdate(
    { _id: 'parking_seq' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  doc.numeroCelda = counter.seq;
  next();
});

module.exports = model('ParkinglotSchema', ParkinglotSchema, 'parkinglotSchema'); 
module.exports.Counter = Counter;