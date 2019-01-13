/* eslint-disable import/prefer-default-export */

const dateFormat = (isoString) => {
  const date = new Date(isoString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}


export {
  dateFormat,
}
