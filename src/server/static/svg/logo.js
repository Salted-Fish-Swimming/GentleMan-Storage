function sym (p) {
  return { x: p.x, y: -p.y };
}

let svg = createNS('svg', {
  width:"100%",height:"100%",version:"1.1",
});
let logo1 = createNS('g', {
  transform: 'translate(0, 0)'
})
let path = createNS('path', {
  d: 'M 50 55 l -16 0 a 18 18 0 1 0 32 0',
  style: "fill: rgba(0, 0, 0, 0.9)"
});
let p1 = [
  {x: -30, y:   0},
  {x:   0, y:  -4},
  {x:  14, y:   0},
  {x:  -2, y: -30},
  {x:  18, y:   0},
];
p1.push(...p1.slice(0, 9).reverse().map(sym));
let pstr1 = p1.map((p) => `l ${p.x} ${p.y}`).join(' ');
console.log(pstr1);
console.log(p1.map(p => p.x).reduce((a, b) => a + b));
let path2 = createNS('path', {
  d: 'M 50 55 m 0 -2 ' + pstr1 + 'z',
  style: "stroke-width: 0; fill: rgba(0, 0, 0, 0.9)"
})
let rect1 = createNS('rect', {
  x: 0, y: 0, width: 100, height: 100,
  style: 'fill: rgba(0,0,0,0); stroke: rgba(72, 72, 72, 0.8); stroke-width: 2'
});
logo1.appendChild(path);
logo1.appendChild(path2);
// logo1.appendChild(rect1);
let dot1 = createNS('circle', {
  cx: 50, cy: 50, r: 50, stroke: '#888', fill: 'rgba(0,0,0,0)',
});
console.log(logo1.innerHTML);
// logo1.appendChild(dot1);

let logo2 = createNS('g', {
  transform: 'translate(100, 0)'
});
let p2 = [
  {x:  -3, y: -1},
  {x: -19, y: 20},
  {x:   2, y:  1},
  {x:  10, y: -8},
  {x:   5, y:  8},
  {x:  -2, y:  3},
  {x:  -3, y: 40},
  {x:  10, y: 10},
];
p2.push(...p2.slice(0, 9).reverse().map(sym));
let pstr2 = p2.map((p) => `l ${p.x} ${p.y}`).join(' ');
console.log(pstr2);
console.log(p2.map(p => p.x).reduce((a, b) => a + b));
let path3 = createNS('path', {
  d: 'M 50 15 ' + pstr2 + ' z',
  style: 'stroke-width: 0; fill: rgba(0, 0, 0, 0.9)',
});
let rect2 = createNS('rect', {
  x: 0, y: 0, width: 100, height: 100,
  style: 'fill: rgba(0,0,0,0); stroke: rgba(72, 72, 72, 0.8); stroke-width: 2'
});
logo2.appendChild(path3);
// logo2.appendChild(rect2);
let dot2 = createNS('circle', {
  cx: 50, cy: 50, r: 50, stroke: '#888', fill: 'rgba(0,0,0,0)',
});
// logo2.appendChild(dot2);
console.log(logo2.innerHTML);
svg.appendChild(logo1);
svg.appendChild(logo2);
let app = document.querySelector('#app');
app.appendChild(svg);