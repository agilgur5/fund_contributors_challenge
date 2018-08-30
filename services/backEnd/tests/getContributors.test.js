const test = require('ava')

const { fetch, pageSize, contributors } = require('./sharedImports.js')

test('GET /api/contributors', async (assert) => {
  const fixture = [{name: 'John Doe 0'}, {name: 'John Doe 1'},
    {name: 'John Doe 2'}, {name: 'John Doe 3'}, {name: 'John Doe 4'},
    {name: 'John Doe 5'}, {name: 'John Doe 6'}]

  function fetchContributors (offset) {
    let query = offset ? `?offset=${offset}` : ''
    return fetch(`/api/contributors${query}`)
      .expect('Content-Type', /json/)
  }
  function getContributors (offset) {
    return fetchContributors(offset)
      .expect(200)
      .then(res => res.json())
  }
  function getContributorsFail (offset) {
    return fetchContributors(offset)
      .expect(400)
      .then(res => res.json())
  }

  let json = await getContributors()
  assert.deepEqual(json, {contributors: []}, 'should output an empty array')

  contributors.push(...fixture)
  json = await getContributors()
  assert.deepEqual(json, {contributors: fixture.slice(0, 0 + pageSize)},
    'should output the first 6 contributors')

  json = await getContributors(1)
  assert.deepEqual(json, {contributors: fixture.slice(1, 1 + pageSize)},
    'should properly offset')

  json = await getContributorsFail(-1)
  assert.is(json.error, 'Invalid offset', 'should 400 negatives')
})
