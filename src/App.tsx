
import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/card';
import { Container, Button, Modal, Box, TextField } from '@mui/material';
import { createTask, getTasks, updateTask } from './services/taskServices';
import { TaskItem } from './models/TaskItem';

function App() {

  const [openModal, setOpenModal] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState<TaskItem>({
    id: null,
    title: '',
    description: '',
    status: 'todo'
  });

  const handleOpen = () => {
    setOpenModal(true);
    setIsEdit(false);
    setNewTask({
      id: null,
      title: '',
      description: '',
      status: 'todo'
    });
  }

  const handleClose = () => {
    setOpenModal(false);
    setIsEdit(false);
    setNewTask({
      id: null,
      title: '',
      description: '',
      status: 'todo'
    });
  }

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

  const saveNewTask = async () => {
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({
        id: null,
        title: '',
        description: '',
        status: 'todo'
      });
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setOpenModal(false);
    }
  };

  const saveUpdatedTask = async () => {
    try {
      await updateTask(newTask.id, newTask);
      setTasks(tasks.map(t => (t.id === newTask.id ? newTask : t)));
      setNewTask({
        id: null,
        title: '',
        description: '',
        status: 'todo'
      });
      setOpenModal(false);
      setIsEdit(false)
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (

    <Container >

      <div className="d-flex justify-content-end margin-small">
        <Button onClick={handleOpen} className="button-primary">Add Task</Button>
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <div id="modal-modal-title">
            <div className="d-flex justify-content-center margin-y-small">
              <div className="d-flex justify-content-center background-white w-50 flex-wrap p-small">
                <div className="d-flex justify-content-end w-100">
                  <Button className="button-secondary" onClick={handleClose}>X</Button>
                </div>
                <p className="w-100">Title</p>
                <TextField required placeholder="Type anything…" className="w-100" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}/>
                <p className="w-100">Description</p>
                <TextField required placeholder="Type anything…" className="w-100" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}/>
                <div className='w-100 d-flex justify-content-end'>
                  <Button
                    color="primary"
                    onClick={isEdit ? saveUpdatedTask : saveNewTask}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <div className="d-flex justify-content-center flex-wrap w-100 margin-small">
        <div className="card-container margin-x-small background-yellow">
          <h2 className="yellow">To do</h2>
          {tasks.filter(t => t.status == 'todo').map((task, index) => (
            <Card task={task} tasks={tasks} setTasks={setTasks} setIsEdit={setIsEdit} setNewTask={setNewTask} setOpenModal={setOpenModal} key={index}/>
          ))}
        </div>

        <div className="card-container margin-x-small background-green">
          <h2 className="green">In Progress</h2>
          {tasks.filter(t => t.status == 'inProgress').map((task, index) => (
            <Card task={task} tasks={tasks} setTasks={setTasks} setIsEdit={setIsEdit} setNewTask={setNewTask} setOpenModal={setOpenModal} key={index}/>
          ))}
        </div>

        <div className="card-container margin-x-small background-pink">
          <h2 className="pink">On Approval</h2>
          {tasks.filter(t => t.status == 'onApproval').map((task, index) => (
            <Card task={task} tasks={tasks} setTasks={setTasks} setIsEdit={setIsEdit} setNewTask={setNewTask} setOpenModal={setOpenModal} key={index}/>
          ))}
        </div>

        <div className="card-container margin-x-small background-blue">
          <h2 className="blue">Done</h2>
          {tasks.filter(t => t.status == 'done').map((task, index) => (
            <Card task={task} tasks={tasks} setTasks={setTasks} setIsEdit={setIsEdit} setNewTask={setNewTask} setOpenModal={setOpenModal} key={index}/>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default App;
