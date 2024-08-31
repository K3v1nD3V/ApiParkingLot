const mogoose = require('mongoose');

const dbconnect = async () => {
    try {
        await mogoose.connect(process.env.MONGO_CNN);
        console.log('MongoDB connected');
    } catch (error) {
        console.log('Database connection error: ' + error);
    }
}

module.exports = dbconnect;