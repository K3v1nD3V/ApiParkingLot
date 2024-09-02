const Counter = require('../Models/Account').Counter;

const getCounter = async (req, res) => {
    const counter = await Counter.find()
    
    if (!counter) {
        res.status(404).json({ msg: 'Counter not found' });
    }else{
        res.json(counter)
    }
}
const resetCounter = async (req, res) => {
  try {
    const counter = await Counter.findById('account_seq');
    if (!counter) {
      res.status(404).send('No se encontró el contador');
      return;
    }
    const updatedCounter = await Counter.updateOne({ _id: 'account_seq' }, { $set: { seq: 0 } });
    if (updatedCounter.nModified === 0) {
      res.send('El contador ya estaba en 0');
    } else {
      res.send('Contador reiniciado a 0');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al reiniciar el contador');
  }
};

const updateCounter = async (req, res) => {
    let msg = 'Counter updated'
    try {
        await Counter.updateOne({ _id: 'account_seq' }, { $set: { seq: req.params.counter} });
    } catch (error) {
        console.error('Error updating counter:', error);
        msg = 'Error updating counter';
    }

    res.json({ msg });
}
module.exports = {
  resetCounter,
  getCounter,
  updateCounter
};