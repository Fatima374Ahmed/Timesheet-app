import mongoose from 'mongoose'

const timesheetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Completed', 'Incomplete'],
        required: true
    },
    hours:{
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    days: [
        {
            date: {
                type: String,
                required: true
            },

            tasks: [
                {
                    description: String,

                    hours: {
                        type: Number,
                        default: 0
                    },

                    project: String
                }
            ]
        }
    ]
   
})

timesheetSchema.index(
    { userId: 1, startDate: 1 },
    { unique: true }
);

const Timesheet = mongoose.model('Timesheet', timesheetSchema);
export default Timesheet