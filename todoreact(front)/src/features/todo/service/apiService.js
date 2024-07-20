// apiService.js
import axios from 'axios';
import { addToList, updateList } from '../todoSlice'

const BASE_URL = 'http://127.0.0.1:3002/api'; // Substitua pela URL da sua API

export const getTodos = () => {
  return axios.get(`${BASE_URL}/tarefa`);
};

export const createTodo = async (dispatch, newTask) => {
  try {
    await axios.post(`${BASE_URL}/tarefa`, newTask);

    const splitArr = newTask.vencimento.split('-');
    const formatedData = `${splitArr[2]}/${splitArr[1]}/${splitArr[0]}`;
    const task = { ...newTask, vencimento: formatedData };

    // Despache a ação para atualizar o estado
    await dispatch(addToList(task));
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    throw error;
  }
};

export const updateTodo = async (dispatch, update) => {
    try {
      await axios.patch(`${BASE_URL}/tarefa`, update)

      await dispatch(updateList(update))
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      throw error;
    }





  
}
