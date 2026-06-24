const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoul-clening-03.vercel.app';
const NOW = new Date().toUTCString();

const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>클린폼 종합청소</title>
    <link>${BASE_URL}</link>
    <description>수도권 전역 외벽청소, 유리창청소, 특수청소 전문 클린폼</description>
    <language>ko</language>
    <lastBuildDate>${NOW}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>클린폼 홈</title>
      <link>${BASE_URL}/</link>
      <description>수도권 종합청소 전문 클린폼 메인페이지</description>
      <pubDate>${NOW}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/</guid>
    </item>
    <item>
      <title>클린폼 서비스 지역 및 작업 안내</title>
      <link>${BASE_URL}/seo-hub.html</link>
      <description>클린폼의 전체 서비스 지역과 작업 항목을 확인할 수 있는 SEO 허브입니다.</description>
      <pubDate>${NOW}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/seo-hub.html</guid>
    </item>
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, '../rss.xml'), rssContent, 'utf8');
console.log('rss.xml created successfully.');
