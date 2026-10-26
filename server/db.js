import mongoose from 'mongoose'
const mongoUrl = 'mongodb://127.0.0.1:27017/timesheet'
import Timesheet from './models/timesheet.js'
mongoose.connect(mongoUrl)
.then(async() => {
    console.log('connected to server mongodb ')
     await Timesheet.createIndexes()

        console.log('Indexes created')

        const indexes = await Timesheet.collection.indexes()
    // console.log('indexes', indexes)
    
})
.catch((err) => {
    console.log('Failed connecting to server', err)
})

const db = mongoose.connection

export default db