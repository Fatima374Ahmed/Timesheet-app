import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getWeekDetails } from "../api/timesheets"
import Header from "./header";
import AddNewEntryModal from "../modals/addTask";
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

  const mode = location.state?.mode || "View";

  const [weekDetail, setWeekDetail] = useState<WeekDetailData | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const { startDate, endDate } = location.state || {};

  // const [addData, setAddData] = useState<EntryData | null>(null);
  const [date, setDate] = useState<string | null>(null);

 useEffect(() => {
  if (startDate && endDate) {
    getWeekDetails(startDate, endDate).then((data: any) => {
      setWeekDetail(data);
      console.log('data', data)
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

  const handleDeleteTask = (dayDate: string, taskId: number) => {
    if (!weekDetail) return;

    const updatedDays = weekDetail.days.map((day) =>
      day.date === dayDate
        ? {
            ...day,
            tasks: day.tasks.filter((task) => task.id !== taskId),
          }
        : day
    );

    setWeekDetail({
      ...weekDetail,
      days: updatedDays,
    });
  };

  const handleAddTask = (dayDate: string) => {
  console.log('daydate **', dayDate)
    setDate(dayDate)
   
    setOpenModal(true)
   
  };

  const addTask = (data: any) => {
    
    // setAddData(data)

      if (!weekDetail) return;
     console.log('addData', data)

      const newTask = {
      id: Date.now(),
      title: data.workType,
      hours: data.hours,
      project: data.project,
    };

    
    // const updatedDays = weekDetail.days.map((day) =>
    //   day.date === date
    //     ? {
    //         ...day,
    //         tasks: [...day.tasks, newTask],
    //       }
    //     : day
    // );

    // setWeekDetail({
    //   ...weekDetail,
    //   days: updatedDays,
    // });

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

  console.log("clicked dayDate:", date);
console.log("available dates:", weekDetail.days.map(d => d.date));

  console.log('updatedWeekDetail', updatedWeek); // ✅ correct updated value

  return updatedWeek;
});

    console.log('weekDetail', weekDetail)
  }

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
                  {weekDetail.totalHours}/{weekDetail.maxHours} hrs
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
          <div className="space-y-8">
            {weekDetail.days.map((day) => (
              <div key={day.date}>
                <h2 className="font-semibold text-lg mb-3">{day.date}</h2>

                <div className="space-y-3">
                  {day.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg px-4 py-3 flex justify-between items-center"
                    >
                      <div>{task.title}</div>

                      <div className="flex items-center gap-4 relative">
                        <span className="text-gray-500">{task.hours} hrs</span>

                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {task.project}
                        </span>

                        {mode !== "View" && (
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === task.id ? null : task.id
                              )
                            }
                            className="font-bold"
                          >
                            ...
                          </button>
                        )}

                        {openMenu === task.id && (
                          <div className="absolute top-10 right-0 bg-white shadow-lg border rounded-lg w-24 z-20">
                            <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteTask(day.date, task.id)
                              }
                              className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {mode !== "View" && (
                    <button
                      onClick={() =>  handleAddTask(day.date)}
                      className="w-full border-2 border-dashed border-blue-300 rounded-lg py-3 text-blue-500 hover:bg-blue-50"
                    >
                      + Add new task
                    </button>
                  )}

                  {openModal && (
                    <AddNewEntryModal
                      onClose={() => setOpenModal(false)}
                      onSubmit={(data) => addTask(data)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </>

  );
};

export default WeekDetail;