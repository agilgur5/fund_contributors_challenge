const fetch = window.fetch

export function getContributors (offset) {
  let query = offset ? `?offset=${offset}` : ''
  return fetch(`/api/contributors${query}`)
    .then(res => res.json())
}

export function postContributors (name, photo) {
  const formData = new window.FormData()
  formData.append('name', name)
  formData.append('photo', photo)
  return fetch('/api/contributors', {
    method: 'POST',
    body: formData
  }).then(res => res.json())
}

export function deleteContributors (path) {
  return fetch(`/api/contributors?path=${path}`, {
    method: 'DELETE'
  })
}
