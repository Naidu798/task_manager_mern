import React from "react";
import { MdModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import ENDPOINT from "../common";
import toast from "react-hot-toast";

const TaskItem = ({
  task,
  setShowDialogForm,
  setTaskDetails,
  setTodosList,
}) => {
  const getTaskStatus = (status) => {
    if (status === "Pending") {
      return (
        <span className="text-gray-300 text-xs border border-gray-300 py-0.5 px-2 rounded-full">
          PENDING
        </span>
      );
    } else if (status === "Completed") {
      return (
        <span className="text-green-500 text-xs border border-green-500 py-0.5 px-2 rounded-full">
          COMPLETED
        </span>
      );
    } else {
      return (
        <span className="text-yellow-500 text-xs border border-yellow-500 py-0.5 px-2 rounded-full">
          IN PROGRESS
        </span>
      );
    }
  };

  const getDateFormat = (date) => {
    const dataObj = new Date(date);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return dataObj.toLocaleDateString("en-US", options);
  };

  const isExpired = (date) => {
    const dateObj = new Date(date);
    const currentDate = new Date();

    const isExpired = currentDate > dateObj;

    return isExpired;
  };

  const editTask = (task) => {
    setShowDialogForm({ open: true, isEdit: true });
    setTaskDetails(task);
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${ENDPOINT.task.delete}/${taskId}`, {
        credentials: "include",
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTodosList((prev) => prev.filter((task) => task._id !== taskId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const completeTask = async (task) => {
    try {
      const res = await fetch(ENDPOINT.task.update, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, status: "Completed" }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTodosList((prev) =>
          prev.map((taskItem) => {
            if (taskItem._id === task._id) {
              return data.data;
            } else {
              return taskItem;
            }
          })
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <li className="bg-[#2f4e87] rounded-md px-2 py-2 text-lg my-3 relative">
        <div className="flex items-start md:items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-start md:items-center md:gap-3">
            <p className="text-xl font-semibold">
              * {task?.name}{" "}
              <span className="text-sm text-gray-200">
                ( {task?.priority} )
              </span>
            </p>
          </div>
          <div className="flex items-center gap-6 pr-2">
            {!isExpired(task?.dueDate) && (
              <MdModeEditOutline
                className="text-xl hover:scale-125"
                onClick={() => editTask(task)}
              />
            )}

            {task?.status !== "Completed" && (
              <FaCheck
                className="text-xl text-green-600 hover:scale-125"
                onClick={() => completeTask(task)}
              />
            )}

            <MdDeleteForever
              className="text-2xl text-red-400 hover:text-red-500"
              onClick={() => deleteTask(task._id)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <p className="pl-5 text-sm text-gray-300 mt-1">{task?.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          {!isExpired(task?.dueDate) ? (
            <p className="text-sm text-orange-300 pl-5 font-bold">
              Expiry Date :{" "}
              <span className="font-normal">
                {getDateFormat(task?.dueDate)}
              </span>
            </p>
          ) : (
            <span className="absolute text-2xl z-20 text-red-400 left-[50%] top-[40%] tracking-widest">
              EXPIRED
            </span>
          )}
          {isExpired(task?.dueDate) ? (
            <div className="text-end w-full">{getTaskStatus(task?.status)}</div>
          ) : (
            getTaskStatus(task?.status)
          )}
        </div>
      </li>
    </div>
  );
};

export default TaskItem;
