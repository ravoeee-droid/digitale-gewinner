const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const jobs=JSON.parse(fs.readFileSync(process.argv[2]));const b=await chromium.launch();
for(const j of jobs){const p=await b.newPage();await p.goto('file://'+j.html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.pdf({path:j.pdf,width:'210mm',height:'297mm',printBackground:true,preferCSSPageSize:true});console.log('pdf',j.slug)}
await b.close()})();
