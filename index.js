const express = require('express');
const app =express();
const port =3000;
// middle ware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
  res.send('Habit Tarcker')
})
app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`);
})