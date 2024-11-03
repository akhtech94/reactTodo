import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [highestKey_task, setHighestKey_task] = useState(0);
  const [indexOfTaskToBeEdited, setIndexOfTaskToBeEdited] = useState();
  const [viewConfirmationButtons, setViewConfirmationButtons] = useState(false);
  const [taskToBeDeleted, setTaskToBeDeleted] = useState();

  const isServerRunning = true;

  const promiseCallBack = (resolve, reject) => {
    setTimeout(() => {
      if (isServerRunning) {
        resolve([{kay: 1, value: "Task 1"}, {kay: 2, value: "Task 2"}]);
      } else {
        reject("Server is not running");
      }
    }, [3000]);
  };

  const netWorkCall_promise = async () => {
    // const promiseObject = new Promise(promiseCallBack);
    // promiseObject.then((data) => {setTaskList(data)}).catch((error) => {console.log(error)})
    try {
      const url = ''
      const result = await fetch(url)
      setTaskList(result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    netWorkCall_promise();
  }, []);

  const handleInputChange = (event) => {
    setTask(event.target.value);
  };

  const handleEditOrAdd = (event) => {
    if (!indexOfTaskToBeEdited && indexOfTaskToBeEdited !== 0) {
      if (task !== "") {
        const taskList_copy = [...taskList];
        taskList_copy.push({ value: task, key: highestKey_task + 1 });
        setHighestKey_task(highestKey_task + 1);
        setTaskList(taskList_copy);
        setTask("");
      }
    } else {
      const taskToBeModified = taskList[indexOfTaskToBeEdited];
      const taskList_copy = [...taskList];
      taskList_copy.splice(indexOfTaskToBeEdited, 1, {
        value: task,
        key: taskToBeModified.key,
      });
      setTaskList(taskList_copy);
      setIndexOfTaskToBeEdited(undefined);
      setTask("");
    }
  };

  const deletionHandler = () => {
    const modifiedTaskList = taskList.filter((item) => {
      return taskToBeDeleted.key !== item.key;
    });
    setTaskList(modifiedTaskList);
    setViewConfirmationButtons(false);
  };

  const deletionConfirmationHandler = (itemToBeDeleted) => {
    setTaskToBeDeleted(itemToBeDeleted);
    setViewConfirmationButtons(true);
  };

  const deletionCancelationHandler = () => {
    setTaskToBeDeleted(undefined);
    setViewConfirmationButtons(false);
  };

  const editHandler = (item) => {
    const modifiedTaskList = [...taskList];
    const indexOfItemToBeEdited = modifiedTaskList.indexOf(item);
    setTask(item.value);
    setIndexOfTaskToBeEdited(indexOfItemToBeEdited);
    // modifiedTaskList.splice(indexOfItemToBeEdited, 1, editedTask);
  };

  return (
    <div>
      <h3>To do app</h3>
      <input type="text" onChange={handleInputChange} value={task} />
      <input
        type="button"
        onClick={handleEditOrAdd}
        value={
          indexOfTaskToBeEdited || indexOfTaskToBeEdited === 0
            ? "Edit"
            : "Add a task"
        }
      />
      {taskList.map((item, index) => {
        return (
          <p key={item.key}>
            {item.value}
            <input
              className="button"
              type="button"
              onClick={(event) => deletionConfirmationHandler(item)}
              value="Delete"
            />
            <input
              type="button"
              onClick={(event) => editHandler(item)}
              value="Edit"
            />
          </p>
        );
      })}
      {viewConfirmationButtons ? (
        <>
          <p>Are you sure?</p>
          <input type="button" onClick={deletionHandler} value="Proceed" />
          <input
            type="button"
            onClick={deletionCancelationHandler}
            value="Cancel"
          />
        </>
      ) : null}
    </div>
  );
}

export default App;
