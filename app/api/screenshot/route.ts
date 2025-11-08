import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'

export const maxDuration = 10

async function getBrowser() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV
  
  if (isProduction) {
    const puppeteerCore = await import('puppeteer-core')
    return await puppeteerCore.default.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  } else {
    const puppeteer = await import('puppeteer')
    return await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    })
  }
}

export async function POST(request: NextRequest) {
  let browser = null
  
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    let validUrl: URL
    try {
      validUrl = new URL(url)
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        return NextResponse.json(
          { error: 'URL must use http or https protocol' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    browser = await getBrowser()
    const page = await browser.newPage()

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    })

    await page.goto(validUrl.toString(), {
      waitUntil: 'networkidle2',
      timeout: 8000,
    })

    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64',
      fullPage: false,
    }) as string

    await browser.close()
    browser = null

    return NextResponse.json({
      screenshot,
      url: validUrl.toString(),
    })
  } catch (error) {
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    console.error('Screenshot error:', error)

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Navigation timeout')) {
        return NextResponse.json(
          { error: 'Screenshot request timed out. Please try again.' },
          { status: 408 }
        )
      }

      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED') || error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        return NextResponse.json(
          { error: 'Failed to connect to the website. Please check the URL and try again.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to capture screenshot. Please try again.' },
      { status: 500 }
    )
  }
}
