type Status = "COMPLETED" | "INCOMPLETE" | "MISSING";

export const getStatus = (totalHours: number): Status => {
  if (totalHours === 0) return "MISSING";
  if (totalHours < 40) return "INCOMPLETE";
  return "COMPLETED";
};

const getAction = (hours: number) => {
  if (hours === 0) return "Create";
  if (hours < 40) return "Update";
  return "View";
};

export const getTimesheets = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          week: 1,
          date: "1 - 5 January, 2024",
          startDate: "2024-01-01",
          endDate: "2024-01-05",
          totalHours: 32,
          status: getStatus(32),
          action: getAction(32)
          
         },
        {
          week: 2,
          date: "8 - 12 January, 2024",
          startDate: "2024-01-08",
          endDate: "2024-01-12",
          totalHours: 40,
          status: getStatus(40),
          action: getAction(40)
        },
        {
          week: 3,
          date: "15 - 19 January, 2024",
          startDate: "2024-01-15",
          endDate: "2024-01-19",
          totalHours: 28,
          status: getStatus(28),
          action: getAction(28)
        },
        {
          week: 4,
          date: "22 - 26 January, 2024",
          startDate: "2024-01-22",
          endDate: "2024-01-26",
          totalHours: 0,
          status: getStatus(0),
          action: getAction(0)
        },
        {
          week: 5,
          date: "28 January - 1 February, 2024",
          startDate: "2024-01-28",
          endDate: "2024-02-01",
          totalHours: 40,
          status: getStatus(40),
          action: getAction(40)
        },
        {
          week: 6,
          date: "3 - 7 February, 2024",
          startDate: "2024-02-03",
          endDate: "2024-02-07",
          totalHours: 0,
          status: getStatus(0),
          action: getAction(0)
        },
      ]);
    }, 500);
  });
};

const generateDays = (start: string, end: string) => {
  const days = [];
  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

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

export interface WeekDetailData {
  totalHours: number;
  maxHours: number;
  days: Day[];
}


// export const getWeekDetails = async (
//   startDate: string,
//   endDate: string
// ): Promise<WeekDetailData> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
        
//       const daysArray = generateDays(startDate, endDate);

//       const days = daysArray.map((date, index) => ({
//         date: date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         }),
//         tasks: [
//           {
//             id: index * 2 + 1,
//             title: "Homepage Development",
//             hours: this.getTimesheets.totalHours,
//             project: "Project Name",
//           },
//           {
//             id: index * 2 + 2,
//             title: "Homepage Development",
//             hours: 4,
//             project: "Project Name",
//           },
//         ],
//       }));

//       const totalHours = days.reduce(
//         (sum, day) =>
//           sum +
//           day.tasks.reduce((tSum, t) => tSum + t.hours, 0),
//         0
//       );

//       resolve({
//         totalHours,
//         maxHours: 40,
//         days,
//       });
//     }, 500);
//   });
// };

export const getWeekDetails = async (
  startDate: string,
  endDate: string
): Promise<WeekDetailData> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const timesheets: any = await getTimesheets();

      const currentWeek = timesheets.find(
        (t: any) =>
          t.startDate === startDate &&
          t.endDate === endDate
      );

      const weekHours = currentWeek?.totalHours || 0;

      const daysArray = generateDays(startDate, endDate);

      const days = daysArray.map((date, index) => ({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        tasks: [
          {
            id: index * 2 + 1,
            title: "Homepage Development",
            hours: weekHours / 10,
            project: "Project Name",
          },
          {
            id: index * 2 + 2,
            title: "Homepage Development",
            hours: weekHours / 10,
            project: "Project Name",
          },
        ],
      }));

      const totalHours = days.reduce(
        (sum, day) =>
          sum +
          day.tasks.reduce((tSum, t) => tSum + t.hours, 0),
        0
      );

      resolve({
        totalHours,
        maxHours: 40,
        days,
      });
    }, 500);
  });
};