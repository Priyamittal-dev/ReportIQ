import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeUrl(url: string) {
    try {
      // Basic URL validation
      const targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      
      const response = await axios.get(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        timeout: 10000 // 10s timeout
      });

      const html = response.data;
      const $ = cheerio.load(html);

      const title = $('title').text() || '';
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
      
      const h1s: string[] = [];
      $('h1').each((_, el) => {
        const text = $(el).text().trim();
        if (text) h1s.push(text);
      });

      const h2s: string[] = [];
      $('h2').each((_, el) => {
        const text = $(el).text().trim();
        if (text) h2s.push(text);
      });

      // Extract raw text for basic keyword analysis, stripping out scripts and styles
      $('script, style, noscript, iframe').remove();
      const rawText = $('body').text().replace(/\s+/g, ' ').trim();

      // Get links
      const links: { text: string, href: string }[] = [];
      $('a').each((_, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (text && href && href.startsWith('http')) {
          links.push({ text, href });
        }
      });

      return {
        url: targetUrl.toString(),
        title,
        description: metaDescription,
        keywords: metaKeywords,
        h1Count: h1s.length,
        h1s,
        h2Count: h2s.length,
        h2s: h2s.slice(0, 10), // Limit to top 10
        wordCount: rawText.split(' ').length,
        externalLinks: links.length,
        sampleLinks: links.slice(0, 5)
      };

    } catch (err) {
      this.logger.error(`Failed to scrape ${url}: ${err.message}`);
      throw new BadRequestException(`Failed to scrape website: ${err.message}`);
    }
  }
}
