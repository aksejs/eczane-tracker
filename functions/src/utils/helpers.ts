export function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

export function dateStringToTimestamp(dateString: string) {
  const dateParts = dateString.split('/')
  const dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])

  return dateObject.getTime()
}
