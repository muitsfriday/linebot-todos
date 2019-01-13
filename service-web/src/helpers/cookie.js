

function getCookie(cname) {
  const name = `${cname}=`
  // eslint-disable-next-line no-undef
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getCookie,
}
