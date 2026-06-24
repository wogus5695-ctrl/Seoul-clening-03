const http = require('http');
const apiHandler = require('./api/index.js'); // Vercel handler

const server = http.createServer((req, res) => {
    apiHandler(req, res);
});

server.listen(3001, async () => {
    try {
        const fetch = (await import('node-fetch')).default;
        
        // Test 1: 판교동-인테리어후청소
        const res1 = await fetch('http://localhost:3001/?k=' + encodeURIComponent('판교동-인테리어후청소'));
        const html1 = await res1.text();
        
        console.log("=== 판교동-인테리어후청소 FAQ ===");
        const faqMatch = html1.match(/<summary id="faq-q1">([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>/i);
        if(faqMatch) {
            console.log("Q1:", faqMatch[1].trim());
            console.log("A1:", faqMatch[2].trim());
        }

        const faqMatch2 = html1.match(/<summary id="faq-q3">([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>/i);
        if(faqMatch2) {
            console.log("Q3:", faqMatch2[1].trim());
            console.log("A3:", faqMatch2[2].trim());
        }

        // Test 2: 신흥동-외벽청소
        const res2 = await fetch('http://localhost:3001/?k=' + encodeURIComponent('신흥동-외벽청소'));
        const html2 = await res2.text();
        
        console.log("\n=== 신흥동-외벽청소 FAQ ===");
        const faqMatch3 = html2.match(/<summary id="faq-q1">([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>/i);
        if(faqMatch3) {
            console.log("Q1:", faqMatch3[1].trim());
            console.log("A1:", faqMatch3[2].trim());
        }
        
    } catch(e) {
        console.error(e);
    } finally {
        server.close();
    }
});
