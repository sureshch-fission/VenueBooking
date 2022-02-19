const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const slotRoutes = require('./src/routes/slotRoutes')
require('./src/database/mongoose')

const app = express();


app.use(express.json());

app.use(userRoutes)
app.use(slotRoutes)

const port = process.env.PORT;

app.listen(port, ()=>{
  console.log(`Server is connected ${port}`)
});


