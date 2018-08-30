const test = require('ava')

const { fetch, contributors } = require('./sharedImports.js')

test('DELETE /api/contributors', async (assert) => {
  // NOTE contributor to be deleted must have a path string
  // this should be somewhere **safe** to unlink
  const fixture = [{name: '0', path: 'uploads/blah0'},
    {name: '1', path: 'uploads/blah1'}, {name: '2', path: 'uploads/blah2'}]

  function fetchContributors (path) {
    let query = path ? `?path=${path}` : ''
    return fetch(`/api/contributors${query}`, {
      method: 'DELETE'
    })
  }

  function deleteContributors (path) {
    return fetchContributors(path)
      .expect(204)
  }

  function deleteContributorsFail (path) {
    return fetchContributors(path)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(res => res.json())
  }

  contributors.push(...fixture)
  await deleteContributors(fixture[1].path)
  assert.deepEqual(contributors, [fixture[0], fixture[2]],
    'should delete the contributor at the path')

  let json = await deleteContributorsFail()
  assert.is(json.error, 'Invalid path', 'should 400 non-existent path')
  assert.deepEqual(contributors, [fixture[0], fixture[2]],
    'should not have deleted any contributors')

  await fetchContributors('bla').expect(404)
  assert.deepEqual(contributors, [fixture[0], fixture[2]],
    'should not have deleted any contributors')
})
