export function chunkArray (arr, chunkSize) {
  let chunkedArr = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunkedArr.push(arr.slice(i, i + chunkSize))
  }
  return chunkedArr
}
