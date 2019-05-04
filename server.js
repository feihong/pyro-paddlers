const fs = require('fs-extra')
const showdown = require('showdown')
const csvParse = require('csv-parse')
const nunjucks = require('nunjucks')
const express = require('express')
const { getRoster } = require('./scripts/csv')

if (!process.env.PROJECT_DOMAIN) {
  // read environment variables (only necessary locally, not on Glitch)
  require('dotenv').config();
}

const converter = new showdown.Converter()

const app = express()
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
  noCache: true,
})

const basicAuth = require('express-basic-auth')
const staticBasicAuth = basicAuth({
  users: {
    [process.env.USERNAME]: process.env.PASSWORD
  },
  challenge: true,
})

async function renderPage(mdFile) {
  let body = await fs.readFile(`./pages/${mdFile}.md`, 'utf-8')
  let title = 'Untitled'
  try {
    // The title is taken as the text of the first h1 element in the document
    title = body.split('\n').filter(line => line.startsWith('# '))[0].substring(2)
  } catch (err) { }

  body = converter.makeHtml(body)

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link id="favicon" rel="icon" href="https://glitch.com/edit/favicon-app.ico" type="image/x-icon">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <body>
    <main class="container">
      ${body}
    </main>
  </body>
</html>`
}

async function getRosters() {
  let csvFiles = await fs.readdir('./.data')
  return csvFiles
    .filter(f => f.endsWith('.csv'))
    .map(f => f.split('.')[0])
}

async function getMessageTemplates() {
  let text = await fs.readFile(`./templates/messages.json`)
  return JSON.parse(text)
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

app.get('/', async (req, res) => {
  res.send(await renderPage('index'))
})

app.get('/captain', staticBasicAuth, async (req, res) => {
  const rosters = await getRosters()
  res.render('captain.html', { rosters })
})

app.get('/roster/:name', staticBasicAuth, async (req, res) => {
  const name = req.params.name
  const csvFile = `./.data/${name}.csv`
  const members = JSON.stringify(getRoster(csvFile))
  const phone = process.env.PHONE
  const messageTemplates = JSON.stringify(await getMessageTemplates())
  res.render('roster.html', { name, members, phone, messageTemplates })
})

app.get('/roster/:name.json', staticBasicAuth, async (req, res) => {
  res.status(200).json(await getTeam())
})

app.get('/:name', async (req, res) => {
  try {
    let html = await renderPage(req.params.name)
    res.send(html)
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).send('No page found')
    }
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT || 8000, () => {
  console.log(`Your app is listening on http://localhost:${listener.address().port}`)
})
