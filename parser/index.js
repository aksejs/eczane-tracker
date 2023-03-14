const puppeteer = require('puppeteer')
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc } = require('firebase/firestore')

require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'eczane-tracker.firebaseapp.com',
  projectId: 'eczane-tracker',
  storageBucket: 'eczane-tracker.appspot.com',
  messagingSenderId: '662266221623',
  appId: '1:662266221623:web:b8b0c7442b9b1a4cf2dbb2',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

const setData = async (data) => {
  data.forEach(async (item) => {
    await addDoc(collection(db, 'pharmacies'), item)
  })
}

const parseData = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width: 1080, height: 1024 })

  await page.goto(
    'https://www.turkiye.gov.tr/saglik-titck-nobetci-eczane-sorgulama'
  )

  await page.select('#plakaKodu', '34')
  await page.type('.advdate', '14/03/2023')
  await page.click('.submitButton')

  await delay(3000)

  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('#searchTable tr')
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll('td')
      return Array.from(columns, (column) => column.innerText)
    })
  })

  let data = result
    .map(([name, district, tel, address, other]) => ({
      name,
      district,
      address,
      tel,
      other,
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
    data[i] = { ...data[i], lat, lng }
  }

  await browser.close()

  if (data) {
    setData(data)
  }
}

parseData()
