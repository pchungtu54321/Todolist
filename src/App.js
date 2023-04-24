import React, {useState, useEffect} from 'react';
import {MinusSquareOutlined, CheckSquareOutlined} from '@ant-design/icons';
import {List, Divider, Layout, Col, Row} from 'antd';
import VirtualList from 'rc-virtual-list';
import './App.css';



const { Header, Content } = Layout;
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  maxWidth: '80%',
  backgroundColor: '#7dbcea',
};
const contentStyle = {
  textAlign: 'left',
  minHeight: 800,
  lineHeight: '10px',
  color: '#fff',
  maxWidth: '80%',
};



function App() {
  let count = 0;
  const[userList, setUserList] = useState([])
  const[selectedUser, setSelectedUser] = useState('')
  const[todoList, setTodoList] = useState([])
  const[loadingB, setLoadingB] = useState(todoList.map(() => false))
 
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
        data.sort(compareFn);
        countCompleted(data);
        setTodoList(data);
      }
    }
    fetchTodos();

  }, [selectedUser, loadingB]);

  //selectedUser
  function handleSelectUser(event) {
    setSelectedUser(event.target.value);
  }

  //sort data by completed
  function compareFn(a, b) {
    if (a.completed == true && b.completed == false) {
      return 1;
    }
    if (a.completed == false && b.completed == true) {
      return -1;
    }
    // a must be equal to b
    return 0;
  }

  // console.log(todoList) when it changed
  useEffect(() => {
    console.log(todoList);
    
  }, [todoList]);

  // set completed = true
  const setDone = async (id) => {
    setLoadingB((prevLoading) => ({ ...prevLoading, [id]: true }));
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: true }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      const todoToUpdate = todoList.find(todo => todo.id === id);
      if (todoToUpdate) {
        todoToUpdate.completed = true;
        setTodoList([...todoList]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingB((prevLoading) => ({ ...prevLoading, [id]: false }));
  };

  // count completed to display
  function countCompleted(todoList) {
    let temp = 0;
    todoList.map(item => {
      if(item.completed === true) {
        temp++;
      }
    })
    count = temp
    console.log(count)
    const countDone = document.getElementById("done");
    countDone.textContent = `Done ${count} / ${todoList.length}`;
    countDone.style.color = "black";
  }

  

  return (
    <Layout>
      <Row>
        <Col span = {20} offset = {4}>
          <Header style={headerStyle}></Header>
        </Col>
      </Row>
      <Row>
        <Col span = {20} offset = {4}>
          <Content style={contentStyle}>
          <div>
            <Divider orientation="left" orientationMargin="0">
              User
            </Divider>
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
            <Divider orientation="left" orientationMargin="0">
              Tasks
            </Divider>
            <List bordered={true}>
              <VirtualList
                data={todoList}
                height={500}
                width= {800}
                itemHeight={47}
                itemKey="id"
              >
                {(item) => (
                  <List.Item key={item.id}>
                    {item.completed ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <CheckSquareOutlined style={{ display: "inline-block", color: 'green' }} />
                          </div>
                        ) : (
                          
                          <div style={{ display: "flex", alignItems: "center", color: '#ffa500' }}> 
                            <MinusSquareOutlined style={{ display: "inline-block" }} />
                          </div> 
                        )
                    }
                    <List.Item.Meta style={{paddingLeft: "10px"}}
                      title={item.title}
                    />

                    <div>
                      {!item.completed ? (
            
                            <div style ={{alignSelf: "flex-end"}}>
                              <button onClick = {() => setDone(item.id)}>
                                {loadingB[item.id] ? <span className="spinner"></span> : "Mark Done"  }
                              </button>
                            </div>
                      
                          ) : ( 
                            <p></p>
                          )
                      }
                    </div>
                  </List.Item>
                )}
              </VirtualList>
            </List>
            <p id = "done"> </p>
          </div>
          </Content>
        </Col>
      </Row>
      
    </Layout>
  );
}

export default App;
