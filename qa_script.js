const apiHandler = require('./api/index.js');

async function testUrl(urlStr) {
    const kMatch = urlStr.match(/\?k=(.*)/);
    const kVal = kMatch ? decodeURIComponent(kMatch[1]) : '';

    const req = {
        url: urlStr,
        query: { k: kVal },
        headers: { host: 'www.cleanforme.co.kr', 'x-forwarded-proto': 'https' },
        method: 'GET'
    };
    
    let html = '';
    let statusCode = 200;
    let headers = {};
    
    const res = {
        status: (code) => { statusCode = code; return res; },
        setHeader: (k, v) => { headers[k] = v; return res; },
        send: (data) => { html = data; },
        end: (data) => { if (data) html = data; }
    };

    await apiHandler(req, res);
    return { statusCode, html, headers };
}

async function runQA() {
    const testUrls = [
        '/',
        '/?k=성남시-외벽청소',
        '/?k=분당-유리창청소',
        '/?k=수원시-준공청소',
        '/?k=과천-후드청소'
    ];

    for (let url of testUrls) {
        console.log(`\n============================`);
        console.log(`QA Testing: ${decodeURIComponent(url)}`);
        const { statusCode, html } = await testUrl(url);
        console.log(`HTTP Status: ${statusCode}`);
        
        // title
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        console.log(`Title: ${titleMatch ? titleMatch[1].trim() : 'NOT FOUND'}`);

        // meta desc
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([\s\S]*?)"/i) || html.match(/<meta[^>]*content="([\s\S]*?)"[^>]*name="description"/i);
        console.log(`Meta Desc: ${descMatch ? descMatch[1].trim() : 'NOT FOUND'}`);

        // h1
        const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        console.log(`H1: ${h1Match ? h1Match[1].trim().replace(/<[^>]+>/g, '') : 'NOT FOUND'}`); // strip tags

        // canonical
        const canMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([\s\S]*?)"/i);
        console.log(`Canonical: ${canMatch ? canMatch[1].trim() : 'NOT FOUND'}`);

        // robots
        const robMatch = html.match(/<meta[^>]*name="robots"[^>]*content="([\s\S]*?)"/i);
        console.log(`Robots: ${robMatch ? robMatch[1].trim() : 'NOT FOUND'}`);

        // PC CTA
        const pcCtaMatch = html.match(/<a href="tel:[^"]*" id="pc-cta-btn"[^>]*>([\s\S]*?)<\/a>/i);
        console.log(`PC CTA: ${pcCtaMatch ? pcCtaMatch[1].trim() : 'NOT FOUND'}`);

        // Mo CTA
        const moCtaMatch = html.match(/<span id="mo-cta-text" class="mo-cta-title">([\s\S]*?)<\/span>/i);
        console.log(`MO CTA: ${moCtaMatch ? moCtaMatch[1].trim() : 'NOT FOUND'}`);

        // FAQ Q1/A1
        const faq1Match = html.match(/<summary id="faq-q1">([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>/i);
        if(faq1Match) {
            console.log(`FAQ Q1: ${faq1Match[1].trim()}`);
            console.log(`FAQ A1: ${faq1Match[2].trim()}`);
        } else {
            console.log('FAQ Q1 NOT FOUND');
        }
    }
}

runQA();
