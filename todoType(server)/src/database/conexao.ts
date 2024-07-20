import { connect } from 'mongoose'

export async function connectDB() {
  await connect('mongodb://127.0.0.1/todoType')
    .then(() => {
      console.log('Conexão com o MongoDB estabelecida!');
    })
    .catch((error) => {
      console.error('Erro ao conectar ao MongoDB:', error.message)
    });
}