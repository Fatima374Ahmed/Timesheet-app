

// import Footer from './components/footer.tsx'
import Login from "./components/login";
import TimesheetsTable from "./components/timesheetsTable";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Authentication/protectedRoute";
import WeekDetail from "./components/weekDetail";
import Header from "./components/header";
import './App.css'

function App() {
  

  return (
    <>

    <Routes>
      <Route path="/" element={<Login />} />
       <Route
          path="/timesheet"
          element={
            <ProtectedRoute>
              <TimesheetsTable />
            </ProtectedRoute>
          }
        />
         <Route
          path="/weekDetail"
          element={
            <ProtectedRoute>
              <WeekDetail/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/header"
          element={
            <ProtectedRoute>
              <Header/>
            </ProtectedRoute>
          }
        />
    </Routes>
    
    </>
  )
}

export default App
