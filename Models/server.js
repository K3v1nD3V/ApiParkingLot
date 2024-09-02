const dbconnect = require('../Database/config');
const express = require('express');

const {
    postAccount,
    getAccountBNyumber,
    deleteAccount,
    deposit,
    withdraw
} = require('../Controller/accountController')

const {
    getCounter, 
    resetCounter,
    updateCounter
} = require('../Controller/counterController')

class Server {
    constructor() {
        this.app  = express();
        this.listen();
        this.pathAccount = '/api/account'
        this.pathCounter = '/api/counter'
        this.dbConnection();
        this.route();
    }
    route(){
        this.app.use(express.json());

        //Account
        this.app.get(this.pathAccount+'/:numeroCuenta', getAccountBNyumber);
        this.app.post(this.pathAccount, postAccount);
        this.app.put(this.pathAccount+'/deposit/:numeroCuenta', deposit);
        this.app.put(this.pathAccount+'/withdraw/:numeroCuenta', withdraw);
        this.app.delete(this.pathAccount+'/:numeroCuenta', deleteAccount);

        //Counter
        this.app.get(this.pathCounter, getCounter);
        this.app.get(this.pathCounter+'/reset', resetCounter);
        this.app.put(this.pathCounter+'/seq/:counter', updateCounter);
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