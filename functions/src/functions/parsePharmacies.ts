import puppeteer from 'puppeteer'
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

import { Pharmacy } from '../utils/types'
import { dateStringToTimestamp, delay } from '../utils/helpers'

const setData = async (data: Array<Pharmacy>) => {
  data.forEach(async (item) => {
    await admin.firestore().collection('pharmacies').add(item)
  })
}

const parseData = async (dateString: string) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
    timeout: 0,
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1080, height: 1024 })

  await page.goto(
    'https://www.turkiye.gov.tr/saglik-titck-nobetci-eczane-sorgulama'
  )

  await page.select('#plakaKodu', '34')
  await page.type('.advdate', dateString)
  await page.click('.submitButton')

  await delay(3000)

  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('#searchTable tr')
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td')
      return Array.from(columns, (column) => column.innerText)
    })
  })

  //@ts-ignore
  let data: Pharmacy[] = result
    .map(([name, district, tel, address, other]) => ({
      name,
      district,
      address,
      tel,
      other,
      date: dateString,
      timestamp: admin.firestore.Timestamp.fromMillis(
        dateStringToTimestamp(dateString)
      ),
    }))
    .slice(1)

  for (let i = 0; i < data.length; i++) {
    await page.goto(
      `https://www.turkiye.gov.tr/saglik-titck-nobetci-eczane-sorgulama?harita=Goster&index=${i}`,
      {
        waitUntil: 'domcontentloaded',
      }
    )

    const lat = await page.evaluate('latti')
    const lng = await page.evaluate('longi')

    if (typeof lat === 'number' && typeof lng === 'number') {
      data[i] = { ...data[i], lat, lng }
    }
  }

  await browser.close()

  if (data) {
    setData(data)
  }
}

export default functions
  .region('europe-west1')
  .pubsub.schedule('25 05 * * TUE')
  .timeZone('Europe/Istanbul')
  .onRun(() => {
    let arr = []
    for (let i = 0; i < 2; i++) {
      let day = new Date()
      day.setDate(day.getDate() + i)
      arr.push(day.toLocaleDateString())
    }

    arr.forEach((date) => {
      parseData(date)
    })
  })
