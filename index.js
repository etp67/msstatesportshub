// Specify PORT to run server on
const PORT = 8000

// Require
const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')
const pool = require("./db")

// Run Express library
const app = express()

// Start server on PORT
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))



function splitStrByLine(schedule_txt){  // Splits the text by line
    const lineArray = schedule_txt.split("\n")
    return lineArray
}

function teamStatsSplit(lineArray, teamStats){

}

function wordSplit(lineArray, teamHasStats){    // Splits each line into each statistic
    for (let i = 0; i < lineArray.length; i++){     // Loops through lines
        console.log(i)
        if (teamHasStats == 1){     // If the team has stats, post those stats
            if (lineArray[i].startsWith("Overall", 1)){
                let wordArray = lineArray[i].split(" ")
                for (let i = 0; i < wordArray.length; i++){
                    console.log(wordArray[i])
                }
            }
        }
    }
}

function processScheduleText(schedule_txt, teamHasStats){   // Processes given text into database
    const lineArray = splitStrByLine(schedule_txt)
    for (let i = 0; i < lineArray.length; i++){
        console.log(lineArray[i])
    }
    wordSplit(lineArray, teamHasStats)
}



let sportID =  6    // Will be input
let teamHasStats = 1
let url = ''

switch(sportID){
    case 1:
        url = 'https://hailstate.com/sports/baseball/schedule'
        break
    case 2:
        url = 'https://hailstate.com/sports/mens-basketball/schedule'
        break
    case 3:
        url = 'https://hailstate.com/sports/womens-basketball/schedule'
        break
    case 4:
        url = 'https://hailstate.com/sports/cross-country/schedule'
        teamHasStats = 0;
        break
    case 5:
        url = 'https://hailstate.com/sports/football/schedule'
        break
    case 6:
        url = 'https://hailstate.com/sports/mens-golf/schedule'
        teamHasStats = 0;
        break
    case 7:
        url = 'https://hailstate.com/sports/womens-golf/schedule'
        teamHasStats = 0;
        break
    case 8:
        url = 'https://hailstate.com/sports/womens-soccer/schedule'
        break
    case 9:
        url = 'https://hailstate.com/sports/softball/schedule'
        break
    case 10:
        url = 'https://hailstate.com/sports/mens-tennis/schedule'
        break
    case 11:
        url = 'https://hailstate.com/sports/womens-tennis/schedule'
        break
    case 12:
        url = 'https://hailstate.com/sports/track-and-field/schedule'
        teamHasStats = 0;
        break
    case 13:
        url = 'https://hailstate.com/sports/womens-volleyball/schedule'
        break
    default:
        console.log("Error.")
}
axios.get(url)      // Grab HTML from given link
    .then(response => {
        response = response.data
        const $ = cheerio.load(response)    // Load HTML
        url = 'https://hailstate.com'
        // Find button with link to text schedule
        let extension = $('li[class="sidearm-schedule-header-text flex text-no-wrap"]', response).find('a').attr('href')
        let teamID = ''
        for(let i = 37; i < extension.length; i++){     // Set teamID to number of the text schedule
            teamID += extension[i]
        }
        teamID = parseInt(teamID)
        console.log('teamID = ' + teamID)
        url += extension
        console.log(url)
        axios.get(url)      // Grab text from given URL
            .then(response => {
                const schedule_txt = response.data
                processScheduleText(schedule_txt, teamHasStats)     // Process text
            }).catch(err => console.log(err))
    }).catch(err => console.log(err))