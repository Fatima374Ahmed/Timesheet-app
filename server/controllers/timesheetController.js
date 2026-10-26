import Timesheet from "../models/timesheet.js";

export const getTimesheets = async (req, res) => {
  try {
    const timesheets = await Timesheet.find();

    res.status(200).json(timesheets);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getTimesheetsStatus = async (req, res) => {
   try {
        const status = req.params.status
        const timesheets = await Timesheet.find({status: status})
        res.status(200).json(timesheets)

    } catch(error) {
        res.status(500).json({ error: error.message });

    }
};

export const getTimesheetsId = async (req, res) => {
   try {
        const status = req.params.status
        const timesheets = await Timesheet.find({status: status})
        res.status(200).json(timesheets)

    } catch(error) {
        res.status(500).json({ error: error.message });

    }
};