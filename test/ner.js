const assert = require('assert')
const exec = require('child_process').exec
const server = require('../ner')

describe('server', () => {
  before(() => {
    server.listen()
  })

  after(() => {
    server.close()
  })
})

describe('PUT /', () => {
  it('returns tags JSON object', (done) => {
    let result = {
      LOCATION: [],
      ORGANIZATION: [
        'Lehman Brothers',
        'Federal Reserve',
        'Federal Reserve Bank of New York',
        'New York Fed',
        'Treasury'
      ],
      DATE: [ 'Sunday' ],
      MONEY: [],
      PERSON: [ 'Timothy R. Geithner', 'Henry M. Paulson Jr' ],
      PERCENT: [],
      TIME: []
    }
    let file = `${__dirname}/sample.txt`
    exec(`curl -T ${file} localhost:8080`, (err, stdout, stderr) => {
      assert.equal(stdout, JSON.stringify(result))
      done()
    })
  }).timeout(10000)
})
