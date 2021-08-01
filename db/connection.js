const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        const con = await mongoose.connect(
            "mongodb+srv://admin-ajeyata:Ajeyata@05@cluster0.n1dg8.mongodb.net/patientsDB",
            {
              useNewUrlParser: true,
              useUnifiedTopology: true 
            }
          );
        console.log('MongoDB connected:', con.connection.host);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;