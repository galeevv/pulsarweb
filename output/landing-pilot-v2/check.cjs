const fs = require('fs');
const {createRequire} = require('module');
const sharp = createRequire(require.resolve('next'))('sharp');
const {chromium} = require('@playwright/test');
const path = require('path');
const out = __dirname;
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage();
  const records=[];
  for (const [width,route,label] of [[1440,'/','home-desktop'],[1440,'/services','catalog-desktop'],[1024,'/services','catalog-1024'],[768,'/services','catalog-tablet'],[1440,'/services/landing-pages','hero-desktop'],[360,'/','home-mobile'],[360,'/services','catalog-mobile'],[360,'/services/landing-pages','hero-mobile']]) {
    await page.setViewportSize({width,height:1000});
    await page.unrouteAll();
    const file=route==='/'?'landing-aer-home.webp':route==='/services/landing-pages'?'landing-aer-hero.webp':width<768?'landing-aer-catalog-mobile.webp':'landing-aer-wide.webp';
    await page.route('**/images/services/landing-form.webp',r=>r.fulfill({path:path.join(out,file),contentType:'image/webp'}));
    await page.goto('http://localhost:3000'+route);
    const img=page.locator('img[src*="landing-form"]').first();
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(i=>i.decode());
    const dimensions=await img.evaluate(i=>{const r=i.getBoundingClientRect(),s=getComputedStyle(i);return {width:r.width,height:r.height,fit:s.objectFit,position:s.objectPosition}});
    await img.locator('..').screenshot({path:path.join(out,'preview-'+label+'.png')});
    records.push({viewport:width,route,label,file,...dimensions});
  }
  await browser.close();
  fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify(records,null,2));
  let overlays=[],top=20;
  for (const {label,width,height} of records) {
    const input=path.join(out,'preview-'+label+'.png');
    const m=await sharp(input).metadata();
    const w=Math.min(m.width,700),h=Math.round(m.height*w/m.width);
    overlays.push({input:Buffer.from(`<svg width="760" height="32"><text x="20" y="22" font-family="Arial" font-size="15" fill="white">${label} | ${Math.round(width)} x ${Math.round(height)} CSS px</text></svg>`),left:0,top});
    top+=36;
    overlays.push({input:await sharp(input).resize(w,h).png().toBuffer(),left:20,top});
    top+=h+26;
  }
  await sharp({create:{width:760,height:top,channels:3,background:'#101010'}}).composite(overlays).webp({quality:90}).toFile(path.join(out,'crop-review.webp'));
  const manifest=[];
  for(const file of fs.readdirSync(out).filter(f=>/^(source|landing-aer).+\.(png|webp)$/.test(f))){const m=await sharp(path.join(out,file)).metadata();manifest.push({file,width:m.width,height:m.height,bytes:fs.statSync(path.join(out,file)).size});}
  fs.writeFileSync(path.join(out,'files.json'),JSON.stringify(manifest,null,2));
  console.log(manifest);
})();
