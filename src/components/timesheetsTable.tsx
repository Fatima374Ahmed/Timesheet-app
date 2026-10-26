import { useEffect, useState } from "react";
import { getTimesheets } from "../api/timesheets";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./header";
const statusStyles: any = {
  COMPLETED: "bg-[#DEF7EC] text-[#03543F]",
  INCOMPLETE: "bg-[#FDF6B2] text-[#723B13]",
  MISSING: "bg-[#FCE8F3] text-[#99154B]",
};
    type Timesheet = {
        week: number;
        date: string;
        startDate: string;
        endDate: string;
        status: string;
        action?: string;
    };

    type DateRangeType = {
      startDate: Date;
      endDate: Date;
      key: string;
    } | null;
export default function TimesheetsTable() {

  const [data, setData] = useState<Timesheet[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [dateRange, setDateRange] = useState<DateRangeType[] | null>(null);
  
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const res: any = await getTimesheets();
  //       setData(res);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const [timesheets, setTimesheets] = useState<any[]>([]);
  useEffect(() => {
  const getTimesheets = async () => {
    try {
      const response = await fetch('http://localhost:3000/timesheet');

      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }

      const data = await response.json();

      console.log('timesheets', data);
     
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  getTimesheets();
}, []);

  
  const filteredData = useMemo(() => {
  return data.filter((item) => {
    const statusMatch =
      !statusFilter || item.status === statusFilter;

    const selectedStart = dateRange?.[0]?.startDate;
    const selectedEnd = dateRange?.[0]?.endDate;

    // 👉 NO DATE FILTER APPLIED (initial load case)
    if (!selectedStart || !selectedEnd) {
      return statusMatch;
    }

    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    const dateMatch =
      start <= selectedEnd &&
      end >= selectedStart;

    return statusMatch && dateMatch;
  });
}, [data, statusFilter, dateRange]);

const totalItems = filteredData.length;
const totalPages = Math.ceil(totalItems / pageSize);

const paginatedData = useMemo(() => {
  return filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
}, [filteredData, currentPage, pageSize]);

useEffect(() => {
  setCurrentPage(1);
  console.log('paginatedData', paginatedData)
}, [statusFilter, dateRange, pageSize]);

  const getPageNumbers = () => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
};

const weekDetail = async (item: any) => {
  console.log("CLICKED ITEM:", JSON.stringify(item, null, 2));
  
  navigate(`/weekDetail?id=${item._id}`, {
    state: {
      startDate: item.startDate,
      endDate: item.endDate,
      mode: item.status,
      days: item.days,
      id: item._id
    },
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HEADER */}
      <Header/>
      

      {/* CONTENT */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm py-6 mx-[8.8rem]">
          
          {/* TITLE */}
          <h2 className="text-[24px] text-[#111928] font-bold mb-4 text-left pl-[1.5rem]">
            Your Timesheets
          </h2>

          {/* FILTERS */}
          <div className="flex gap-3 mb-4 ml-[1.5rem]">
            <div className="relative bg-[#EFEFEF]">
              <button
                className="border rounded-lg px-3 py-2 text-sm text-gray-600"
                onClick={() => setOpenCalendar(!openCalendar)}
              >
                {dateRange?.[0]?.startDate && dateRange?.[0]?.endDate ? (
                  <div>
                    {dateRange[0].startDate.toDateString()} -{" "}
                    {dateRange[0].endDate.toDateString()}
                  </div>
                ) : (
                  <div>Date Range</div>
                )}
              </button>

              {openCalendar && (
                <div className="absolute z-50 mt-2">
                  <DateRange
                    ranges={dateRange || [
                      {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: "selection",
                      },
                    ]}
                    onChange={(item: any) => setDateRange([item.selection])}
                  />
                </div>
              )}
            </div>

            <select className="border rounded-lg px-3 py-2 text-sm text-gray-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Missing">Missing</option>
            </select>
          </div>

          {loading && (
              <div className="text-center text-[18px] text-gray-600">Loading timesheets...</div>
            )}

          {paginatedData.length == 0 && !loading &&(
              <div className="text-center text-[18px] text-gray-600">No timesheets Found</div>
            )}

          {/* TABLE */}
          {!loading && paginatedData.length > 0 && (
            <div className="overflow-hidden border rounded-lg mx-[1.5rem]">
              <table className="w-full table-fixed text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-4 py-3 w-[6.6rem]">WEEK #</th>
                    <th className="px-4 py-3 w-1/3">DATE ↓</th>
                    <th className="px-4 py-3 text-center w-1/3">STATUS ↓</th>
                    <th className="px-4 py-3 text-right w-1/3">ACTIONS</th>
                  </tr>
                </thead>
        
                  <tbody>
                  {paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 h-[3.375rem]"
                    >
                      <td className="px-4 py-3 text-left pl-8 bg-[#F9FAFB]">{index+1}</td>

                      <td className="px-4 py-3 text-gray-600 text-left">
                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.status === 'Incomplete'
                              ? 'text-[#723B13] bg-[#FDF6B2]'
                              : item.status === 'Completed'
                              ? 'text-[#03543F] bg-[#DEF7EC]'
                              : item.status === 'Missing'
                              ? 'text-[#99154B] bg-[#FCE8F3]'
                              : ''
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right pr-8">
                        <button className="text-[#1C64F2] hover:underline text-sm" onClick={() => weekDetail(item)}>
                          {item.status == 'Incomplete' && (
                            <span>Update</span>
                          )}

                          {item.status == 'Completed' && (
                            <span>View</span>
                          )}

                          {item.status == 'Missing' && (
                            <span>Create</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              
              
              </table>
            </div>
          )}

          {/* FOOTER */}
          {!loading && paginatedData.length > 0 &&(
            <div className="flex items-center justify-between mt-4 mx-[1.5rem]">
  
              {/* Page size selector */}
              <select
                className="border rounded-lg px-2 py-1 text-sm text-gray-600"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>

                {getPageNumbers().map((n: any) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-2 py-1 rounded ${
                      currentPage === n ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>

              </div>
            </div>
          )}
          
        </div>

        {/* FOOTER TEXT */}
        <div className="mt-6 bg-white rounded-xl p-4 text-center text-sm text-gray-400 mx-[8.8rem]">
          © 2024 tentwenty. All rights reserved.
        </div>
      </div>
    </div>
  );
}