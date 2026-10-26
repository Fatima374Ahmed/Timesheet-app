import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getWeekDetails } from "../api/timesheets"
import Header from "./header";
import AddNewEntryModal from "../modals/addTask";
import EditModal from "../modals/editTask";
import DeleteModal from "../modals/deleteTask";
import type { EntryData } from "../modals/addTask";

interface Task {
  id: number;
  title: string;
  hours: number;
  project: string;
}

interface Day {
  date: string;
  tasks: Task[];
}

interface WeekDetailData {
  week: number;
  totalHours: number;
  maxHours: number;
  days: Day[];
  date: string
}


const WeekDetail = () => {
  // const { weekId } = useParams();
  const location = useLocation();

  // const mode = location.state?.mode || "View";

  const [weekDetail, setWeekDetail] = useState<WeekDetailData | null>(null);
  const [openMenu, setOpenMenu] = useState<any>();

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // const { startDate, endDate } = location.state || {};
   const { startDate, endDate, mode, days: initialDays, id } = location.state || {};
  // const [addData, setAddData] = useState<EntryData | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [index, setIndex] = useState<string>('');
  const [editDetails, setEditDetails] = useState<string>('');

  const [days, setDays] = useState(initialDays || []);

 useEffect(() => {
  if (startDate && endDate) {
    let data = { startDate, endDate, mode, days }
    console.log('data***', data)
    getWeekDetails(startDate, endDate).then((data: any) => {
      setWeekDetail(data);
      console.log('days', days)
    });
  }
}, [startDate, endDate]);


useEffect(() => {
  if (startDate && endDate) {
    getWeekDetails(startDate, endDate).then((data) =>
      setWeekDetail(data as WeekDetailData)
    );
  }
}, [startDate, endDate]);

  const totalHours = days.reduce((total: any, day: any) => {
    return total + day.tasks.reduce((dayTotal: any, task: any) => {
      return dayTotal + task.hours;
    }, 0);
  }, 0);

  const handleAddTask = (dayDate: string, index: any) => {
    setIndex(index)
    setDate(dayDate)
    
      setOpenModal(true)
   
  };

  const handleEditTask = (dayDate: string, index: any, taskIndex: any) => {
   
    setIndex(index)
      setDate(dayDate)
    
      setOpenEditModal(true)
     
      console.log('days', days[index].tasks[taskIndex])
      setEditDetails(days[index].tasks[taskIndex])
      //  setOpenMenu(null);
   
  };

  const handleDeleteTask = (dayDate: string, index: any, taskIndex: any) => {
   
      setIndex(index)
      setDate(dayDate)
    
      setOpenDeleteModal(true)
     
      console.log('days', days[index].tasks[taskIndex])
      // setEditDetails(days[index].tasks[taskIndex])
      //  setOpenMenu(null);
   
  };

  const addTask = async (data: any) => {
      if (!weekDetail) return;
     console.log('addData', data)

    const newTask = {
      id: Date.now(),
      title: data.workType,
      hours: data.hours,
      project: data.project,
      description: data.description
    };

    try {
      const response = await fetch(
        `http://localhost:3000/timesheet/${id}/day/${days[index].date}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: data.description,
            hours: Number(data.hours),
            project: data.project,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add task");
      }

      console.log("Task added:", result);
      alert("Task added successfully!");

      days[index].tasks.push({
        description: data.description,
        hours:data.hours,
        project:data.project
      })

      // setDescription("");
      // setHours("");
      // setProject("");
    } catch (error) {
      console.error("Error:", error);
    }

    console.log('newTask', newTask)
    console.log('days', days)
    
    setWeekDetail((prevWeekDetail: any) => {
  const updatedDays = prevWeekDetail.days.map((day: any) =>
    day.date === date
      ? {
          ...day,
          tasks: [...day.tasks, newTask],
        }
      : day
  );

  const updatedWeek = {
    ...prevWeekDetail,
    days: updatedDays,
  };
  days.tasks = updatedDays
  console.log("clicked dayDate:", date);
console.log("available dates:", weekDetail.days.map(d => d.date));

  console.log('updatedWeekDetail', updatedWeek); // ✅ correct updated value

  return updatedWeek;
});

    console.log('weekDetail', weekDetail)
  }

  const editTask = async (data: any, index: any, taskIndex: any) => {
    if (!weekDetail || !editDetails) return;
    
    const taskId = days[index].tasks[taskIndex]._id;
    const dayDate = days[index].date;

    try {
      const response = await fetch(
        `http://localhost:3000/timesheet/${id}/day/${dayDate}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: data.description,
            hours: Number(data.hours),
            project: data.project,
          }),
        }
      );

      const result = await response.json();
      setOpenMenu(null)
      if (!response.ok) {
        throw new Error(result.message || "Failed to update task");
      }

      console.log("Task updated:", result);

      // Update React state after successful API response
      // setWeekDetail((prevWeekDetail: any) => {
      //   if (!prevWeekDetail) return prevWeekDetail;

      //   const updatedDays = prevWeekDetail.days.map((day: any) => {
      //     if (day.date !== dayDate) return day;

      //     return {
      //       ...day,
      //       tasks: day.tasks.map((task: any) =>
      //         task._id === taskId
      //           ? {
      //               ...task,
      //               description: data.description,
      //               hours: Number(data.hours),
      //               project: data.project,
      //             }
      //           : task
      //       ),
      //     };
      //   });

      //   return {
      //     ...prevWeekDetail,
      //     days: updatedDays,
      //   };
      // });

      setDays((prevDays: any[]) =>
        prevDays.map((day, dayIndex) =>
          dayIndex === index
            ? {
                ...day,
                tasks: day.tasks.map((task: any) =>
                  task._id === days[index].tasks[taskIndex]._id
                    ? {
                        ...task,
                        description: data.description,
                        hours: Number(data.hours),
                        project: data.project,
                      }
                    : task
                ),
              }
            : day
        )
      );

      setOpenEditModal(false);
      setEditDetails('');

      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  const deleteTask = async (data: any, index: any, taskIndex: any) => {
    // if (!weekDetail || !editDetails) return;
    
    const taskId = days[index].tasks[taskIndex]._id;
    const dayDate = days[index].date;

    try {
      const response = await fetch(
        `http://localhost:3000/timesheet/${id}/day/${dayDate}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: data.description,
            hours: Number(data.hours),
            project: data.project,
          }),
        }
      );

      const result = await response.json();
      setOpenMenu(null)

      if (!response.ok) {
      throw new Error(result.message || "Failed to delete task");
    }

    // Update the UI after successful deletion
    setDays((prevDays: any[]) =>
      prevDays.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              tasks: day.tasks.filter(
                (t: any) => t._id !== taskId
              ),
            }
          : day
      )
    );

    alert("Task deleted successfully!");

      
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    }
  };

  if (!weekDetail) return <div className="p-8">Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header/>
          <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-sm mt-4">
          {/* Header */}
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">This week&apos;s timesheet</h1>
              <p className="text-gray-500 mt-2">Week {weekDetail.date}</p>
            </div>

            <div className="w-52">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  {totalHours}/{weekDetail.maxHours} hrs
                </span>
                <span>
                  {Math.round(
                    (weekDetail.totalHours / weekDetail.maxHours) * 100
                  )}
                  %
                </span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-orange-400 rounded-full"
                  style={{
                    width: `${
                      (weekDetail.totalHours / weekDetail.maxHours) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Days */}
         {days.map((day: any, index: number) => (
            <div key={day.date}>
              <h2 className="font-semibold text-lg mb-3">{day.date}</h2>

              <div className="space-y-3">
                {day.tasks.map((task: any, taskIndex: number) => {
                
                  const menuKey = `${day.date}-${task._id ?? task.id ?? taskIndex}`;
                  return (
                    <div
                      key={task.id}
                      className="border rounded-lg px-4 py-3 flex justify-between items-center"
                    >
                      <div>{task.description}</div>

                      <div className="flex items-center gap-4 relative">
                        <span className="text-gray-500">
                          {task.hours} hrs
                        </span>

                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {task.project}
                        </span>

                        {mode !== "View" && (
                          <button
                            onClick={() =>
                              setOpenMenu(openMenu === menuKey ? null : menuKey)
                            }
                            className="font-bold"
                          >
                            ...
                          </button>
                        )}

                        {openMenu === menuKey && (
                          <div className="absolute top-10 right-0 bg-white shadow-lg border rounded-lg w-24 z-20">
                            <button
                              onClick={() => handleEditTask(day.date, index, taskIndex)}
                                // Add your edit handler here
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Edit
                            </button>

                             {openEditModal && (
                                <EditModal
                                  editDetails={editDetails}
                                  onClose={() => setOpenEditModal(false)}
                                  onSubmit={(task) => editTask(task, index, taskIndex)}
                                />
                              )}

                            <button
                              onClick={() => {
                                // setOpenMenu(null);
                                handleDeleteTask(day.date, index, taskIndex);
                              }}
                              className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                            >
                              Delete
                            </button>

                            {openDeleteModal && (
                                <DeleteModal                  
                                  onClose={() => setOpenDeleteModal(false)}
                                  onSubmit={(task) => deleteTask(task, index, taskIndex)}
                                />
                              )}

                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {totalHours !== 40 && (
                  <button
                    onClick={() => handleAddTask(day.date, index)}
                    className="w-full border-2 border-dashed border-blue-300 rounded-lg py-3 text-blue-500 hover:bg-blue-50"
                  >
                    + Add new task
                  </button>
                )}

                {openModal && (
                  <AddNewEntryModal
                    onClose={() => setOpenModal(false)}
                    onSubmit={(task) => addTask(task)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>

  );
};

export default WeekDetail;