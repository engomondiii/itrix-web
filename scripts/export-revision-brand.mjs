// Use the approved vector source for social previews and icons; never typeset the logo.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const logo=await sharp('public/brand/itrix-logo-inverse.svg').resize({width:340}).png().toBuffer();
const background=Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#020406"/><text x="80" y="350" fill="#F8FAFC" font-size="48" font-family="Arial,sans-serif">Computational AI Infrastructure</text><text x="80" y="420" fill="#CBD5E1" font-size="27" font-family="Arial,sans-serif">Mathematical Intelligence</text><text x="80" y="550" fill="#CBD5E1" font-size="22" font-family="Arial,sans-serif">itrix.co.kr</text></svg>`);
const preview=await sharp(background).composite([{input:logo,left:80,top:80}]).png().toBuffer();
await fs.writeFile('public/og-image-v31-20261027.png',preview);
await fs.writeFile('public/og-image.png',preview);
for(const size of [16,32,64,180]){
 const symbol=await sharp('public/brand/itrix-x-inverse.svg').resize({width:Math.round(size*.62),height:Math.round(size*.62),fit:'inside'}).png().toBuffer();
 const png=await sharp({create:{width:size,height:size,channels:4,background:'#020406'}}).composite([{input:symbol,gravity:'center'}]).png().toBuffer();
 await fs.writeFile(`public/favicon-${size}.png`,png);
 if(size===64)await fs.writeFile('src/app/icon.png',png);
 if(size===180)await fs.writeFile('src/app/apple-icon.png',png);
 if(size===32){const h=Buffer.alloc(22);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(png.length,14);h.writeUInt32LE(22,18);await fs.writeFile('src/app/favicon.ico',Buffer.concat([h,png]));}
}
