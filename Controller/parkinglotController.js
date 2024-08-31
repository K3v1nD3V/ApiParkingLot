const Parkinglot = require('../Models/parkinglot');
const Counter = require('../Models/parkinglot').Counter;

const bcrypt = require('bcrypt');

const getParkinglot = async (req, res) => {
    const parkinglot = await Parkinglot.find();
    
    res.json(parkinglot)
}

const getParkinglotById = async (req, res) => {
    const id = req.params.id;
    const parkinglot = await Parkinglot.findOne({ numeroCelda: id });

    if (!parkinglot) {
        res.status(404).json({ msg: 'Parking lot not found' });
    } else {
        res.json(parkinglot);
    }
};

const getParkinglotsByEstado = async (req, res) => {
    let estado = req.params.estado;
    
    estado = (estado === '1') ? 'Disponible' : (estado === '2') ? 'No Disponible': estado;

    const parkinglots = await Parkinglot.find({ estado: estado });

    if (!parkinglots || parkinglots.length === 0) {
        res.status(404).json({ msg: 'No parking lots found with the specified state' });
    } else {
        res.json(parkinglots);
    }
};

const postParkinglot = async (req, res) => {
    let msg = 'Parking inserted';
    const body = req.body
    try {
      const counter = await Counter.findById('parking_seq');
      
      if (counter.seq === counter.max) {
        msg = 'Máximo de parkinglots registrados alcanzado (10)';
        res.status(400).json({ msg: msg });
        return;
      } else {
        const parkinglot = new Parkinglot(body);
        await parkinglot.save();
        res.json({ msg: msg });
      }
    } catch (error) {
      msg = error;
      res.status(500).json({ msg: msg });
    }
  }

const putParkinglot = async (req, res) => {
    let msg = 'Parkinglot updated';

    if (!req.body) {
        msg = 'No request body provided';
        res.status(400).json({ msg });
        return;
    }

    const { estado, placaVehiculo, fechaIngreso, fechaSalida } = req.body;

    try {
        const filter = { numeroCelda: req.params.id }; 
        await Parkinglot.findOneAndUpdate(filter, { estado, placaVehiculo, fechaIngreso, fechaSalida });
    } catch (error) {
        console.error('Error updating parking lot:', error);
        msg = 'Error updating parking lot';
    }

    res.json({ msg });
};

const deleteParkinglot = async (req, res) => {
    const id = req.params.id;
    try {
        const parkinglot = await Parkinglot.findOneAndDelete({ numeroCelda: id });
        if (!parkinglot) {
            res.status(404).json({ msg: 'Parking lot not found' });
        } else {
            res.json({ msg: 'Parking lot deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting parking lot:', error);
        res.status(500).json({ msg: 'Error deleting parking lot' });
    }
};

//Metodos de control para el parqueadero

const park = async (req, res) => {
    try {
      const placaVehiculo = req.params.placa;
      
      const parking = await Parkinglot.findOne({ estado: 'Disponible' });
  
      if (!parking) {
        res.status(404).json({ msg: 'No hay celdas disponibles' });
        return;
      }
      
      const fechaIngreso = new Date();
      const pin = await generatePin(parking.numeroCelda, placaVehiculo);

      await Parkinglot.findOneAndUpdate(
        { _id: parking._id },
        {
          placaVehiculo: placaVehiculo,
          estado: 'No Disponible',
          fechaIngreso: fechaIngreso,
          pin: pin,
        }
      );
  
      res.json({ msg: 'El vehículo se a parqueado con éxito' });
    } catch (error) {
      console.error('Error al parquear:', error);
      res.status(500).json({ msg: 'Error al parquear' });
    }
};
//generar pin
async function generatePin(numeroCelda, placaVehiculo) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(`${numeroCelda}${placaVehiculo}`, salt);
}

//exit
const leave = async (req, res) => {
    try {
        const id = req.params.id;

        const parking = await Parkinglot.findOne({ numeroCelda: id });

        if (!parking) {
            res.status(404).json({ msg: 'Celda no encontrada' });
            return;
        }

        const payValue = calculatePayValue(parking.fechaIngreso);

        await Parkinglot.findOneAndUpdate(
        { _id: parking._id },
        {
            estado: 'Disponible',
            placaVehiculo: '',
            fechaIngreso: null,
            fechaSalida: null,
            pin: '',
        }
        );

        res.json({ msg: 'El Vehículo a salió con éxito.', payValue });
    } catch (error) {
        console.error('Error al salir:', error);
        res.status(500).json({ msg: 'Error al salir' });
    }
};

//calcular valor a pagar
function calculatePayValue(fechaIngreso) {
    
    const fechaSalida = new Date();

    const houres = (fechaSalida.getTime() - fechaIngreso.getTime()) / 3600000;

    let payValue;
    if (houres < 1) {
        payValue = 5000; 
    } else {
        payValue = Math.floor(houres) * 5000;
    }

    return payValue
}
module.exports = {
    getParkinglot,
    getParkinglotById,
    getParkinglotsByEstado,
    postParkinglot, 
    putParkinglot,
    deleteParkinglot,
    park,
    leave
}