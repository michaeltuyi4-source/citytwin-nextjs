import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/results', '/auth/'] },
      { userAgent: 'GPTBot', allow: '/', disallow: ['/results', '/auth/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/results', '/auth/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/results', '/auth/'] },
    ],
    sitemap: 'https://www.citytwinapp.com/sitemap.xml',
  }
}
