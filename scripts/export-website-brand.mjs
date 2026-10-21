// Deterministic exports of the supplied Favicon and OG_Image boards.
// Pass a directory containing Saira Condensed.ttf, Noto Sans KR.ttf, IBM Plex Mono.ttf.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import React from 'react';
import { ImageResponse } from 'next/og.js';
const fontDir = process.argv[2];
if (!fontDir) throw new Error('Pass the directory containing the three board fonts.');
const h=React.createElement;
const symbol=await sharp('public/brand/04ab13c455282df4fca1ffc47126b04a.png').negate({alpha:false}).png().toBuffer();
const logo=await sharp('public/brand/fa5afd04db046644e14564cf63d6de02.png').negate({alpha:false}).png().toBuffer();
for(const [size,width,radius] of [[180,104,36],[64,37,12],[32,18,6],[16,9,3]]){
 const icon=await sharp(symbol).resize({width}).toBuffer();const meta=await sharp(icon).metadata();
 const background=Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#020406"/></svg>`);
 const png=await sharp(background).composite([{input:icon,left:Math.round((size-width)/2),top:Math.round((size-meta.height)/2)}]).png().toBuffer();
 await fs.writeFile(`public/favicon-${size}.png`,png);
 if(size===180)await fs.writeFile('src/app/apple-icon.png',png);
 if(size===64)await fs.writeFile('src/app/icon.png',png);
}
// A standard ICO wrapping PNG data; no new or modified symbol geometry.
const small=await fs.readFile('public/favicon-32.png');const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=32;header[7]=32;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(small.length,14);header.writeUInt32LE(22,18);await fs.writeFile('src/app/favicon.ico',Buffer.concat([header,small]));
const data=b=>'data:image/png;base64,'+b.toString('base64');
const fonts=await Promise.all([['Saira Condensed',600],['Noto Sans KR',400],['IBM Plex Mono',400]].map(async([name,weight])=>({name,weight,style:'normal',data:await fs.readFile(path.join(fontDir,name+'.ttf'))})));
const image=new ImageResponse(h('div',{style:{width:1200,height:630,padding:'72px 80px',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'radial-gradient(70% 90% at 95% 0%, rgba(120,160,175,0.32) 0%, rgba(2,4,6,0) 65%), radial-gradient(40% 60% at 0% 100%, rgba(214,230,255,0.08) 0%, rgba(2,4,6,0) 70%), #020406',color:'#F8FAFC',fontFamily:'Noto Sans KR',position:'relative',overflow:'hidden'}},
 h('img',{src:data(symbol),alt:'',width:520,style:{position:'absolute',right:-60,bottom:-90,opacity:.07}}),
 h('img',{src:data(logo),alt:'itriX',width:180}),
 h('div',{style:{display:'flex',flexDirection:'column',gap:20}},h('div',{style:{display:'flex',flexDirection:'column',fontFamily:'Saira Condensed',fontSize:84,fontWeight:600,lineHeight:1.02,letterSpacing:'-.01em'}},h('span',null,'Building Computational'),h('span',null,'AI Infrastructure.')),h('span',{style:{fontSize:26,color:'#CBD5E1'}},'수학에서 새로운 가치를 발견합니다.')),
 h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'IBM Plex Mono',fontSize:20,letterSpacing:'.1em',color:'#94A3B8'}},h('span',null,'ASTOP · PRISM · AXIOM'),h('span',null,'itrix.co.kr'))),{width:1200,height:630,fonts});
await fs.writeFile('public/og-image.png',Buffer.from(await image.arrayBuffer()));
