const express = require('express')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios');
const knex = require("./knex");

// const MongoClient = require('mongodb').MongoClient;


// const MongoClient = require('mongodb').MongoClient;
const config = {
    port : 8086,
    // db: 'mongodb://' + (process.env.MONGO_HOST || 'localhost:27017') + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DBNAME
    db: 'mongodb://localhost:30000/coolSpace',
    dbName: 'coolWorkSpace',
    collectionName: 'empData'
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => res.send('Hello World!'));

// A function to check if the given value falls within a particular range.
// Returns true, if the value is in range and returns false otherwise.
function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}
// A function to get date
function getFullDate() {
    var date = new Date().getDate()+1;
    var month = new Date().getMonth()+1;
    var year = new Date().getFullYear();

    let fullDate = date+"/"+month+"/"+year;
    return fullDate;
}
// This API returns the percentage of happiness of the employee based on factors like 
// number of fun events organized in the company, reading emotions from the employee's face, 
// number of people attending the fun events, consistency of the IN time, 
// time people spend using phones, the sitting position in chair,
// time people spend outside their workspace, work they do when half the team is not available,
// etc.

// Consider giving weightage to the factors considered as well.
// The weigtage should be decided by the hr, based on the culture

app.post('/getMood', (req, res) => {
    let reqBody = req.body;
    if (
        reqBody.teamAvailability >= 70 &&
        reqBody.emotionFromFace >= 70 &&
        reqBody.eventsOrganized >= 70 &&
        reqBody.peopleAttendingEvents >= 70 &&
        reqBody.consistentInTime >= 70 &&
        reqBody.mobileUsage >= 70 &&
        reqBody.chairPosition >= 70 &&
        reqBody.timeSpentOutsideWorkSpace >= 70 &&
        reqBody.howHappyTheBossIs >=70
        ) {
            if (reqBody.workLoad <= 30) {
                console.log('cool workspace <30 very sooper cool')
                return res.status(200).jsonp({
                    "stressLevel":"very sooper cool",
                    "percentage":"100"
                    ,"date": getFullDate()
            }); 
            
            } else if (reqBody.workLoad >= 30 && reqBody.workLoad <= 70) {
                console.log('<70 >30 sooper cool')
                return res.status(200).jsonp({
                    "stressLevel":"sooper cool",
                    "percentage":"80"
                    ,"date": getFullDate()
                }); 
            } else if (reqBody.workLoad >= 70 && reqBody.workLoad <= 90) {
                console.log('<90 >70 cool')
                return res.status(200).jsonp({
                    "stressLevel":"cool",
                    "percentage":"60"
                    ,"date": getFullDate()
                }); 
            } else if (reqBody.workLoad >= 90) {
                console.log('>50  still okay')
                return res.status(200).jsonp({
                    "stressLevel":"still ok",
                    "percentage":"50"
                    ,"date": getFullDate()
                }); 
            }
    } else if (
        inRange(reqBody.teamAvailability, '30', '70')  &&
        inRange(reqBody.emotionFromFace, '30', '70') &&
        inRange(reqBody.eventsOrganized, '30', '70') &&
        inRange(reqBody.peopleAttendingEvents, '30', '70') &&
        inRange(reqBody.consistentInTime, '30', '70') &&
        inRange(reqBody.mobileUsage, '30', '70') &&
        inRange(reqBody.chairPosition, '30', '70') &&
        inRange(reqBody.timeSpentOutsideWorkSpace, '30', '70') &&
        inRange(reqBody.howHappyTheBossIs, '30', '70')
        
    ) {
        if (reqBody.workLoad <= 30) {
            console.log('<30 sooper cool')
            return res.status(200).jsonp({
                "stressLevel":"sooper cool",
                "percentage":"80"
                ,"date": getFullDate()
            }); 
        } else if (reqBody.workLoad >= 30 && reqBody.workLoad <= 70) {
            console.log('<70 >30 cool')
            return res.status(200).jsonp({
                "stressLevel":"cool",
                "percentage":"60"
                ,"date": getFullDate()
            }); 
        } else if (reqBody.workLoad >= 70 && reqBody.workLoad <= 90) {
            console.log('<90 >70 okay')
            return res.status(200).jsonp({
                "stressLevel":"okay",
                "percentage":"50"
                ,"date": getFullDate()
            }); 
        } else if (reqBody.workLoad >= 90)
            console.log('>90  ltl strss')
            return res.status(200).jsonp({
                "stressLevel":"ltl strss",
                "percentage":"30"
                ,"date": getFullDate()
            }); 
    } else if (
        reqBody.teamAvailability <= 30 &&
        reqBody.emotionFromFace <= 30 &&
        reqBody.eventsOrganized <= 30 &&
        reqBody.peopleAttendingEvents <= 30 &&
        reqBody.consistentInTime <= 30 &&
        reqBody.mobileUsage <= 30 &&
        reqBody.chairPosition <= 30 &&
        reqBody.timeSpentOutsideWorkSpace <= 30 &&
        reqBody.howHappyTheBossIs <= 30
    ) {
        if (reqBody.workLoad <= 30) {
            console.log('<30 ltl cool')
            return res.status(200).jsonp({
                "stressLevel":"ltl cool",
                "percentage":"60"
                ,"date": getFullDate()
            }); 
        } else if (reqBody.workLoad >= 30 && reqBody.workLoad <= 70) {
            console.log('<70 >30 oky')
            return res.status(200).jsonp({
                "stressLevel":"okay",
                "percentage":"40"
                ,"date": getFullDate()
            }); 
        } else if (reqBody.workLoad >= 70 && reqBody.workLoad <= 90) {
            console.log('<90 >70 ltl strs')
            return res.status(200).jsonp({
                "stressLevel":"ltl strss",
                "percentage":"20"
                ,"date": getFullDate()
            }); 
        } else if (reqBody.workLoad >= 90) {
            console.log('>90  heavy strss')
            return res.status(200).jsonp({
                "stressLevel":"heavy stress",
                "percentage":"10"
                ,"date": getFullDate()
            });
        }
    }
    

})

app.post('/saveAllValues/:employee', async (req, res) => {
   
    let payload = req.body;
    let employee = req.params.employee;
    console.log('userrr----', employee);
    try {
        let apiOptions = {
            url: "http://localhost:8086/getMood",
            method: 'POST',
            responseType: 'json',
            data: payload
        };

        let response = await axios(apiOptions);
        console.log('resss', response.data);
        var dayNames = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let inputToTable = {
            employee : employee,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            // day: new Date().getDate(),
            day: '3',
            week: dayNames[new Date().getDay()],
            happinessLevel: response.data.percentage,
            date: getFullDate()
            // date: "3/1/2020"
        }
        knex('userWorkSpaceMood').insert(inputToTable).then(() => {
            console.log('inserted');
          });
   
        return res.status(200).jsonp({
            "msg":"inserted to db"
        })

    } catch (err) {
        console.log('error in insertion', err);
        return err;
    }
});
app.get('/getAllValues/:employee', (req, res) => {
    let employee = req.params.employee
    knex("userWorkSpaceMood").select().where('employee', employee).then(data => {
        return res.status(200).jsonp({
            "data": data
        })
      })
})

app.listen(config.port, () => console.log(`app listening on port ${config.port}!`))