const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost/First_App";

mongoose
    .connect(
        mongoDB,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
    ).then(() => console.log("Mongodb Connected"));

mongoose.Promise = global.Promise;

module.exports = mongoose;