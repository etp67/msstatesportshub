const PORT = 8000
const axios = require('axios')
const express = require('express')

const app = express()

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))



function splitStrByLine(schedule_txt){
    const lineArray = schedule_txt.split("\n")
    return lineArray
}

function wordSplit(str){

}

function processScheduleText(schedule_txt){
    const lineArray = splitStrByLine(schedule_txt)
    for (let i = 0; i < lineArray.length; i++){
        console.log(lineArray[i])
    }
}



const url = 'https://hailstate.com/services/schedule_txt.ashx'
let schedule = 269
let sportID =  1

axios.get(url, 
    {
        params: 
        {
            schedule: schedule
        }
    })
    .then(response => {
        const schedule_txt = response.data
        processScheduleText(schedule_txt)
    })