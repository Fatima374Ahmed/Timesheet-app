import express from 'express';
const Router = express.Router()
import Timesheet from '../models/timesheet.js'
import { getTimesheets, getTimesheetsStatus } from '../controllers/timesheetController.js';

Router.post('/', async(req, res) => {
    try{
         const { userId, startDate, endDate, status, hours, days } = req.body;

        // Check for overlapping timesheet
        const existingTimesheet = await Timesheet.findOne({
            userId: userId,
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
        });

        if (existingTimesheet) {
            return res.status(409).json({
                error: 'This timesheet overlaps with an existing timesheet.'
            });
        }

        const sheet = new Timesheet({
            userId,
            startDate,
            endDate,
            status,
            hours,
            days
        });

        const savedSheet = await sheet.save();

        res.status(201).json(savedSheet);

    } catch (error) {
        console.error('full error',error);
        console.log('code', error.code)
        if(error.code == 11000){
            res.status(409).json({error: 'Timesheet already exists'})
        }

        else{
            res.status(500).json({ error: error.message });
        }
    }

})

Router.get('/', getTimesheets)

Router.get('/:status', getTimesheetsStatus)

Router.get('/:id', async(req, res) => {
    try {
        const id = req.params.id
        const timesheets = await Timesheet.find({id: id})
        res.status(200).json(timesheets)

    } catch(error) {
        res.status(500).json({ error: error.message });

    }
})

Router.patch('/:id', async(req, res) => {
    try {
        const id = req.params.id
        const updatedSheet = req.body

        const response = await Timesheet.findByIdAndUpdate(id, updatedSheet, {
            new: true,
            runValidators: true
        })
        console.log('data updated')
        res.status(200).json(response)

    } catch(error) {
        res.status(500).json({ error: error.message });

    }
})

Router.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id
        const response = await Timesheet.findByIdAndDelete(id)
        console.log('data deleted')
        res.status(200).json(response)

    } catch(error) {
        res.status(500).json({ error: error.message });

    }
})

Router.post("/:timesheetId/day/:date/tasks", async (req, res) => {
  try {
    const { timesheetId, date } = req.params;
    const { description, hours, project } = req.body;

    if (!description || !hours || !project) {
      return res.status(400).json({
        message: "description, hours and project are required"
      });
    }

    const timesheet = await Timesheet.findById(timesheetId);

    if (!timesheet) {
      return res.status(404).json({
        message: "Timesheet not found"
      });
    }

    const day = timesheet.days.find(
      (day) => day.date === date
    );

    if (!day) {
      return res.status(404).json({
        message: "Day not found in this timesheet"
      });
    }

    if (hours <= 0) {
        return res.status(400).json({
            message: "Hours must be greater than 0"
        });
    }

    day.tasks.push({
      description,
      hours,
      project
    });

    timesheet.hours += Number(hours);

    if(timesheet.hours == 40){
      timesheet.status = 'Completed'
    }

    if(timesheet.hours == 0){
      timesheet.status = 'Missing'
    }

    if(timesheet.hours > 40){
        return res.status(400).json({
            message: "Hours cannot be greater than 40"
        });
    }

    await timesheet.save();

    res.status(201).json({
      message: "Task added successfully",
      data: timesheet
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add task",
      error: error.message
    });
  }
});

Router.patch("/:timesheetId/day/:date/tasks/:taskId", async (req, res) => {
  try {
    const { timesheetId, date, taskId } = req.params;
    const { description, hours, project } = req.body;

    const timesheet = await Timesheet.findById(timesheetId);

    if (!timesheet) {
      return res.status(404).json({
        message: "Timesheet not found"
      });
    }

    const day = timesheet.days.find(
      (day) => day.date === date
    );
    

    if (!day) {
      return res.status(404).json({
        message: "Day not found in this timesheet"
      });
    }

    const task = day.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (hours <= 0) {
        return res.status(400).json({
            message: "Hours must be greater than 0"
        });
    }

    if (project !== undefined) {
      task.project = project;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (hours !== undefined) {
      task.hours = hours;
      timesheet.hours += Number(hours);
    }

    if(timesheet.hours > 40){
        return res.status(400).json({
            message: "Hours cannot be greater than 40"
        });
    }

    await timesheet.save();

    res.status(201).json({
      message: "Task updated successfully",
      data: timesheet
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
});

Router.delete("/:timesheetId/day/:date/tasks/:taskId", async (req, res) => {
  try {
    const { timesheetId, date, taskId } = req.params;

    const timesheet = await Timesheet.findById(timesheetId);

    if (!timesheet) {
      return res.status(404).json({
        message: "Timesheet not found"
      });
    }

    const day = timesheet.days.find(
      (day) => day.date === date
    );

    if (!day) {
      return res.status(404).json({
        message: "Day not found in this timesheet"
      });
    }

    const task = day.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Subtract task hours from total hours
    timesheet.hours -= task.hours;

    // Delete the task
    task.deleteOne();

    await timesheet.save();

    res.status(200).json({
      message: "Task deleted successfully",
      data: timesheet
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
});

export default Router