const mongoose = require('mongoose');
require('dotenv').config();

const dbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'default'
};

mongoose.set("strictQuery", false) // this allows to save fields not specified in model to be saved anyway (I'm setting this to avoid deprication warning, right now it is true by deffault, but will be false in Moongose 7)
mongoose
    .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(response => {
        console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
    })
    .catch(err => { return err });
