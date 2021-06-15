/*const express = require('express');
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
*/
/*const express = require('express');
const dotenv = require("dotenv");
dotenv.config()

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-langauge-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-03-25',
    authenticator: new IamAuthenticator({
    apikey: apikey,
  }),
  serviceUrl:  url,
});
return naturalLanguageUnderstanding;
}
*/
const express = require('express');
const dotenv = require('dotenv')
const nluinstancecreator = require('./Middleware/IBMNewInstanceCreator')
dotenv.config()

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const querytext = req.query.url
    const newinstance = nluinstancecreator
    const analyzeparams = {
        'url': querytext,
        'features': {
            'entities' : {
                'emotion' : true,
                'sentiment': false
            }, 'keywords': {
                'emotion': true,
                'sentiment': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
           const emotionalanalysis = analysisresults.result.entities[0].emotion
            return res.send({emotions: emotionalanalysis});
        }).catch( err =>
            {
                console.log(err)
            })
});

app.get("/url/sentiment", (req,res) => {
    const querytext = req.query.url
    const newinstance = nluinstancecreator
    let sentimentresponse
    const analyzeparams = {
        'url': querytext,
        'features': {
            'entities' : {
                'sentiment' : true,
                'emotion'  : false
            }, 'keywords': {
                'sentiment': true,
                'emotion': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            console.log(JSON.stringify(analysisresults, null, 2))
            sentimentresponse = analysisresults.result.entities[0].sentiment.label
            return res.send({senti: sentimentresponse});
        }).catch( err =>
            {
                console.log(err)
            })
});

app.get("/text/emotion", (req,res) => {
    const querytext = req.query.text
    const newinstance = nluinstancecreator
    const analyzeparams = {
        'text': querytext,
        'features': {
            'entities' : {
                'emotion' : true,
                'sentiment': false
            }, 'keywords': {
                'emotion': true,
                'sentiment': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            const emotionalanalysis = analysisresults.result.entities[0].emotion
            return res.send({emotions: emotionalanalysis});
        }).catch( err =>
            {
                console.log(err)
            })
});

app.get("/text/sentiment", (req,res) => {
    const querytext = req.query.text
    const newinstance = nluinstancecreator
    const analyzeparams = {
        'text': querytext,
        'features': {
            'entities' : {
                'sentiment' : true,
                'emotion'  : false
            }, 'keywords': {
                'sentiment': true,
                'emotion': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            console.log(JSON.stringify(analysisresults, null, 2))
            const sentimentresponse = analysisresults.result.entities[0].sentiment.label
            return res.send({senti: sentimentresponse});
        }).catch( err =>
            {
                console.log(err)
            })
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
