import puppeteer from 'puppeteer'
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

import { Pharmacy } from '../utils/types'

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

const setData = async (data: Array<Pharmacy>) => {
  data.forEach(async (item) => {
    await admin.firestore().collection('pharmacies').add(item)
  })
}

const parseData = async (dateString = '14/03/2023') => {
  const browser = await puppeteer.launch()
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

  let data: Pharmacy[] = result
    .map(([name, district, tel, address, other]) => ({
      name,
      district,
      address,
      tel,
      other,
      date: dateString,
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
  .pubsub.schedule('every week')
  .timeZone('Europe/Istanbul')
  .onRun(() => {
    //parseData()
    console.log('fired')
  })
