const mongoose = require('mongoose');

// Para conectar com o seu banco de dados do MongoDB, insira abaixo seu codigo de conexão.

mongoose.connect('mongodb+srv://eduardosps:Positivo123@apiescribo.bxh6scx.mongodb.net/api-nodejs-mongodb?retryWrites=true&w=majority')
  .then(() => {
    console.log('Conexão com MongoDB estabelecida');
  })
  .catch((error) => {
    console.error('Erro de conexão com MongoDB:', error);
  });
mongoose.Promise = global.Promise;

module.exports = mongoose;
