const fs = require('fs-extra')
const vc = require('vcards-js')
const csvParse = require('csv-parse')

async function getRows(filename) {
  let text = await fs.readFile('entire.csv')
  return new Promise((resolve, _reject) => {
    csvParse(text, { columns: true }, (_err, rows) => resolve(rows))
  })
}

async function main() {
  const rows = await getRows('entire.csv')
  const vcardStrings = rows.map(row => {
    console.log(row.name, row.phone);
    let parts = row.name.split(' ')
    let card = vc()
    card.firstName = parts[0]
    // card.middleName = parts.slice
    card.lastName = parts[parts.length - 1]
    card.cellPhone = row.phone
    card.email = row.email
    return card.getFormattedString()
  })
  await fs.writeFile('entire.vcf', vcardStrings.join('\n'))
}

main()
