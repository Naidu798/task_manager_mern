import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "./TaskItem";
import { IoSearch } from "react-icons/io5";
import DialogForm from "./DialogForm";
import ENDPOINT from "../common";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";

const Home = () => {
  const [todosList, setTodosList] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "Low",
  });
  const [showDialogForm, setShowDialogForm] = useState({
    open: false,
    isEdit: false,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [authUser, setAuthUser] = useState(null);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const res = await fetch(ENDPOINT.task.all, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setTodosList(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    if (searchValue) {
      const filteredTasks = todosList.filter(
        (task) =>
          task.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          task.description.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTasks(filteredTasks);
    } else {
      setFilteredTasks([]);
    }
  };

  const onChangeStatus = (e) => {
    setStatusFilter(e.target.value);
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    if (statusFilter !== "All") {
      const filteredTasks = todosList.filter(
        (task) => task.status === statusFilter
      );
      setFilteredTasks(filteredTasks);
    } else {
      setFilteredTasks([]);
    }
  }, [statusFilter]);

  const getUser = async () => {
    try {
      const res = await fetch(ENDPOINT.auth.user, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAuthUser(data.data);
        return data.data;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const authenticate = async () => {
    const authUser = await getUser();
    if (!authUser) {
      navigate("/login");
    }
  };

  useLayoutEffect(() => {
    authenticate();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(ENDPOINT.auth.logout, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`relative w-screen h-screen flex justify-center items-start pt-5 text-white bg-[#3c6374]`}
    >
      <div
        className={`bg-[#1e1d66] px-3 md:px-6 py-4 rounded-lg w-[90%] h-[95vh] md:w-[60%] lg:w-[50%] relative ${
          showDialogForm.open && "blur"
        }`}
      >
        <h1 className="text-3xl md:text-4xl text-center mb-10 font-bold">
          Task Manager !
        </h1>
        <button
          className="text-white font-bold text-2xl absolute right-10 top-8"
          onClick={logout}
        >
          <FiLogOut />
        </button>
        <div className="flex items-center gap-5">
          <div className="bg-gray-300 rounded-md px-3 h-8 flex items-center gap-2 w-[60%]">
            <IoSearch className="text-black text-xl font-bold" />
            <input
              type="search"
              value={search}
              onChange={handleSearch}
              className="w-full bg-transparent outline-none text-black pb-0.5"
              placeholder="Search task name here ..."
            />
          </div>
          <button
            onClick={() => setShowDialogForm({ open: true, isEdit: false })}
            className="rounded-lg h-8 text-center text-white bg-blue-600 outline-none w-[40%] pb-0.5 hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
        <hr className="border-gray-600 my-3" />
        <div className="flex items-center justify-between">
          <p className="text-2xl text-white font-bold">All Tasks</p>
          <select
            className="h-8 text-md rounded-md text-gray-900 font-semibold outline-none px-3 bg-gray-300 pb-0.5 w-[40%]"
            defaultValue="All"
            onChange={onChangeStatus}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <hr className="border-gray-600 mt-3" />

        <ul className="px-1 md:px-3 h-[65vh] overflow-auto custom-scrollbar">
          {todosList.length > 0 ? (
            search || statusFilter !== "All" ? (
              filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  return (
                    <TaskItem
                      key={task._id}
                      task={task}
                      setShowDialogForm={setShowDialogForm}
                      setTaskDetails={setTaskDetails}
                      setTodosList={setTodosList}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-[55vh]">
                  <span className="text-lg font-normal">No Tasks Found</span>
                </div>
              )
            ) : (
              todosList.map((task) => {
                return (
                  <TaskItem
                    key={task._id}
                    task={task}
                    setShowDialogForm={setShowDialogForm}
                    setTaskDetails={setTaskDetails}
                    setTodosList={setTodosList}
                  />
                );
              })
            )
          ) : (
            <div className="flex justify-center items-center h-[55vh]">
              <span className="text-lg font-normal">No Tasks Here</span>
            </div>
          )}
        </ul>
      </div>
      {showDialogForm.open && (
        <DialogForm
          setShowDialogForm={setShowDialogForm}
          showDialogForm={showDialogForm}
          taskDetails={taskDetails}
          setTaskDetails={setTaskDetails}
          setTodosList={setTodosList}
        />
      )}
    </div>
  );
};

export default Home;
