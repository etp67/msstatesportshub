// Specify PORT to run server on
const PORT = 8000

// Require
const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')
const pool = require("./db")
const client = require('pg/lib/native/client')

// Run Express library
const app = express()

// Start server on PORT
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

//Connect to database
pool.connect()
    .then(() => console.log("Connected Successfully"))
    .then(() => pool.query("select * from sport"))
    .then(results => console.table(results.rows))
    .catch(e => console.log(e))
    .finally(() => pool.end())



function splitStrByLine(schedule_txt){  // Splits the text by line
    const lineArray = schedule_txt.split("\n")
    return lineArray
}

function wordSplit(lineArray, teamHasStats){    // Splits each line into each statistic
    let teamStats = []
    for (let i = 0; i < lineArray.length; i++){     // Iterates through lines
        console.log(i)
        if (teamHasStats){
            if (lineArray[i].startsWith("Overall", 1)){     // teamStats[0], teamStats[1]
                let wordArray = lineArray[i].split(" ")
                for (let j = 0; j < wordArray.length; j++){
                    wordArray[j].replace(/\s+/g, '')
                    if (wordArray[j].match(/^\d/)){     // checks if string starts with a number
                        teamStats[0] = wordArray[j]
                    }
                    else if (wordArray[j].startsWith(".")){     // checks if string starts with '.'
                        teamStats[1] = wordArray[j]
                    }
                }
            }
            else if (lineArray[i].startsWith("Conference", 1)){  // teamStats[2], teamStats[3]
                let wordArray = lineArray[i].split(" ")
                for (let j = 0; j < wordArray.length; j++){
                    wordArray[j].replace(/\s+/g, '')
                    if (wordArray[j].match(/^\d/)){
                        teamStats[2] = wordArray[j]
                    }
                    else if (wordArray[j].startsWith(".")){
                        teamStats[3] = wordArray[j]
                    }
                }
            }
            else if (lineArray[i].startsWith("Streak", 1)){      // teamStats[4]
                let wordArray = lineArray[i].split(" ")
                for (let j = 0; j < wordArray.length; j++){
                    if (wordArray[j].startsWith("W") || wordArray[j].startsWith("L")){
                        teamStats[4] = wordArray[j]
                    }
                }
            }
            else if (lineArray[i].startsWith("Home", 1)){  // teamStats[5]
                let wordArray = lineArray[i].split(" ")
                for (let j = 0; j < wordArray.length; j++){
                    wordArray[j].replace(/\s+/g, '')
                    if (wordArray[j].match(/^\d/)){
                        teamStats[5] = wordArray[j]
                    }
                }
            }
            else if (lineArray[i].startsWith("Away", 1)){  // teamStats[6]
                let wordArray = lineArray[i].split(" ")
                for (let j = 0; j < wordArray.length; j++){
                    wordArray[j].replace(/\s+/g, '')
                    if (wordArray[j].match(/^\d/)){
                        teamStats[6] = wordArray[j]
                    }
                }
            }
            else if (lineArray[i].startsWith("Neutral", 1)){  // teamStats[7]
                let wordArray = lineArray[i].split(" ")
                for (let j = 0; j < wordArray.length; j++){
                    wordArray[j].replace(/\s+/g, '')
                    if (wordArray[j].match(/^\d/)){
                        teamStats[7] = wordArray[j]
                    }
                }
            }
        }
    }
    console.log("teamStats: ", teamStats)
    let lineOfScheduleStart = 0;
    for (i = 0; i < lineArray.length; i++){     // Iterates through lines until reaching game stats
        console.log(i)
        if (lineArray[i].startsWith("Date", 1)){
            lineOfScheduleStart = i + 1
            break
        }
    }
    let games = []
    let gameNum = 0
    for (i = lineOfScheduleStart; i < lineArray.length; i++){     // Iterates through games
        console.log(i)
        let gameStats = []
        let statNum = 0
        let wordArray = lineArray[i].split('  ')
        for (let j = 0; j < wordArray.length; j++){     // Iterates through game stats
            if (wordArray[j].replace(/\s+/g, '').length){
                wordArray[j] = wordArray[j].replace(/^\s+/g, '')
                gameStats[statNum] = wordArray[j]
                statNum++
            }
        }
        games[gameNum] = gameStats
        gameNum++
    }
    console.log(games)
}

function processScheduleText(schedule_txt, teamHasStats){   // Processes given text into database
    const lineArray = splitStrByLine(schedule_txt)
    for (let i = 0; i < lineArray.length; i++){
        console.log(lineArray[i])
    }
    wordSplit(lineArray, teamHasStats)
}



let sportID =  1    // Will be input
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