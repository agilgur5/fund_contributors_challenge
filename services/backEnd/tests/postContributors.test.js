const test = require('ava')
const FormData = require('form-data')
const fs = require('fs')

const { fetch, contributors } = require('./sharedImports.js')

test('POST /api/contributors', async (assert) => {
  function fetchContributors (name, photoPath) {
    const formData = new FormData()
    if (name) {
      formData.append('name', name)
    }
    if (photoPath) {
      formData.append('photo', fs.createReadStream(photoPath),
        {filename: photoPath})
    }
    return fetch('/api/contributors', {
      method: 'POST',
      body: formData
    }).expect('Content-Type', /json/)
  }

  function postContributors (name, photoPath) {
    return fetchContributors(name, photoPath)
      .expect(201)
      .then(res => res.json())
  }

  function postContributorsFail (name, photoPath) {
    return fetchContributors(name, photoPath)
      .expect(400)
      .then(res => res.json())
  }

  let fixturePath = 'fixtures/small_photo.jpg'
  let name = 'Jane Doe 0'
  let { path } = await postContributors(name, fixturePath)
  assert.deepEqual(contributors, [{name, path}],
    'should return the right preview')

  let json = await postContributorsFail(undefined, fixturePath)
  assert.is(json.error, 'Invalid name', 'should 400 no name')
  assert.is(contributors.length, 1, 'should not have added a contributor')

  fixturePath = 'fixtures/too_large_photo.jpg'
  json = await postContributorsFail(name, fixturePath)
  assert.is(json.error, 'Invalid photo', 'should 400 large photo')
  assert.deepEqual(contributors, [{name, path}],
    'should not have added a contributor')

  json = await postContributorsFail(name, undefined)
  assert.is(json.error, 'Invalid photo', 'should 400 no photo')
  assert.deepEqual(contributors, [{name, path}],
    'should not have added a contributor')

  fs.unlink(path, () => {}) // cleanup
})
