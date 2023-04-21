import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import './App.css';


function App() {

  const[userList, setUserList] = useState([])
  const[selectedUser, setSelectedUser] = useState('')
  const[todoList, setTodoList] = useState([])

  //userList
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch ('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUserList(data);
    }
    console.log(userList)
    fetchUsers();
  }, []);

  //todoList
  useEffect(() => {
    async function fetchTodos() {
      if(selectedUser) {
        const response = await fetch (`https://jsonplaceholder.typicode.com/users/${selectedUser}/todos`);
        const data = await response.json();
        setTodoList(data);
      }
    }
    console.log(todoList)
    fetchTodos();
  }, [selectedUser]);

  //selectedUser
  function handleSelectUser(event) {
    setSelectedUser(event.target.value);
  }

  return (
    <div>
      <div>
        <span>User</span>
        <div>
          <select value = {selectedUser} onChange = {handleSelectUser}>
            <option value =""> Select a user</option>
            {
              userList.map((user) =>(
              <option key = {user.id} value = {user.id}> {user.username}</option>
            ))}
          </select>
        
        </div>
      </div>
      <div>
        <span>Taks</span>
        <div>
          {
            todoList.map((todo) => (
            <div key={todo.id}>
              <h3>{todo.title}</h3>
              <p>{todo.completed ? "Completed" : "Not completed"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
