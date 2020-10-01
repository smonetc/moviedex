require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./movies-data-small.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function handleBearerToken(req,res,next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log(authToken)
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get('/movie',function handleGetMovie(req,res){
    let response = MOVIEDEX

    if(req.query.genre){
        response = response.filter(moveieGenre => 
         moveieGenre.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if(req.query.country){
        response = response.filter(moveieCountry => 
         moveieCountry.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if(req.query.avg_vote){
        response = response.filter(vote => {
            Number(vote.avg_vote) >= Number(req.query.avg_vote)
        })
    }

    res.json(response)
})


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})