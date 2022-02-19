const mongoose = require('mongoose');





const MongoDBURL = process.env.MongoDBURL
console.log(MongoDBURL)

const mongodb = () => {

  try {
    mongoose.connect(MongoDBURL, {

      useNewUrlParser: true,

    });

    console.log('Data Base Connected')

  } catch (error) {
    console.log(error)
  }

}
mongodb()



