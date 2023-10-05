require('dotenv').config();
const mongoose = require('mongoose');
const mongodbURI = process.env.MONGODBURI;

/**
  * @desc connects to MongoDB
*/
const connectToMongodb = () => {
    if(mongodbURI === undefined){
        console.log("Unable to connect to MongoDB");
    }else{
        mongoose.connect(mongodbURI, ()=>{
            console.log("Connected to MongoDB successfully");
        });
    }
}

module.exports = connectToMongodb;
