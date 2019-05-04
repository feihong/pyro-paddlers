const fs = require('fs')
const vc = require('vcards-js')
const { getRoster } = require('./csv')

async function main() {
  const inputFile = process.argv[2]
  // console.log(inputFile);

  const rows = getRoster(inputFile)
  const vcardStrings = rows.map(row => {
    console.log(row.name)
    let parts = row.name.split(' ')
    let card = vc()
    card.firstName = parts[0]
    // card.middleName = parts.slice
    card.lastName = parts[parts.length - 1]
    card.cellPhone = row.phone
    card.email = row.email
    return card.getFormattedString()
  })
  const outputFile = inputFile.split('.')[0] + '.vcf'
  fs.writeFileSync(outputFile, vcardStrings.join('\n'))
  console.log(`\nWrote to ${outputFile}`)
}

main()
