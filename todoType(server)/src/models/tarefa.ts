import { Schema, model } from 'mongoose'

const schema = new Schema({
tarefa: {type: String, required: true},
vencimento: Date,
concluido: {type: Boolean, required: true}
});

export const Tarefa = model('Tarefa', schema);
