import { createSlice } from '@reduxjs/toolkit'

export const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    list: {},
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload
    },
    addToList: (state, action) => {
      let added = false; // Variável para controlar se um novo array foi adicionado
    
      for (let arr in state.list) {
        if (state.list[arr].length < 3) {
          state.list[arr].push(action.payload);
          added = true; // Indica que um array foi atualizado
        }
      }
      // Se nenhum array foi atualizado, crie um novo array
      if (!added) {
        const newId = Object.keys(state.list).length + 1; // Gere um novo ID
        state.list[newId] = [action.payload];
      }
    },
    updateList: (state, action) => {
      const { _id } = action.payload;
    
      for (let arr in state.list) {
        const toUpdateIndex = state.list[arr].findIndex((element) => element._id === _id);
    
        if (toUpdateIndex !== -1) {
          // Encontrou o objeto com o mesmo _id
          state.list[arr][toUpdateIndex].concluido = true;
        }
      }
    },    
  },
})

export const { setList, addToList, updateList } = todoSlice.actions
export default todoSlice.reducer