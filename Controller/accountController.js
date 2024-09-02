const Account = require('../Models/Account');
// const Counter = require('../Models/Ac').Counter;

const bcrypt = require('bcrypt');

const getAccountBNyumber = async (req, res) => {
    const numeroCuenta = req.params.numeroCuenta;
    const cuenta = await Account.findOne({ numeroCuenta });
  
    if (!cuenta) {
      res.status(404).json({ msg: 'Account not found' });
    } else {
      res.json(cuenta);
    }
};

const postAccount = async (req, res) => {
    try {
      const body = req.body;

      if (!body.claveAcceso || body.claveAcceso.length !== 4) {
        res.status(400).json({ msg: 'La clave de acceso debe tener exactamente 4 dígitos' });
        return;
      }

      body.claveAcceso = await bcrypt.hash(body.claveAcceso, 10);
     
      const cuenta = new Account(body)
      ;
      await cuenta.save();
      res.json({ msg: 'Account created successfully' });
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({ msg: 'Error creating account' });
    }
};

const deleteAccount = async (req, res) => {
    try {
      const numeroCuenta = req.params.numeroCuenta;
      const cuenta = await Account.findOne({ numeroCuenta });
  
      if (!cuenta) {
        res.status(404).json({ msg: 'Account not found' });
        return;
      }
  
      if (cuenta.saldo > 0) {
        res.status(400).json({ msg: 'No se puede eliminar la cuenta porque tiene saldo' });
        return;
      }
  
      await Account.findOneAndDelete({ numeroCuenta });
      res.json({ msg: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ msg: 'Error deleting account' });
    }
};

//Metodos manipuladores del saldo en la cuenta

const deposit = async (req, res) => {
    try {
      const numeroCuenta = req.params.numeroCuenta;
      const cuenta = await Account.findOne({ numeroCuenta });
  
      if (!cuenta) {
        res.status(404).json({ msg: 'Account not found' });
        return;
      }
  
      const montoConsignacion = req.body.montoConsignacion;
  
      if (montoConsignacion <= 0) {
        res.status(400).json({ msg: 'El monto de consignación debe ser positivo' });
        return;
      }
  
      cuenta.saldo += montoConsignacion;
      await cuenta.save();
  
      res.json({ msg: 'Consignación exitosa' });
    } catch (error) {
      console.error('Error consignando:', error);
      res.status(500).json({ msg: 'Error consignando' });
    }
};

  const withdraw = async (req, res) => {
    try {
      const numeroCuenta = req.params.numeroCuenta;
      const cuenta = await Account.findOne({ numeroCuenta });
  
      if (!cuenta) {
        res.status(404).json({ msg: 'Account not found' });
        return;
      }
  
      const montoRetiro = req.body.montoRetiro;
  
      if (montoRetiro <= 0) {
        res.status(400).json({ msg: 'El monto de retiro debe ser positivo' });
        return;
      }
  
      if (montoRetiro > cuenta.saldo) {
        res.status(400).json({ msg: 'No tiene suficiente saldo para realizar el retiro' });
        return;
      }
  
      cuenta.saldo -= montoRetiro;
      await cuenta.save();
  
      res.json({ msg: 'Retiro exitoso' });
    } catch (error) {
      console.error('Error retirando:', error);
      res.status(500).json({ msg: 'Error retirando' });
    }
  };


module.exports = {
    postAccount,
    getAccountBNyumber, 
    deleteAccount,
    deposit, 
    withdraw
}