
(function(){
  const c = document.getElementById('bg'), x = c.getContext('2d');
  let W, H, cell, cols, rows;
  const COLS = ['#5ae2f0','#ec56be','#ffba46','#96f05a','#c470fa'];

  function size(){
    W = c.width = innerWidth * devicePixelRatio;
    H = c.height = innerHeight * devicePixelRatio;
    c.style.width = innerWidth+'px'; c.style.height = innerHeight+'px';
    cell = Math.max(26, Math.round(W/46));
    cols = Math.ceil(W/cell)+2; rows = Math.ceil(H/cell)+2;
  }
  addEventListener('resize', size); size();

  // Las motos: se mueven por carriles y giran 90 grados, como en el juego.
  const D = [[1,0],[0,1],[-1,0],[0,-1]];
  function bike(i){
    return { c: Math.floor(Math.random()*cols), r: Math.floor(Math.random()*rows),
             d: Math.floor(Math.random()*4), t: 0, len: 26+Math.random()*44,
             trail: [], col: COLS[i % COLS.length], sp: .55+Math.random()*.7 };
  }
  const bikes = Array.from({length:5}, (_,i)=>bike(i));

  function step(b){
    b.t += b.sp;
    if (b.t < 1) return;
    b.t = 0;
    b.trail.push([b.c, b.r]);
    while (b.trail.length > b.len) b.trail.shift();
    if (Math.random() < .17) b.d = (b.d + (Math.random()<.5?1:3)) & 3;
    b.c += D[b.d][0]; b.r += D[b.d][1];
    if (b.c<-2||b.r<-2||b.c>cols+2||b.r>rows+2){ const n=bike(0); Object.assign(b,n,{col:b.col}); }
  }

  let t = 0;
  function frame(){
    t += .016;
    x.clearRect(0,0,W,H);
    // Rejilla, más tenue hacia arriba.
    x.lineWidth = 1*devicePixelRatio;
    for (let i=0;i<=cols;i++){
      const px = i*cell;
      x.strokeStyle = 'rgba(90,226,240,.055)';
      x.beginPath(); x.moveTo(px,0); x.lineTo(px,H); x.stroke();
    }
    for (let j=0;j<=rows;j++){
      const py = j*cell;
      x.strokeStyle = 'rgba(90,226,240,'+(.02+.05*(py/H))+')';
      x.beginPath(); x.moveTo(0,py); x.lineTo(W,py); x.stroke();
    }
    // Las motos y su muro.
    for (const b of bikes){
      step(b);
      const w = Math.max(2, cell*.17);
      for (let k=0;k<b.trail.length;k++){
        const a = k/b.trail.length;              // 0 cola … 1 cabeza
        const [cc,rr] = b.trail[k];
        x.fillStyle = b.col;
        x.globalAlpha = .06 + .5*a*a;            // se apaga hacia la cola
        x.fillRect(cc*cell - w/2, rr*cell - w/2, w, w);
        if (k<b.trail.length-1){
          const [nc,nr] = b.trail[k+1];
          x.fillRect(Math.min(cc,nc)*cell - w/2, Math.min(rr,nr)*cell - w/2,
                     Math.abs(nc-cc)*cell + w, Math.abs(nr-rr)*cell + w);
        }
      }
      x.globalAlpha = 1;
      x.shadowBlur = 18*devicePixelRatio; x.shadowColor = b.col;
      x.fillStyle = '#fff';
      x.fillRect(b.c*cell - cell*.11, b.r*cell - cell*.11, cell*.22, cell*.22);
      x.shadowBlur = 0;
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
