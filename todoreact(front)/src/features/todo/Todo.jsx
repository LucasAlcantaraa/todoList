import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setList } from './todoSlice'
import { createTodo, getTodos, updateTodo } from './service/apiService'; // Importe o serviço aqui
import './todo.css'
import Paginacao from '../../components/paginacao/Paginacao';
import _ from 'lodash'

function formatarData() {
  const date = new Date();
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
  const dia = String(date.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

export function Todo() {
  // const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const [todo, setTodo] = useState({ tarefa: '', vencimento: formatarData() })
  const todoState = useSelector((state) => state.todo.list)
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getTodos()
      .then(response => {
        dispatch(setList(response.data));
      })
      .catch(error => {
        console.error('Erro ao buscar tarefas:', error);
      });
  }, [dispatch]);

  function setDefault() {
    //Função que reseta o estado do input após adicionar nova tarefa.
    setTodo({ tarefa: '', vencimento: formatarData() })

    //Passa para a próxima página quando é atingido o número total de tarefas na página atual.
    const indexArray = Object.keys(todoState).length - 1
    const ultimoArray = Object.values(todoState)[indexArray]

    if (ultimoArray.length === 3) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  async function handleSubmit() {
    if (todo?.tarefa) {
      await createTodo(dispatch, todo)
      setDefault()
    } else {
      alert('Não é possível enviar tarefa vazia')
    }
  }
  //função debounce do lodash que impede cliques consecultivos nas tarefas.
  const debounceHandleClick = _.debounce((index) => {
    const id = todoState[currentPage][index]._id
    const concluido = todoState[currentPage][index].concluido
    if (!concluido)
      updateTodo(dispatch, { _id: id, set: { concluido: 'true' } })

  }, 500);

  return (
    <div className='container'>
      <div className='heading'>
        <h1>Lista de Afazeres</h1>
      </div>
      <div className='form'>
        <div>
          <label>Tarefa</label>
          <input type="text" value={todo.tarefa} onChange={e => setTodo({ ...todo, tarefa: e.target.value })} />
        </div>
        <div>
          <label>Vencimento</label>
          <input type="date" value={todo.vencimento} onChange={e => setTodo({ ...todo, vencimento: e.target.value })} />
        </div>
      </div>
      <button onClick={() => handleSubmit()}>Adicionar</button>
      <div>
        <ul>
          {Array.isArray(todoState[currentPage]) && todoState[currentPage].map((todo, i) => {
            return <li key={i} style={{ textDecoration: todo.concluido ? 'line-through' : 'none' }} onClick={() => debounceHandleClick(i)}>Tarefa: {todo.tarefa}, Vencimento: {todo.vencimento}</li>
          })}
        </ul>
      </div>
      <Paginacao
        consulta={todoState}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}