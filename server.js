const express = require("express");
const app = express();
app.use(express.static('public'));
app.use(express.json()); /***deve essere prima di altri cosi gli eriditano */
/*const taskdao = require("./taskDao/taskdao");*/
const taskRoutes = require('./routes/taskRoutes');  /**** */

app.use(taskRoutes);  /******** */



module.exports = app; /******** */

const PORTA = 6500;

app.listen(PORTA, () => {
  console.log("Server in ascolto Porta N°:",PORTA);
});