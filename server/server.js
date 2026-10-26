import express from 'express';
import cors from 'cors';
import TimesheetRoutes from './routes/timesheetRoute.js'
import './db.js'
import passport from 'passport'
import LocalStrategy from 'passport-local'

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/timesheet', TimesheetRoutes)
app.listen(3000, () => {
    console.log('Server running on port 3000');
});