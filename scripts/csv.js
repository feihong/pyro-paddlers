const fs = require('fs')
const csvParse = require('csv-parse/lib/sync')

if (!process.env.PROJECT_DOMAIN) {
  // read environment variables (only necessary locally, not on Glitch)
  require('dotenv').config();
}

const { NAME_FIELD, EMAIL_FIELD, PHONE_FIELD } = process.env

exports.getRoster = function (filename) {
  let text = fs.readFileSync(filename)
  let rows =
    csvParse(text, { columns: true, skip_lines_with_error: false })
      .map(row => {
        row.name = row[NAME_FIELD]
        row.email = row[EMAIL_FIELD]
        row.phone = row[PHONE_FIELD]
        return row
      })
  rows.sort((x, y) =>
    x.name < y.name ? -1 : x.name > y.name ? 1 : 0
  )
  return rows
}
