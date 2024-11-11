import React, { useEffect } from 'react';
import './../App.css';
import { TaskItem } from '../models/TaskItem';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { Button } from '@mui/material';
import { deleteTask, updateTask } from '../services/taskServices';

interface CardProps {
    task: TaskItem,
    tasks: TaskItem[],
    setTasks: (newTasks: TaskItem[]) => void,
    setIsEdit: (isEdit: boolean) => void,
    setNewTask: (newTask: TaskItem) => void,
    setOpenModal: (openModal: boolean) => void,
}

interface TaskStatus {
    id: number,
    name: string
}

const Card: React.FC<CardProps> = ({ task, tasks, setTasks, setIsEdit, setNewTask, setOpenModal }) => {
    const statusFlow: TaskStatus[] = [
        {
            id: 1,
            name: 'todo'
        },
        {
            id: 2,
            name: 'inProgress'
        },
        {
            id: 3,
            name: 'onApproval'
        },
        {
            id: 4,
            name: 'done'
        }
    ];

    const [isBackButtonDisabled, setIsBackButtonDisabled] = React.useState(false);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled] = React.useState(false);

    const moveBack = async () => {
        let currentStatus = statusFlow.filter(s => s.name === task.status)[0];
        task.status = statusFlow.filter(s => s.id === (currentStatus.id - 1))[0].name;

        try {
            const updatedTask = await updateTask(task.id, task);
            setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
        } catch (error) {
            console.error('Error updating task:', error);
            task.status = currentStatus.name;
        }
    };

    const moveForward = async () => {
        let currentStatus = statusFlow.filter(s => s.name === task.status)[0];
        task.status = statusFlow.filter(s => s.id === (currentStatus.id + 1))[0].name;

        try {
            const updatedTask = await updateTask(task.id, task);
            setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
        } catch (error) {
            console.error('Error updating task:', error);
            task.status = currentStatus.name;
        }
    };

    const editTask = () => {
        setNewTask(task);
        setIsEdit(true)
        setOpenModal(true);
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(task.id);
            setTasks(tasks.filter(t => t.id !== task.id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    useEffect(() => {
        validateButtons();
    }, []);

    useEffect(() => {
        validateButtons();
    }, [task.status]);

    const validateButtons = () => {
        if (statusFlow.filter(s => s.name === task.status)[0].id === 1) {
            setIsBackButtonDisabled(true);
        }

        if (statusFlow.filter(s => s.name === task.status)[0].id === 4) {
            setIsForwardButtonDisabled(true);
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="task-container ">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className='w-100 d-flex justify-content-space-between'>
                    <button
                        onClick={moveBack}
                        disabled={isBackButtonDisabled}
                        className='card-button'
                    >
                        <FaArrowLeft color={isBackButtonDisabled ? 'gray' : 'black'} size={16} />
                    </button>

                    <button
                        onClick={editTask}
                        className='card-button'
                    >
                        <MdEdit size={16} />
                    </button>

                    <button
                        onClick={handleDeleteTask}
                        className='card-button'
                    >
                        <MdDelete size={16} color='red' />
                    </button>

                    <button
                        onClick={moveForward}
                        disabled={isForwardButtonDisabled}
                        className='card-button'
                    >
                        <FaArrowRight color={isForwardButtonDisabled ? 'gray' : 'black'} size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;