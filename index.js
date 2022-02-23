const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const slotRoutes = require('./src/routes/slotRoutes');
const OwnerRoutes = require('./src/routes/ownerRoutes');
require('./src/database/mongoose')

const app = express();


app.use(express.json());

app.use(userRoutes)
app.use(slotRoutes)
app.use(OwnerRoutes)

const port = process.env.PORT;

app.listen(port, ()=>{
  console.log(`Server is connected ${port}`)
});


