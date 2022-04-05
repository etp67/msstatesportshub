const PORT = 8000
const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))



function splitStrByLine(schedule_txt){
    const lineArray = schedule_txt.split("\n")
    return lineArray
}

function teamStatsSplit(lineArray, teamStats){

}

function wordSplit(lineArray, teamHasStats){
    if (teamHasStats == 1){

    }
    for (let i = 0; i < lineArray.length; i++){
        if (teamHasStats == 1){
            console.log(i)
            if (lineArray[i].startsWith("Overall", 1)){
                let wordArray = lineArray[i].split(" ")
                for (let i = 0; i < wordArray.length; i++){
                    console.log(wordArray[i])
                }
            }
        }
    }
}

function processScheduleText(schedule_txt, teamHasStats){
    const lineArray = splitStrByLine(schedule_txt)
    for (let i = 0; i < lineArray.length; i++){
        console.log(lineArray[i])
    }
    wordSplit(lineArray, teamHasStats)
}



let sportID =  1
let teamHasStats = 1
let url = ''

switch(sportID){
    case 0:
        url = 'https://hailstate.com/sports/baseball/schedule'
        break
    case 1:
        url = 'https://hailstate.com/sports/mens-basketball/schedule'
        break
    case 2:
        url = 'https://hailstate.com/sports/womens-basketball/schedule'
        break
    case 3:
        url = 'https://hailstate.com/sports/cross-country/schedule'
        teamHasStats = 0;
        break
    case 4:
        url = 'https://hailstate.com/sports/football/schedule'
        break
    case 5:
        url = 'https://hailstate.com/sports/mens-golf/schedule'
        teamHasStats = 0;
        break
    case 6:
        url = 'https://hailstate.com/sports/womens-golf/schedule'
        teamHasStats = 0;
        break
    case 7:
        url = 'https://hailstate.com/sports/womens-soccer/schedule'
        break
    case 8:
        url = 'https://hailstate.com/sports/softball/schedule'
        break
    case 9:
        url = 'https://hailstate.com/sports/mens-tennis/schedule'
        break
    case 10:
        url = 'https://hailstate.com/sports/womens-tennis/schedule'
        break
    case 11:
        url = 'https://hailstate.com/sports/track-and-field/schedule'
        teamHasStats = 0;
        break
    case 12:
        url = 'https://hailstate.com/sports/womens-volleyball/schedule'
        break
    default:
        console.log("Error.")
}
let classes = '.main-content-placeholder.main-content-placeholder__wrap.sidearm-schedule-template-1 sidearm-schedule sidearm-common.schedule-view-container.sidearm-schedule-template-header flex row flex-column large-flex-row flex-align-center large-flex-justify-between noprint.sidearm-schedule-select flex x-small-12 flex-item-1 flex-wrap flex-align-center.sidearm-schedule-select-list flex flex-wrap.sidearm-schedule-header-text flex text-no-wrap'
axios.get(url)
    .then(response => {
        response = response.data
        const $ = cheerio.load(response)
        url = 'https://hailstate.com'
        let extension = $('li[class="sidearm-schedule-header-text flex text-no-wrap"]', response).find('a').attr('href')
        let teamID = ''
        for(let i = 37; i < extension.length; i++){
            teamID += extension[i]
        }
        teamID = parseInt(teamID)
        console.log('teamID = ' + teamID)
        url += extension
        console.log(url)
        axios.get(url)
            .then(response => {
                const schedule_txt = response.data
                processScheduleText(schedule_txt, teamHasStats)
            }).catch(err => console.log(err))
    }).catch(err => console.log(err))