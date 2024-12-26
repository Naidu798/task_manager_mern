import React from "react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import ENDPOINT from "../common";

const DialogForm = ({
  setShowDialogForm,
  showDialogForm,
  taskDetails,
  setTaskDetails,
  setTodosList,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({ ...prev, [name]: value }));
  };

  const onCloseDailogForm = () => {
    setShowDialogForm({ open: false, isEdit: false });
    setTaskDetails({
      name: "",
      description: "",
      dueDate: "",
      status: "Pending",
      priority: "Low",
    });
  };

  const handlePriority = (e) => {
    setTaskDetails((prev) => ({ ...prev, priority: e.target.value }));
  };

  const addTask = async () => {
    try {
      const res = await fetch(ENDPOINT.task.add, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDetails),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTaskDetails({
          taskName: "",
          taskDescription: "",
          dueDate: "",
          status: "Pending",
          priority: "Low",
        });

        setTodosList((prev) => [...prev, data.data]);
        setShowDialogForm({ open: false, isEdit: false });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = async (taskId) => {
    try {
      const res = await fetch(ENDPOINT.task.update, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDetails),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTodosList((prev) =>
          prev.map((task) => {
            if (taskId === task._id) {
              return data.data;
            } else {
              return task;
            }
          })
        );
        setShowDialogForm({ open: false, isEdit: false });
        setTaskDetails({
          name: "",
          description: "",
          dueDate: "",
          status: "Pending",
          priority: "Low",
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, dueDate } = taskDetails;

    if (
      name.trim() === "" ||
      description.trim() === "" ||
      dueDate.trim() === ""
    ) {
      toast.error("Plese enter task details");
    } else {
      if (showDialogForm.isEdit) {
        updateTask(taskDetails?._id);
      } else {
        addTask();
      }
    }
  };

  const handleStatus = (e) => {
    setTaskDetails((prev) => ({ ...prev, status: e.target.value }));
  };

  return (
    <div className="bg-[#0d243b] px-5 py-3 absolute top-[20%] left-[15%] md:left-[40%] md:h-[64vh] md:w-[25vw] h-[28vh] w-[70vw] rounded-lg z-20">
      <div className="flex items-center justify-between">
        <h3 className="font-normal text-xl">
          {taskDetails ? "Edit Task" : "Create Task"}
        </h3>
        <RxCross2 className="text-2xl" onClick={onCloseDailogForm} />
      </div>
      <hr className="h-0.5 border-red-300 mt-3" />
      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="test-white font-bold -mb-2">Task Name : </label>
        <input
          className="h-8 w-full rounded-md text-gray-900 outline-none px-3 bg-gray-300 pb-0.5"
          type="text"
          placeholder="Task name"
          name="name"
          value={taskDetails?.name}
          onChange={(e) => handleChange(e)}
        />
        <label className="test-white font-bold -mb-2">
          Task Description :{" "}
        </label>
        <input
          className="h-8 w-full rounded-md text-gray-900 outline-none px-3 bg-gray-300 pb-0.5"
          type="text"
          name="description"
          placeholder="Description"
          value={taskDetails?.description}
          onChange={(e) => handleChange(e)}
        />
        <label className="test-white font-bold -mb-2">Due Date : </label>
        <input
          className="h-8 w-full rounded-md text-gray-900 outline-none px-3 bg-gray-300 pb-0.5"
          type="text"
          placeholder="Due Date"
          name="dueDate"
          value={taskDetails?.dueDate}
          onChange={(e) => handleChange(e)}
        />
        <p className="text-red-300 text-[10px] -mt-3">
          {"*Please the enter date { MM/DD/YYYY } this format only"}
        </p>

        {showDialogForm.isEdit && (
          <div className="flex items-start gap-5 w-full">
            <label className="test-white font-bold -mb-2 w-[30%]">
              Status :{" "}
            </label>
            <select
              className="h-7 text-md rounded-md text-gray-900 font-semibold outline-none px-3 bg-gray-300 pb-0.5 w-[70%]"
              onChange={handleStatus}
              defaultValue={
                showDialogForm.isEdit ? taskDetails?.status : "Pending"
              }
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        <div className="flex items-start gap-5 w-full">
          <label className="test-white font-bold -mb-2 w-[30%]">
            Priority :{" "}
          </label>
          <select
            className="h-7 text-md rounded-md text-gray-900 font-semibold outline-none px-3 bg-gray-300 pb-0.5 w-[70%]"
            onChange={handlePriority}
            defaultValue={showDialogForm.isEdit ? taskDetails?.priority : "Low"}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          className="bg-blue-700 rounded-md py-1.5 px-6 text-md mt-3 self-end"
          // onClick={console.log(taskDetails)}
          type="submit"
        >
          {showDialogForm?.isEdit ? "Save" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default DialogForm;
