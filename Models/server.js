const dbconnect = require('../Database/config');
const express = require('express');

const {
    getParkinglot, 
    getParkinglotById, 
    getParkinglotsByEstado, 
    postParkinglot, 
    putParkinglot, 
    deleteParkinglot,
    park,
    leave
} = require('../Controller/parkinglotController')

const {
    getCounter, 
    resetCounter,
    updateCounter,
    updateMaxCounter
} = require('../Controller/counterController')

class Server {
    constructor() {
        this.app  = express();
        this.listen();
        this.pathParking = '/api/parking'
        this.pathCounter = '/api/counter'
        this.dbConnection();
        this.route();
    }
    route(){
        this.app.use(express.json());

        //Parking
        this.app.get(this.pathParking, getParkinglot);
        this.app.get(this.pathParking+'/:id', getParkinglotById);
        this.app.get(this.pathParking+'/estado/:estado', getParkinglotsByEstado);
        this.app.post(this.pathParking, postParkinglot);
        this.app.put(this.pathParking+'/:id', putParkinglot );
        this.app.put(this.pathParking+'/park/:placa', park );
        this.app.put(this.pathParking+'/leave/:id', leave );
        this.app.delete(this.pathParking+'/:id', deleteParkinglot );

        //Counter
        this.app.get(this.pathCounter, getCounter);
        this.app.get(this.pathCounter+'/reset', resetCounter);
        this.app.put(this.pathCounter+'/seq/:counter', updateCounter);
        this.app.put(this.pathCounter+'/max/:max', updateMaxCounter);
    }
    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running`);  
        })
    }

    async dbConnection(){
        await dbconnect();
    }
}

module.exports = Server;