import puppeteer from 'puppeteer'
import { credential } from 'firebase-admin'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import serviceAccount from '../service-account-credentials.json'

process.setMaxListeners(0)

// const firebaseConfig = {
//   apiKey: 'AIzaSyB45WnKQYSL97gnA2w2f6LJuGjfuJDOPbw',
//   authDomain: 'eczane-tracker.firebaseapp.com',
//   projectId: 'eczane-tracker',
//   storageBucket: 'eczane-tracker.appspot.com',
//   messagingSenderId: '662266221623',
//   appId: '1:662266221623:web:b8b0c7442b9b1a4cf2dbb2',
// }

type Pharmacy = {
  name: string
  district: string
  address: string
  tel: string
  other: string
  date: string
  lat: number
  lng: number
}

const mock: Pharmacy = {
  name: 'SÜLÜNTEPE',
  district: 'Pendik',
  address: 'SÜLÜNTEPE MAH. ABDURRAHMAN GAZİ CAD. NO: 3/A',
  tel: '0 - (216) 378 - 9498',
  other: 'Haritada Göster',
  date: '05/12/2023',
  lat: 40.9142,
  lng: 29.2832,
} satisfies Pharmacy

//@ts-ignore
initializeApp({ credential: credential.cert(serviceAccount) })
const db = getFirestore()

function dateStringToTimestamp(dateString: string) {
  const dateParts = dateString.split('/')
  const dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0])

  return dateObject.getTime()
}

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

const setData = async (data: Array<Pharmacy>) => {
  data.forEach(async (item) => {
    await db.collection('pharmacies').add(item)
  })
}

const parseData = async (dateString: string) => {
  const browser = await puppeteer.launch({ headless: false })
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

  let data: any = result
    .map(([name, district, tel, address, other]) => ({
      name,
      district,
      address,
      tel,
      other,
      date: dateString,
      timestamp: Timestamp.fromMillis(dateStringToTimestamp(dateString)),
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

  console.log(data)

  if (data) {
    setData(data)
  }
}

let arr: string[] = []

for (let i = 0; i < 1; i++) {
  let day = new Date()
  day.setDate(day.getDate() + i)
  arr.push(day.toLocaleDateString())
}

arr.forEach((date) => {
  parseData(date)
})
