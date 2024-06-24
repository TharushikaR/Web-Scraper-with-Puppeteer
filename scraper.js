/**
 * Web Scraper for Books
 */

const puppeteer=require('puppeteer')
const random_useragent=require('random-useragent')
const fs=require('fs')
const {url}=require('./config')

;(async ()=>{
    //open browser
    const browser=await puppeteer.launch({headless:true})
    const page=await browser.newPage()

    //setup browser
    await page.setDefaultTimeout(10000)
    await page.setViewport({width:1920, height:1080})
    await page.setUserAgent(random_useragent.getRandom())

    //get data from bookstore
    const name_selector=`.product_main > h1`
    const price_selector=`.price_color`
    await page.goto(url)
    await page.waitForSelector(name_selector)
    await page.waitForSelector(price_selector)
    const name=await page.$eval(name_selector,e=>e.innerHTML)
    const price=await page.$eval(price_selector,e=>e.innerHTML)

    const nameTrim=name.trim()
    const priceTrim=price.trim()


    //get current data and time
    const date=new Date()
    const day=date.getDate()
    const month=date.getMonth()+1
    const year=date.getFullYear()
    const fullDate=`${day}/${month}/${year}`

    //save data to the textfile
    const logger=fs.createWriteStream('log.txt',{flags:'a'})
    logger.write(`${fullDate} - ${nameTrim} - ${priceTrim}\n`)
    logger.close()

    console.log(fullDate + " " + nameTrim + " "+ priceTrim)


    //close browser
    await browser.close()

})().catch(error=>{
    console.log(error)
    process.exit(1)
})