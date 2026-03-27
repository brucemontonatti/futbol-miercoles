import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, collection, onSnapshot,
  setDoc, updateDoc, getDoc, deleteDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBVp0DKNDM9mu2caZ2o3VgkFUPXk5hEXg",
  authDomain: "futbol-miercoles-9ea99.firebaseapp.com",
  projectId: "futbol-miercoles-9ea99",
  storageBucket: "futbol-miercoles-9ea99.firebasestorage.app",
  messagingSenderId: "852797545386",
  appId: "1:852797545386:web:b680309da610b8764969d3"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const INITIAL_PLAYERS = [
  { id:"agus",   name:"Agus",   positions:["Delantero"],                active:true },
  { id:"bruce",  name:"Bruce",  positions:["Arquero","Defensor"],        active:true },
  { id:"brusco", name:"Brusco", positions:["Defensor","Delantero"],      active:true },
  { id:"devo",   name:"Devo",   positions:["Defensor"],                  active:true },
  { id:"facu",   name:"Facu",   positions:["Mediocampista","Delantero"], active:true },
  { id:"faso",   name:"Faso",   positions:["Arquero"],                   active:true },
  { id:"joni",   name:"Joni",   positions:["Delantero"],                 active:true },
  { id:"juanma", name:"Juanma", positions:["Defensor","Mediocampista"],  active:true },
  { id:"juano",  name:"Juano",  positions:["Delantero"],                 active:true },
  { id:"kevo",   name:"Kevo",   positions:["Defensor","Mediocampista"],  active:true },
  { id:"lauta",  name:"Lauta",  positions:["Delantero"],                 active:true },
  { id:"lucho",  name:"Lucho",  positions:["Defensor"],                  active:true },
  { id:"martin", name:"Martín", positions:["Mediocampista"],             active:true },
  { id:"maxi",   name:"Maxi",   positions:["Defensor","Delantero"],      active:true },
  { id:"ratti",  name:"Ratti",  positions:["Defensor"],                  active:true },
  { id:"rowy",   name:"Rowy",   positions:["Mediocampista","Delantero"], active:true },
  { id:"santi",  name:"Santi",  positions:["Mediocampista"],             active:true },
  { id:"teo",    name:"Teo",    positions:["Defensor"],                  active:true },
  { id:"tincho", name:"Tincho", positions:["Delantero"],                 active:true },
  { id:"tomi",   name:"Tomi",   positions:["Delantero"],                 active:true },
  { id:"tute",   name:"Tute",   positions:["Defensor","Mediocampista"],  active:true },
];

const INITIAL_STATS = {
  agus:   { pj:6,  wins:3, draws:0, losses:3, dg:4  },
  bruce:  { pj:9,  wins:4, draws:1, losses:4, dg:4  },
  brusco: { pj:1,  wins:0, draws:1, losses:0, dg:0  },
  devo:   { pj:3,  wins:1, draws:1, losses:1, dg:-4 },
  facu:   { pj:1,  wins:1, draws:0, losses:0, dg:6  },
  faso:   { pj:9,  wins:4, draws:1, losses:4, dg:-4 },
  joni:   { pj:2,  wins:1, draws:0, losses:1, dg:-6 },
  juanma: { pj:8,  wins:3, draws:1, losses:4, dg:5  },
  juano:  { pj:8,  wins:2, draws:1, losses:5, dg:-14},
  kevo:   { pj:7,  wins:3, draws:1, losses:3, dg:-4 },
  lauta:  { pj:1,  wins:1, draws:0, losses:0, dg:5  },
  lucho:  { pj:8,  wins:4, draws:1, losses:3, dg:-5 },
  martin: { pj:1,  wins:0, draws:0, losses:1, dg:-7 },
  maxi:   { pj:6,  wins:1, draws:1, losses:4, dg:-12},
  ratti:  { pj:4,  wins:2, draws:0, losses:2, dg:5  },
  rowy:   { pj:7,  wins:5, draws:1, losses:1, dg:14 },
  santi:  { pj:9,  wins:5, draws:1, losses:3, dg:0  },
  teo:    { pj:2,  wins:1, draws:0, losses:1, dg:1  },
  tincho: { pj:1,  wins:1, draws:0, losses:0, dg:6  },
  tomi:   { pj:8,  wins:3, draws:1, losses:4, dg:1  },
  tute:   { pj:8,  wins:3, draws:0, losses:5, dg:-2 },
};

const INITIAL_MATCHES = [
  { id:"m1", fecha:1, date:"07/01/2026", negro:["maxi","agus","kevo","juano","tute","lucho"],     blanco:["tomi","santi","faso","juanma","bruce","rowy"],   gn:0, gb:2, winner:"blanco" },
  { id:"m2", fecha:2, date:"14/01/2026", negro:["tute","lucho","bruce","juanma","maxi","agus"],   blanco:["santi","faso","rowy","juano","lauta","devo"],    gn:5, gb:0, winner:"negro"  },
  { id:"m3", fecha:3, date:"21/01/2026", negro:["santi","tute","rowy","joni","lucho","agus"],     blanco:["tomi","maxi","juano","juanma","bruce","martin"], gn:7, gb:0, winner:"negro"  },
  { id:"m4", fecha:4, date:"28/01/2026", negro:["maxi","ratti","juanma","juano","santi","lucho"], blanco:["tomi","bruce","rowy","tute","kevo","faso"],      gn:0, gb:2, winner:"blanco" },
  { id:"m5", fecha:5, date:"04/02/2026", negro:["agus","tute","juano","rowy","lucho","santi"],    blanco:["tomi","joni","juanma","kevo","bruce","faso"],    gn:0, gb:2, winner:"blanco" },
  { id:"m6", fecha:6, date:"11/02/2026", negro:["agus","lucho","kevo","juano","tute","santi"],    blanco:["tomi","teo","bruce","juanma","ratti","faso"],    gn:2, gb:0, winner:"negro"  },
  { id:"m7", fecha:7, date:"18/02/2026", negro:["tute","santi","teo","juano","ratti","agus"],     blanco:["tomi","faso","rowy","kevo","bruce","devo"],      gn:1, gb:0, winner:"negro"  },
  { id:"m8", fecha:8, date:"25/02/2026", negro:["santi","maxi","kevo","rowy","lucho","juanma"],   blanco:["tomi","bruce","brusco","faso","juano","devo"],   gn:0, gb:0, winner:"empate" },
  { id:"m9", fecha:9, date:"04/03/2026", negro:["santi","tute","kevo","juanma","lucho","maxi"],   blanco:["tomi","bruce","ratti","faso","tincho","facu"],   gn:0, gb:6, winner:"blanco" },
];

const POSITIONS = ["Arquero","Defensor","Mediocampista","Delantero"];
const ADMIN_PASSWORD = "futbolpointmiercoles";

function uid() { return Math.random().toString(36).substr(2,9); }
function pts(s) { return (s?.wins||0)*3 + (s?.draws||0); }
function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ─── SORTEO INTELIGENTE ───────────────────────────────────────────────────────
// Asigna role según posición primaria, respetando límite de arqueros por equipo
function assignRole(player, arqueroCount) {
  const primary = player.positions[0];
  if (primary === "Arquero" && arqueroCount < 1) return "Arquero";
  if (primary === "Arquero" && arqueroCount >= 1) {
    // usar posición secundaria si existe
    return player.positions[1] || "Jugador";
  }
  return primary || "Jugador";
}

function buildTwoOptions(selectedIds, players, stats) {
  const selected = players.filter(p => selectedIds.includes(p.id));
  if (selected.length < 12) return null;

  // Detectar arqueros por cualquier posición (primaria o secundaria)
  const arquerosPrimary   = selected.filter(p => p.positions[0] === "Arquero");
  const arquerosSecondary = selected.filter(p => p.positions[0] !== "Arquero" && p.positions.includes("Arquero"));
  let arqueros = [...arquerosPrimary, ...arquerosSecondary];
  const campoPool = selected.filter(p => !arqueros.find(a=>a.id===p.id));
  // Garantizar al menos 2 arqueros
  while (arqueros.length < 2 && campoPool.length > 0) arqueros.push(campoPool.shift());

  const campoIds = new Set(arqueros.map(p=>p.id));
  const campo = selected.filter(p => !campoIds.has(p.id));
  const ranked = [...campo].sort((a,b) => pts(stats[b.id]||{}) - pts(stats[a.id]||{}));

  const makeBalancedTeams = () => {
    let negro = [], blanco = [];
    const shuffledArqs = shuffle(arqueros);
    negro.push({ ...shuffledArqs[0], role:"Arquero" });
    blanco.push({ ...shuffledArqs[1], role:"Arquero" });
    const extraArqs = shuffledArqs.slice(2).map(p=>({...p, role:p.positions.find(pos=>pos!=="Arquero")||"Defensor"}));
    const pool = [...ranked, ...extraArqs];
    const shuffledPool = [...pool];
    for(let i=0;i<shuffledPool.length;i+=2){
      if(Math.random()<0.4&&shuffledPool[i+1]){const t=shuffledPool[i];shuffledPool[i]=shuffledPool[i+1];shuffledPool[i+1]=t;}
    }
    const order=[0,1,1,0,0,1,1,0,0,1,1,0];
    shuffledPool.forEach((p,i)=>{
      if(negro.length+blanco.length>=12)return;
      const role=p.role||p.positions[0]||"Jugador";
      if(order[i%order.length]===0&&negro.length<6)negro.push({...p,role});
      else if(blanco.length<6)blanco.push({...p,role});
      else negro.push({...p,role});
    });
    return { negro:negro.slice(0,6), blanco:blanco.slice(0,6) };
  };

  const arqsSeparados = (opt) => {
    const an = opt.negro.filter(p=>p.role==="Arquero").map(p=>p.id);
    const ab = opt.blanco.filter(p=>p.role==="Arquero").map(p=>p.id);
    return an.length===1 && ab.length===1 && an[0]!==ab[0];
  };

  let opt1=makeBalancedTeams(), a1=0;
  while(!arqsSeparados(opt1)&&a1++<20) opt1=makeBalancedTeams();

  let opt2=makeBalancedTeams(), a2=0;
  while((a2++<20)&&(!arqsSeparados(opt2)||JSON.stringify(opt1.negro.map(p=>p.id).sort())===JSON.stringify(opt2.negro.map(p=>p.id).sort()))) opt2=makeBalancedTeams();

  return { azul:opt1, naranja:opt2 };
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0d0d0d; --bg2:#141414; --bg3:#1c1c1c;
    --border:rgba(255,255,255,0.07); --text:#f0f0f0; --muted:rgba(255,255,255,0.35);
    --azul:#2979ff; --azul-light:#64b5f6;
    --naranja:#ff6d00; --naranja-light:#ffab40;
    --green:#00e676; --red:#ff5252; --yellow:#ffd740;
  }
  body { background:var(--bg); color:var(--text); font-family:'Barlow',sans-serif; overscroll-behavior:none; }
  .app { min-height:100vh; display:flex; flex-direction:column; }
  .header { background:linear-gradient(180deg,#111 0%,#0d0d0d 100%); border-bottom:1px solid var(--border); padding:14px 20px 0; position:sticky; top:0; z-index:100; }
  .header-top { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
  .header-badge { background:var(--azul); border-radius:6px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .header-title { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:900; letter-spacing:1px; line-height:1; color:#fff; }
  .header-sub { font-size:11px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-top:2px; display:flex; align-items:center; gap:4px; }
  .header-fecha { margin-left:auto; background:rgba(41,121,255,0.15); border:1px solid rgba(41,121,255,0.3); border-radius:6px; padding:4px 10px; font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; color:var(--azul-light); letter-spacing:1px; }
  nav { display:flex; gap:0; overflow-x:auto; scrollbar-width:none; }
  nav::-webkit-scrollbar { display:none; }
  .nav-btn { flex:1; min-width:60px; padding:10px 8px 9px; background:none; border:none; border-bottom:2px solid transparent; color:var(--muted); cursor:pointer; font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; transition:all 0.18s; display:flex; flex-direction:column; align-items:center; gap:3px; }
  .nav-btn .ni { font-size:16px; }
  .nav-btn.active { color:var(--azul-light); border-bottom-color:var(--azul); }
  .nav-btn:hover:not(.active) { color:rgba(255,255,255,0.6); background:rgba(255,255,255,0.03); }
  .content { flex:1; padding:20px 16px 90px; max-width:520px; margin:0 auto; width:100%; }
  .section-title { font-family:'Barlow Condensed',sans-serif; font-size:26px; font-weight:900; letter-spacing:1px; color:#fff; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .section-title .accent { color:var(--azul-light); }
  .card { background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:14px; margin-bottom:10px; }
  .card-title { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
  .player-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .player-row:last-child { border-bottom:none; }
  .avatar { width:34px; height:34px; border-radius:8px; flex-shrink:0; background:var(--bg3); display:flex; align-items:center; justify-content:center; font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:800; color:rgba(255,255,255,0.6); }
  .avatar.selected { background:rgba(41,121,255,0.2); color:var(--azul-light); }
  .player-info { flex:1; min-width:0; }
  .player-name { font-size:14px; font-weight:600; color:#fff; }
  .player-pos { display:flex; flex-wrap:wrap; gap:4px; margin-top:3px; }
  .pos-tag { background:var(--bg3); border-radius:4px; padding:1px 6px; font-size:10px; color:var(--muted); border:1px solid var(--border); }
  .pos-tag.arq { border-color:rgba(255,215,64,0.3); color:var(--yellow); background:rgba(255,215,64,0.06); }
  .toggle-btn { padding:5px 12px; border-radius:6px; border:1.5px solid; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.15s; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.5px; white-space:nowrap; }
  .toggle-btn.in { background:var(--azul); border-color:var(--azul); color:#fff; }
  .toggle-btn.out { background:transparent; border-color:rgba(255,255,255,0.15); color:var(--muted); }
  .toggle-btn.disabled { opacity:0.3; cursor:not-allowed; }
  .counter-row { display:flex; justify-content:space-between; align-items:center; background:var(--bg3); border-radius:8px; padding:12px 14px; margin-bottom:14px; border:1px solid var(--border); }
  .counter-num { font-family:'Barlow Condensed',sans-serif; font-size:36px; font-weight:900; line-height:1; }
  .counter-num.ok { color:var(--green); }
  .counter-num.warn { color:var(--yellow); }
  .counter-num.muted { color:var(--muted); }
  .counter-label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
  .btn { width:100%; padding:13px; border:none; border-radius:8px; font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all 0.15s; margin-top:8px; }
  .btn-primary { background:var(--azul); color:#fff; }
  .btn-primary:hover { background:#3d8bff; }
  .btn-ghost { background:transparent; color:var(--azul-light); border:1.5px solid var(--azul); }
  .btn-ghost:hover { background:rgba(41,121,255,0.1); }
  .btn-green { background:var(--green); color:#000; }
  .btn-sm { padding:6px 14px; border:none; border-radius:6px; font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .team-block { flex:1; border-radius:10px; padding:12px; border:2px solid transparent; transition:all 0.2s; position:relative; overflow:hidden; }
  .team-block.azul { background:rgba(41,121,255,0.07); border-color:rgba(41,121,255,0.2); }
  .team-block.naranja { background:rgba(255,109,0,0.07); border-color:rgba(255,109,0,0.2); }
  .team-block.selected-opt.azul { border-color:var(--azul); background:rgba(41,121,255,0.15); }
  .team-block.selected-opt.naranja { border-color:var(--naranja); background:rgba(255,109,0,0.15); }
  .opt-label { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:800; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .opt-label.azul { color:var(--azul-light); }
  .opt-label.naranja { color:var(--naranja-light); }
  .team-section { margin-bottom:8px; }
  .team-section-label { font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
  .team-player-chip { background:rgba(255,255,255,0.05); border-radius:5px; padding:4px 8px; font-size:12px; font-weight:600; color:rgba(255,255,255,0.8); display:inline-flex; align-items:center; gap:4px; margin:2px; cursor:pointer; transition:all 0.15s; }
  .team-player-chip:hover { background:rgba(255,255,255,0.12); }
  .team-player-chip.arq { color:var(--yellow); background:rgba(255,215,64,0.1); border:1px solid rgba(255,215,64,0.25); }
  .team-player-chip.selected-swap { background:var(--azul); color:#fff; outline:2px solid var(--azul-light); }
  .options-row { display:flex; gap:10px; margin-bottom:12px; }
  .chosen-badge { position:absolute; top:8px; right:8px; background:var(--green); color:#000; border-radius:4px; font-size:10px; font-weight:800; padding:2px 6px; letter-spacing:1px; font-family:'Barlow Condensed',sans-serif; }
  .vote-bar { height:6px; background:var(--bg3); border-radius:3px; overflow:hidden; margin:8px 0; }
  .vote-fill-azul { height:100%; background:var(--azul); border-radius:3px; transition:width 0.4s; }
  .vote-count { display:flex; justify-content:space-between; font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; }
  .voter-row { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.03); font-size:13px; font-weight:500; }
  .voter-row:last-child { border-bottom:none; }
  .match-card { background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:8px; }
  .match-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .match-fecha { font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; color:var(--muted); }
  .result-pill { font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:800; letter-spacing:1px; padding:2px 8px; border-radius:4px; text-transform:uppercase; }
  .result-pill.negro { background:rgba(224,224,224,0.12); color:#e0e0e0; }
  .result-pill.blanco { background:rgba(250,250,250,0.12); color:#fafafa; }
  .result-pill.empate { background:rgba(255,255,255,0.07); color:var(--muted); }
  .match-score-row { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:10px; }
  .score-team { text-align:center; flex:1; }
  .score-team-name { font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; letter-spacing:1px; color:var(--muted); margin-bottom:4px; }
  .score-num { font-family:'Barlow Condensed',sans-serif; font-size:44px; font-weight:900; line-height:1; }
  .score-num.winner-score { color:#fff; }
  .score-num.loser-score { color:rgba(255,255,255,0.3); }
  .score-divider { font-family:'Barlow Condensed',sans-serif; font-size:28px; color:var(--muted); }
  .match-players-row { display:flex; gap:10px; }
  .match-team-list { flex:1; }
  .match-team-label { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
  .match-player-name { font-size:12px; color:rgba(255,255,255,0.6); line-height:1.7; }
  .tabla-header { display:flex; align-items:center; gap:8px; padding:0 0 8px; border-bottom:1px solid var(--border); font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); }
  .tabla-row { display:flex; align-items:center; gap:8px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.03); }
  .tabla-row:last-child { border-bottom:none; }
  .rank { width:20px; text-align:center; font-family:'Barlow Condensed',sans-serif; font-size:16px; color:var(--muted); flex-shrink:0; }
  .rank.gold { color:var(--yellow); }
  .rank.silver { color:#b0bec5; }
  .rank.bronze { color:#ff8a65; }
  .stat-col { text-align:center; flex-shrink:0; }
  .stat-val { font-family:'Barlow Condensed',sans-serif; font-size:17px; font-weight:700; line-height:1; }
  .stat-lbl { font-size:9px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; }
  .pts-col { background:var(--azul); color:#fff; border-radius:6px; font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:900; width:38px; text-align:center; padding:3px 0; flex-shrink:0; }
  .dg-positive { color:var(--green); }
  .dg-negative { color:var(--red); }
  .dg-zero { color:var(--muted); }
  .winbar { height:3px; background:rgba(255,255,255,0.07); border-radius:2px; margin-top:3px; overflow:hidden; }
  .winbar-fill { height:100%; background:var(--azul); border-radius:2px; }
  .form-input { width:100%; padding:10px 12px; background:var(--bg3); border:1.5px solid var(--border); border-radius:8px; color:#fff; font-size:14px; font-family:'Barlow',sans-serif; outline:none; margin-bottom:8px; transition:border-color 0.15s; }
  .form-input:focus { border-color:var(--azul); }
  .pos-selector { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
  .pos-toggle { padding:5px 12px; border-radius:6px; border:1.5px solid var(--border); background:transparent; color:var(--muted); cursor:pointer; font-size:12px; font-weight:600; font-family:'Barlow Condensed',sans-serif; transition:all 0.15s; }
  .pos-toggle.selected { background:rgba(41,121,255,0.2); border-color:var(--azul); color:var(--azul-light); }
  .result-input-row { display:flex; align-items:center; gap:10px; margin:12px 0; }
  .result-team { flex:1; text-align:center; }
  .result-team label { display:block; font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; margin-bottom:6px; color:var(--muted); }
  .result-team input { width:100%; text-align:center; padding:10px; background:var(--bg3); border:1.5px solid var(--border); border-radius:8px; color:#fff; font-size:32px; font-family:'Barlow Condensed',sans-serif; font-weight:900; outline:none; }
  .result-team input:focus { border-color:var(--azul); }
  .result-vs { font-family:'Barlow Condensed',sans-serif; font-size:24px; color:var(--muted); padding-top:20px; }
  .notif { position:fixed; bottom:72px; left:50%; transform:translateX(-50%); background:#fff; color:#000; padding:9px 22px; border-radius:20px; font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; letter-spacing:0.5px; z-index:999; white-space:nowrap; box-shadow:0 4px 24px rgba(0,0,0,0.6); animation:notifIn 0.25s ease; }
  .notif.error { background:var(--red); color:#fff; }
  .notif.success { background:var(--green); color:#000; }
  @keyframes notifIn { from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .empty { text-align:center; padding:48px 20px; color:var(--muted); font-size:14px; }
  .empty-icon { font-size:44px; margin-bottom:12px; }
  .divider { height:1px; background:var(--border); margin:16px 0; }
  .stats-mini { display:flex; gap:8px; margin-top:4px; }
  .stat-chip { background:var(--bg3); border-radius:4px; padding:2px 7px; font-size:10px; font-weight:600; color:var(--muted); border:1px solid var(--border); }
  .two-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
  .stat-summary-card { background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center; }
  .stat-summary-val { font-family:'Barlow Condensed',sans-serif; font-size:32px; font-weight:900; color:var(--azul-light); line-height:1; }
  .stat-summary-lbl { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
  .del-btn { background:none; border:none; color:rgba(255,255,255,0.15); cursor:pointer; font-size:16px; padding:4px; transition:color 0.15s; }
  .del-btn:hover { color:var(--red); }
  .phase-steps { display:flex; gap:0; margin-bottom:16px; }
  .phase-step { flex:1; text-align:center; padding:8px 4px; border-bottom:2px solid var(--border); font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; letter-spacing:1px; color:var(--muted); transition:all 0.2s; }
  .phase-step.active { border-bottom-color:var(--azul); color:var(--azul-light); }
  .phase-step.done { border-bottom-color:var(--green); color:var(--green); }
  .step-num { font-size:18px; font-weight:900; display:block; }
  .admin-bar { display:flex; align-items:center; justify-content:space-between; background:rgba(255,215,64,0.06); border:1px solid rgba(255,215,64,0.2); border-radius:8px; padding:8px 14px; margin-bottom:14px; font-family:'Barlow Condensed',sans-serif; }
  .admin-bar-label { font-size:13px; font-weight:700; color:var(--yellow); letter-spacing:1px; }
  .admin-bar-sub { font-size:11px; color:var(--muted); margin-top:1px; }
  .admin-login-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .admin-login-box { background:var(--bg2); border:1px solid rgba(255,215,64,0.3); border-radius:14px; padding:28px 24px; width:100%; max-width:340px; }
  .admin-login-title { font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight:900; letter-spacing:2px; color:var(--yellow); margin-bottom:6px; }
  .admin-login-sub { font-size:13px; color:var(--muted); margin-bottom:20px; }
  .admin-lock-btn { background:none; border:1px solid rgba(255,215,64,0.3); border-radius:6px; color:var(--yellow); padding:5px 12px; cursor:pointer; font-size:12px; font-family:'Barlow Condensed',sans-serif; font-weight:700; letter-spacing:1px; transition:all 0.15s; }
  .admin-lock-btn:hover { background:rgba(255,215,64,0.1); }
  .admin-lock-btn.active { background:rgba(255,215,64,0.15); border-color:var(--yellow); }
  .locked-section { text-align:center; padding:36px 20px; border:1px dashed rgba(255,215,64,0.2); border-radius:10px; margin-bottom:12px; }
  .locked-icon { font-size:36px; margin-bottom:10px; }
  .locked-text { font-family:'Barlow Condensed',sans-serif; font-size:16px; font-weight:700; letter-spacing:1px; color:var(--muted); }
  .locked-sub { font-size:12px; color:rgba(255,255,255,0.25); margin-top:6px; }
  .input-error { border-color:var(--red) !important; }
  .error-msg { color:var(--red); font-size:12px; margin-top:-4px; margin-bottom:8px; font-family:'Barlow Condensed',sans-serif; }
  .user-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:300; display:flex; align-items:center; justify-content:center; padding:20px; }
  .user-box { background:var(--bg2); border:1px solid rgba(41,121,255,0.3); border-radius:14px; padding:28px 24px; width:100%; max-width:360px; }
  .user-box-title { font-family:'Barlow Condensed',sans-serif; font-size:26px; font-weight:900; letter-spacing:2px; color:var(--azul-light); margin-bottom:6px; }
  .user-box-sub { font-size:13px; color:var(--muted); margin-bottom:20px; }
  .user-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; max-height:360px; overflow-y:auto; }
  .user-btn { background:var(--bg3); border:1.5px solid var(--border); border-radius:8px; color:#fff; padding:10px 8px; font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.15s; text-align:center; }
  .user-btn:hover { border-color:var(--azul); background:rgba(41,121,255,0.12); color:var(--azul-light); }
  .sync-dot { width:7px; height:7px; border-radius:50%; background:var(--green); display:inline-block; animation:pulse 2s infinite; flex-shrink:0; }
  .sync-dot.offline { background:var(--red); animation:none; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
  .loading-screen { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--bg); gap:16px; }
  .loading-ball { font-size:48px; animation:spin 1s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
  .loading-text { font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:700; letter-spacing:2px; color:var(--muted); }
  /* SWAP OVERLAY */
  .swap-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:200; display:flex; align-items:flex-end; justify-content:center; padding:20px; }
  .swap-box { background:var(--bg2); border:1px solid rgba(41,121,255,0.4); border-radius:14px; padding:20px; width:100%; max-width:400px; }
  .swap-title { font-family:'Barlow Condensed',sans-serif; font-size:18px; font-weight:900; letter-spacing:1px; color:var(--azul-light); margin-bottom:4px; }
  .swap-sub { font-size:12px; color:var(--muted); margin-bottom:14px; }
  .swap-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .swap-player-btn { background:var(--bg3); border:1.5px solid var(--border); border-radius:8px; color:#fff; padding:10px 8px; font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.15s; text-align:center; }
  .swap-player-btn:hover { border-color:var(--green); color:var(--green); }
  .swap-player-btn.negro-team { border-left:3px solid #888; }
  .swap-player-btn.blanco-team { border-left:3px solid #fff; }
  /* PITCH */
  .pitch-wrapper { position:relative; margin:0 auto; width:100%; }
  .pitch-download-btn { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:10px; margin-top:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff; font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700; letter-spacing:1px; cursor:pointer; transition:background 0.15s; }
  .pitch-download-btn:hover { background:rgba(255,255,255,0.12); }
`;


// ─── PITCH SVG ───────────────────────────────────────────────────────────────
function PitchSVG({ negro, blanco, fecha, isAdmin }) {
  const W = 360, H = 560;
  const svgRef = useRef(null);

  // Layout fijo 1-2-1-2 basado en posiciones reales del jugador
  const layoutTeam = (team) => {
    const arq  = team.find(p => p.role === "Arquero") || team[0];
    const rest = team.filter(p => p.id !== arq.id);
    const score = (p) => {
      const pos = p.positions[0];
      if (pos === "Defensor")      return 0;
      if (pos === "Mediocampista") return 1;
      return 2;
    };
    const sorted = [...rest].sort((a,b) => score(a) - score(b));
    return { arq, defs: sorted.slice(0,2), med: sorted[2]||null, dels: sorted.slice(3) };
  };

  // Posiciones iniciales en la cancha
  const initPositions = () => {
    const pos = {};
    const nL = layoutTeam(negro);
    const bL = layoutTeam(blanco);
    const rx = (n) => n===1?[W/2]:n===2?[W*.28,W*.72]:n===3?[W*.18,W/2,W*.82]:[W*.15,W*.38,W*.62,W*.85];
    pos[`n_${nL.arq.id}`] = { x:W/2, y:H*.06 };
    nL.defs.forEach((p,i) => { pos[`n_${p.id}`] = { x:rx(2)[i], y:H*.19 }; });
    if(nL.med) pos[`n_${nL.med.id}`] = { x:W/2, y:H*.31 };
    nL.dels.forEach((p,i) => { pos[`n_${p.id}`] = { x:rx(nL.dels.length)[i], y:H*.43 }; });
    pos[`b_${bL.arq.id}`] = { x:W/2, y:H*.94 };
    bL.defs.forEach((p,i) => { pos[`b_${p.id}`] = { x:rx(2)[i], y:H*.81 }; });
    if(bL.med) pos[`b_${bL.med.id}`] = { x:W/2, y:H*.69 };
    bL.dels.forEach((p,i) => { pos[`b_${p.id}`] = { x:rx(bL.dels.length)[i], y:H*.57 }; });
    return pos;
  };

  const [positions, setPositions] = useState(initPositions);
  const [names, setNames] = useState(() => {
    const obj = {};
    negro.forEach(p  => { obj[`n_${p.id}`] = p.name; });
    blanco.forEach(p => { obj[`b_${p.id}`] = p.name; });
    return obj;
  });
  const [editMode,   setEditMode]   = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editVal,    setEditVal]    = useState("");
  const [dragging,   setDragging]   = useState(null);

  const getName = (key) => names[key] ?? key;
  const confirmEdit = () => {
    if (editingKey) setNames(n => ({...n, [editingKey]: editVal.trim() || editVal}));
    setEditingKey(null);
  };

  // Drag handlers
  const getSVGPoint = (clientX, clientY) => {
    const svg = svgRef.current; if (!svg) return {x:0,y:0};
    const rect = svg.getBoundingClientRect();
    return { x:(clientX-rect.left)*(W/rect.width), y:(clientY-rect.top)*(H/rect.height) };
  };
  const onDragStart = (key, clientX, clientY) => {
    if (!isAdmin) return;
    const pt = getSVGPoint(clientX, clientY);
    const cur = positions[key];
    setDragging({ key, offX: pt.x-cur.x, offY: pt.y-cur.y });
  };
  const onDragMove = (clientX, clientY) => {
    if (!dragging) return;
    const pt = getSVGPoint(clientX, clientY);
    setPositions(p => ({...p, [dragging.key]: {
      x: Math.max(24, Math.min(W-24, pt.x-dragging.offX)),
      y: Math.max(24, Math.min(H-24, pt.y-dragging.offY)),
    }}));
  };
  const onDragEnd = () => setDragging(null);

  const downloadPitch = () => {
    const svg = svgRef.current; if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], {type:"image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W*3; canvas.height = H*3;
      const ctx = canvas.getContext("2d");
      ctx.scale(3,3); ctx.drawImage(img,0,0);
      URL.revokeObjectURL(url);
      canvas.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`equipos-f${fecha}.png`;a.click();},"image/png");
    };
    img.src = url;
  };

  const ShirtEl = ({ pkey, isGoalie, team }) => {
    const pos = positions[pkey] || {x:W/2,y:H/2};
    const isNegro = team==="negro";
    const shirtFill   = isGoalie?"#f5c518":(isNegro?"#1a1a1a":"#f0f0f0");
    const shirtStroke = isGoalie?"#c9a000":(isNegro?"#444":"#bbb");
    const badgeFill   = isGoalie?"#c9a000":(isNegro?"#333":"#ddd");
    const S=20, isDragged=dragging?.key===pkey;
    return (
      <g transform={`translate(${pos.x},${pos.y})`}
        style={{cursor:isAdmin?(isDragged?"grabbing":"grab"):"default",userSelect:"none"}}
        onMouseDown={e=>{e.preventDefault();onDragStart(pkey,e.clientX,e.clientY);}}
        onTouchStart={e=>{e.preventDefault();onDragStart(pkey,e.touches[0].clientX,e.touches[0].clientY);}}>
        {isDragged&&<circle r={S*1.6} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>}
        <path d={`M${-S*.75},${-S*.95} L${-S*1.1},${-S*.45} L${-S*.55},${-S*.2} L${-S*.55},${S*.85} L${S*.55},${S*.85} L${S*.55},${-S*.2} L${S*1.1},${-S*.45} L${S*.75},${-S*.95} Z`} fill={shirtFill} stroke={shirtStroke} strokeWidth="1.5"/>
        <path d={`M${-S*.75},${-S*.95} L${-S*1.2},${-S*.55} L${-S*1.1},${-S*.45} Z`} fill={shirtFill} stroke={shirtStroke} strokeWidth="1.5"/>
        <path d={`M${S*.75},${-S*.95} L${S*1.2},${-S*.55} L${S*1.1},${-S*.45} Z`}   fill={shirtFill} stroke={shirtStroke} strokeWidth="1.5"/>
        <path d={`M${-S*.35},${-S*.95} Q0,${-S*.7} ${S*.35},${-S*.95}`} fill="none" stroke={shirtStroke} strokeWidth="2"/>
        <circle cx="0" cy={S*.1} r={S*.28} fill={badgeFill} opacity="0.8"/>
        <text x="0" y={S*1.38} textAnchor="middle" fontSize="11" fontWeight="900"
          fill="white" fontFamily="'Barlow Condensed',Arial,sans-serif"
          paintOrder="stroke" stroke="rgba(0,0,0,0.85)" strokeWidth="3" strokeLinejoin="round">
          {(getName(pkey)||"?").toUpperCase()}
        </text>
      </g>
    );
  };

  const allPlayers = [
    ...negro.map(p  => ({key:`n_${p.id}`, isGoalie:p.role==="Arquero", team:"negro" })),
    ...blanco.map(p => ({key:`b_${p.id}`, isGoalie:p.role==="Arquero", team:"blanco"})),
  ];

  return (
    <div className="pitch-wrapper"
      onMouseMove={e=>onDragMove(e.clientX,e.clientY)}
      onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
      onTouchMove={e=>{e.preventDefault();onDragMove(e.touches[0].clientX,e.touches[0].clientY);}}
      onTouchEnd={onDragEnd}
      style={{touchAction:isAdmin?"none":"auto"}}>

      {isAdmin&&(<>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <button onClick={()=>{setEditMode(e=>!e);setEditingKey(null);}}
            style={{flex:1,padding:"8px",background:editMode?"rgba(255,215,64,0.15)":"rgba(255,255,255,0.06)",
              border:`1px solid ${editMode?"rgba(255,215,64,0.4)":"rgba(255,255,255,0.15)"}`,
              borderRadius:8,color:editMode?"#ffd740":"#fff",fontFamily:"Barlow Condensed,sans-serif",
              fontSize:13,fontWeight:700,cursor:"pointer"}}>
            ✏️ {editMode?"Cerrar edición":"Editar nombres"}
          </button>
          <button onClick={()=>setPositions(initPositions())}
            style={{padding:"8px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:8,color:"var(--muted)",fontFamily:"Barlow Condensed,sans-serif",fontSize:16,fontWeight:700,cursor:"pointer"}}
            title="Resetear posiciones">↺</button>
        </div>

        {editMode&&(
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,215,64,0.2)",borderRadius:10,padding:"12px",marginBottom:10}}>
            <div style={{fontFamily:"Barlow Condensed,sans-serif",fontSize:12,color:"rgba(255,215,64,0.8)",letterSpacing:1,marginBottom:10,textTransform:"uppercase",fontWeight:700}}>Tocá un nombre para editarlo</div>
            {["n","b"].map(prefix=>(
              <div key={prefix} style={{marginBottom:10}}>
                <div style={{fontSize:11,color:"var(--muted)",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>
                  {prefix==="n"?"⬛ Negro":"⬜ Blanco"}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {(prefix==="n"?negro:blanco).map(p=>{
                    const key=`${prefix}_${p.id}`;
                    return editingKey===key?(
                      <div key={p.id} style={{display:"flex",gap:4,alignItems:"center"}}>
                        <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
                          onKeyDown={e=>{if(e.key==="Enter")confirmEdit();if(e.key==="Escape")setEditingKey(null);}}
                          style={{padding:"4px 8px",borderRadius:6,border:"1.5px solid var(--azul)",background:"var(--bg3)",color:"#fff",fontSize:13,fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,width:90,outline:"none"}}/>
                        <button onClick={confirmEdit} style={{background:"var(--green)",color:"#000",border:"none",borderRadius:5,padding:"4px 8px",cursor:"pointer",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:12}}>✓</button>
                        <button onClick={()=>setEditingKey(null)} style={{background:"var(--bg3)",color:"var(--muted)",border:"1px solid var(--border)",borderRadius:5,padding:"4px 8px",cursor:"pointer",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:12}}>✕</button>
                      </div>
                    ):(
                      <button key={p.id} onClick={()=>{setEditingKey(key);setEditVal(names[key]??p.name);}}
                        style={{padding:"4px 10px",borderRadius:6,border:"1px solid var(--border)",background:"var(--bg3)",color:"#fff",cursor:"pointer",fontFamily:"Barlow Condensed,sans-serif",fontSize:13,fontWeight:700}}>
                        {names[key]??p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginBottom:6,fontFamily:"Barlow Condensed,sans-serif"}}>
          🖐️ Arrastrá las camisetas para moverlas
        </div>
      </>)}

      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
        style={{display:"block",borderRadius:12,overflow:"hidden"}}>
        {[...Array(12)].map((_,i)=><rect key={i} x="0" y={i*(H/12)} width={W} height={H/12} fill={i%2===0?"#2e7d32":"#276428"}/>)}
        <rect x="20" y="14" width={W-40} height={H-28} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <line x1="20" y1={H/2} x2={W-20} y2={H/2} stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <circle cx={W/2} cy={H/2} r="46" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <circle cx={W/2} cy={H/2} r="3.5" fill="rgba(255,255,255,0.9)"/>
        <rect x={W/2-62} y="14" width="124" height="80" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <rect x={W/2-32} y="14" width="64"  height="34" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <circle cx={W/2} cy="66" r="3" fill="rgba(255,255,255,0.9)"/>
        <rect x={W/2-26} y="6" width="52" height="12" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.95)" strokeWidth="2"/>
        <rect x={W/2-62} y={H-94} width="124" height="80" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <rect x={W/2-32} y={H-48} width="64"  height="34" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        <circle cx={W/2} cy={H-66} r="3" fill="rgba(255,255,255,0.9)"/>
        <rect x={W/2-26} y={H-18} width="52" height="12" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.95)" strokeWidth="2"/>
        <rect x="24" y="18" width="70" height="18" rx="3" fill="rgba(0,0,0,0.5)"/>
        <text x="59" y="31" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Barlow Condensed,sans-serif" letterSpacing="1">⬛ NEGRO</text>
        <rect x="24" y={H-36} width="76" height="18" rx="3" fill="rgba(0,0,0,0.5)"/>
        <text x="62" y={H-23} textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Barlow Condensed,sans-serif" letterSpacing="1">⬜ BLANCO</text>
        {allPlayers.map(({key,isGoalie,team})=><ShirtEl key={key} pkey={key} isGoalie={isGoalie} team={team}/>)}
      </svg>
      <button className="pitch-download-btn" onClick={downloadPitch}>⬇️ Descargar imagen</button>
    </div>
  );
}


// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading]         = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [connected, setConnected]     = useState(true);

  const [players, setPlayers]   = useState([]);
  const [stats, setStats]       = useState({});
  const [matches, setMatches]   = useState([]);
  const [selected, setSelected] = useState([]);
  const [options, setOptions]   = useState(null);
  const [votes, setVotes]       = useState({});
  const [chosenOpt, setChosenOpt] = useState(null);

  const [tab, setTab]             = useState("inscripcion");
  const [resultInput, setResultInput] = useState({gn:"",gb:""});
  const [matchDate, setMatchDate] = useState(()=>new Date().toISOString().split("T")[0]);
  const [newPlayer, setNewPlayer] = useState({name:"",positions:[]});
  const [editPlayer, setEditPlayer] = useState(null);
  const [notif, setNotif]         = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [isAdmin, setIsAdmin]     = useState(()=>{try{return JSON.parse(localStorage.getItem("f6_is_admin")||"false")}catch{return false}});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState(false);

  // SWAP state
  const [swapSource, setSwapSource] = useState(null); // {opt, team, playerId}
  const [showSwap, setShowSwap]     = useState(false);

  const notify = (msg, type="success") => { setNotif({msg,type}); setTimeout(()=>setNotif(null),2600); };

  useEffect(()=>{
    const init = async () => {
      const gameSnap = await getDoc(doc(db,"game","state"));
      if (!gameSnap.exists()) {
        await setDoc(doc(db,"game","state"),{selected:[],options:null,votes:{},chosenOpt:null});
        for (const p of INITIAL_PLAYERS) await setDoc(doc(db,"players",p.id),p);
        await setDoc(doc(db,"stats","all"),INITIAL_STATS);
        for (const m of INITIAL_MATCHES) await setDoc(doc(db,"matches",m.id),m);
      }
      const savedUser = localStorage.getItem("f6_current_user");
      if (savedUser) setCurrentUser(savedUser);
      else setShowUserSelector(true);
      setLoading(false);
    };
    init().catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    if(loading) return;
    const unsubs=[];
    unsubs.push(onSnapshot(doc(db,"game","state"),snap=>{
      if(snap.exists()){const d=snap.data();setSelected(d.selected||[]);setOptions(d.options||null);setVotes(d.votes||{});setChosenOpt(d.chosenOpt||null);}
      setConnected(true);
    },()=>setConnected(false)));
    unsubs.push(onSnapshot(collection(db,"players"),snap=>{
      setPlayers(snap.docs.map(d=>d.data()).sort((a,b)=>a.name.localeCompare(b.name)));
    }));
    unsubs.push(onSnapshot(doc(db,"stats","all"),snap=>{if(snap.exists())setStats(snap.data());}));
    unsubs.push(onSnapshot(collection(db,"matches"),snap=>{
      setMatches(snap.docs.map(d=>d.data()).sort((a,b)=>a.fecha-b.fecha));
    }));
    return ()=>unsubs.forEach(u=>u());
  },[loading]);

  const updateState = (patch) => updateDoc(doc(db,"game","state"),patch);

  const selectUser = (name) => {
    setCurrentUser(name); localStorage.setItem("f6_current_user",name);
    setShowUserSelector(false); notify(`¡Hola ${name}! 👋`);
  };

  // CAMBIO 1: solo podés anotarte/desanotarte a vos mismo
  const toggleSelect = async (id) => {
    const playerName = players.find(p=>p.id===id)?.name;
    if (!isAdmin && playerName !== currentUser) {
      notify("Solo podés anotarte a vos mismo","error"); return;
    }
    const newSel = selected.includes(id)
      ? selected.filter(x=>x!==id)
      : selected.length>=12
        ? (() => { notify("Máximo 12 jugadores","error"); return selected; })()
        : [...selected,id];
    if(newSel!==selected) await updateState({selected:newSel});
  };

  // CAMBIO 2: sorteo inteligente pasa stats
  const generateOptions = async () => {
    if(selected.length!==12) return notify("Seleccioná exactamente 12 jugadores","error");
    const opts = buildTwoOptions(selected, players, stats);
    await updateState({options:opts,votes:{},chosenOpt:null});
    notify("¡Dos opciones generadas!");
    setTab("equipos");
  };

  const castVote = async (playerId,opt) => {
    await updateState({votes:{...votes,[playerId]:opt}});
  };

  const declareOption = async (opt) => {
    await updateState({chosenOpt:opt});
    notify(`Opción ${opt==="azul"?"Azul":"Naranja"} elegida ✓`);
  };

  // CAMBIO 3: swap de jugadores entre equipos
  const handlePlayerChipClick = (opt, team, player) => {
    if (!isAdmin || chosenOpt) return;
    if (!swapSource) {
      setSwapSource({opt, team, playerId: player.id});
      setShowSwap(true);
    }
  };

  const doSwap = async (targetOpt, targetTeam, targetPlayerId) => {
    if (!swapSource || !options) return;
    const newOpts = JSON.parse(JSON.stringify(options));
    const srcTeam = newOpts[swapSource.opt][swapSource.team];
    const tgtTeam = newOpts[targetOpt][targetTeam];
    const srcIdx = srcTeam.findIndex(p=>p.id===swapSource.playerId);
    const tgtIdx = tgtTeam.findIndex(p=>p.id===targetPlayerId);
    if (srcIdx===-1 || tgtIdx===-1) { setShowSwap(false); setSwapSource(null); return; }
    // Swap
    const tmp = srcTeam[srcIdx];
    srcTeam[srcIdx] = tgtTeam[tgtIdx];
    tgtTeam[tgtIdx] = tmp;
    await updateState({options: newOpts});
    setShowSwap(false); setSwapSource(null);
    notify("Jugadores intercambiados ✓");
  };

  const nextFecha = matches.length>0 ? Math.max(...matches.map(m=>m.fecha))+1 : 1;

  const saveResult = async () => {
    const gn=parseInt(resultInput.gn), gb=parseInt(resultInput.gb);
    if(isNaN(gn)||isNaN(gb)||gn<0||gb<0) return notify("Resultado inválido","error");
    if(!chosenOpt||!options) return notify("Elegí una opción primero","error");
    const team=options[chosenOpt];
    const winner=gn>gb?"negro":gb>gn?"blanco":"empate";
    const diff=Math.abs(gn-gb);
    const newMatch={id:uid(),fecha:nextFecha,date:matchDate,negro:team.negro.map(p=>p.id),blanco:team.blanco.map(p=>p.id),gn,gb,winner};
    await setDoc(doc(db,"matches",newMatch.id),newMatch);
    const ns={...stats};
    const upd=(id,win)=>{
      if(!ns[id]) ns[id]={pj:0,wins:0,draws:0,losses:0,dg:0};
      ns[id]={...ns[id]}; ns[id].pj++;
      if(win==="win"){ns[id].wins++;ns[id].dg+=diff;}
      else if(win==="loss"){ns[id].losses++;ns[id].dg-=diff;}
      else{ns[id].draws++;}
    };
    team.negro.forEach(p=>upd(p.id,winner==="negro"?"win":winner==="blanco"?"loss":"draw"));
    team.blanco.forEach(p=>upd(p.id,winner==="blanco"?"win":winner==="negro"?"loss":"draw"));
    await setDoc(doc(db,"stats","all"),ns);
    await updateState({options:null,votes:{},chosenOpt:null,selected:[]});
    setResultInput({gn:"",gb:""}); notify("¡Partido guardado! 🎉"); setTab("historial");
  };

  const addPlayer = async () => {
    if(!newPlayer.name.trim()) return notify("Ingresá un nombre","error");
    if(newPlayer.positions.length===0) return notify("Seleccioná al menos una posición","error");
    const id=newPlayer.name.trim().toLowerCase().replace(/\s+/g,"_");
    const p={id,name:newPlayer.name.trim(),positions:newPlayer.positions,active:true};
    await setDoc(doc(db,"players",id),p);
    await setDoc(doc(db,"stats","all"),{...stats,[id]:{pj:0,wins:0,draws:0,losses:0,dg:0}});
    setNewPlayer({name:"",positions:[]}); setShowAddPlayer(false);
    notify(`${p.name} agregado ✓`);
  };

  const removePlayer = async (id) => {
    await deleteDoc(doc(db,"players",id));
    await updateState({selected:selected.filter(x=>x!==id)});
  };

  const saveEditPlayer = async () => {
    if(!editPlayer) return;
    await setDoc(doc(db,"players",editPlayer.id),editPlayer);
    setEditPlayer(null); notify("Jugador actualizado ✓");
  };

  const tryAdminLogin = () => {
    if(adminPwInput===ADMIN_PASSWORD){
      setIsAdmin(true);setShowAdminLogin(false);setAdminPwInput("");setAdminLoginError(false);
      localStorage.setItem("f6_is_admin","true"); notify("Modo admin activado ✓");
    } else {setAdminLoginError(true);setAdminPwInput("");}
  };
  const logoutAdmin = () => { setIsAdmin(false); localStorage.setItem("f6_is_admin","false"); notify("Sesión admin cerrada"); };

  const votesAzul=Object.values(votes).filter(v=>v==="azul").length;
  const votesNaranja=Object.values(votes).filter(v=>v==="naranja").length;
  const currentPhase=!options?1:!chosenOpt?2:3;

  const sortedPlayers=[...players].sort((a,b)=>{
    const sa=stats[a.id]||{pj:0,wins:0,draws:0,dg:0};
    const sb=stats[b.id]||{pj:0,wins:0,draws:0,dg:0};
    if(pts(sb)!==pts(sa)) return pts(sb)-pts(sa);
    if((sb.pj||0)!==(sa.pj||0)) return (sb.pj||0)-(sa.pj||0);
    return (sb.dg||0)-(sa.dg||0);
  });

  if(loading) return(
    <div className="app"><style>{CSS}</style>
      <div className="loading-screen"><div className="loading-ball">⚽</div><div className="loading-text">CARGANDO...</div></div>
    </div>
  );

  // Todos los jugadores de la opción activa para el panel de swap
  const allSwapPlayers = options && swapSource ? [
    ...( options[swapSource.opt]?.negro||[] ).map(p=>({...p,_opt:swapSource.opt,_team:"negro"})),
    ...( options[swapSource.opt]?.blanco||[] ).map(p=>({...p,_opt:swapSource.opt,_team:"blanco"})),
  ].filter(p=>p.id!==swapSource.playerId) : [];

  return(
    <div className="app">
      <style>{CSS}</style>

      {/* SELECTOR USUARIO */}
      {showUserSelector&&(
        <div className="user-overlay">
          <div className="user-box">
            <div className="user-box-title">⚽ ¿Quién sos?</div>
            <div className="user-box-sub">Seleccioná tu nombre para continuar</div>
            <div className="user-grid">
              {INITIAL_PLAYERS.map(p=><button key={p.id} className="user-btn" onClick={()=>selectUser(p.name)}>{p.name}</button>)}
            </div>
            <div style={{marginTop:12,fontSize:11,color:"var(--muted)",textAlign:"center",fontFamily:"Barlow Condensed,sans-serif"}}>
              ¿No estás en la lista? Pedile al admin que te agregue
            </div>
          </div>
        </div>
      )}

      {/* SWAP OVERLAY */}
      {showSwap&&swapSource&&(
        <div className="swap-overlay" onClick={()=>{setShowSwap(false);setSwapSource(null);}}>
          <div className="swap-box" onClick={e=>e.stopPropagation()}>
            <div className="swap-title">🔄 Intercambiar jugador</div>
            <div className="swap-sub">
              Seleccioná con quién querés intercambiar a <strong style={{color:"var(--azul-light)"}}>
                {options[swapSource.opt][swapSource.team].find(p=>p.id===swapSource.playerId)?.name}
              </strong>
            </div>
            <div className="swap-grid">
              {allSwapPlayers.map(p=>(
                <button key={p.id} className={`swap-player-btn ${p._team}-team`}
                  onClick={()=>doSwap(p._opt, p._team, p.id)}>
                  {p._team==="negro"?"⬛":"⬜"} {p.name}
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:400,marginTop:2}}>{p.role}</div>
                </button>
              ))}
            </div>
            <button className="btn" onClick={()=>{setShowSwap(false);setSwapSource(null);}}
              style={{background:"var(--bg3)",color:"var(--muted)",border:"1px solid var(--border)",marginTop:12,fontSize:15}}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN */}
      {showAdminLogin&&(
        <div className="admin-login-overlay" onClick={()=>{setShowAdminLogin(false);setAdminPwInput("");setAdminLoginError(false);}}>
          <div className="admin-login-box" onClick={e=>e.stopPropagation()}>
            <div className="admin-login-title">🔐 ADMIN</div>
            <div className="admin-login-sub">Ingresá la contraseña para acceder al modo administrador</div>
            <input className={`form-input ${adminLoginError?"input-error":""}`} type="password" placeholder="Contraseña" value={adminPwInput}
              onChange={e=>{setAdminPwInput(e.target.value);setAdminLoginError(false);}}
              onKeyDown={e=>e.key==="Enter"&&tryAdminLogin()} autoFocus/>
            {adminLoginError&&<div className="error-msg">Contraseña incorrecta</div>}
            <button className="btn btn-primary" onClick={tryAdminLogin} style={{marginTop:4}}>Ingresar</button>
            <button className="btn btn-ghost" onClick={()=>{setShowAdminLogin(false);setAdminPwInput("");setAdminLoginError(false);}} style={{marginTop:6}}>Cancelar</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header">
        <div className="header-top">
          <div className="header-badge">⚽</div>
          <div>
            <div className="header-title">FÚTBOL MIÉRCOLES</div>
            <div className="header-sub">
              <span className={`sync-dot ${connected?"":"offline"}`}/>
              {currentUser?`Hola, ${currentUser}`:"Point · 20hs · 2026"}
            </div>
          </div>
          <div className="header-fecha">FECHA {nextFecha}</div>
          <button className={`admin-lock-btn ${isAdmin?"active":""}`} onClick={()=>isAdmin?logoutAdmin():setShowAdminLogin(true)}>
            {isAdmin?"🔓":"🔒"}
          </button>
        </div>
        <nav>
          {[{id:"inscripcion",icon:"📋",label:"Inscripción"},{id:"equipos",icon:"⚽",label:"Equipos"},{id:"historial",icon:"📅",label:"Historial"},{id:"tabla",icon:"🏆",label:"Tabla"},{id:"jugadores",icon:"👤",label:"Jugadores"}].map(n=>(
            <button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
              <span className="ni">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="content">

        {/* INSCRIPCIÓN */}
        {tab==="inscripcion"&&(
          <>
            <div className="section-title">Inscripción <span className="accent">Fecha {nextFecha}</span></div>
            {isAdmin&&(
              <div className="admin-bar">
                <div><div className="admin-bar-label">🔓 MODO ADMIN</div><div className="admin-bar-sub">Podés gestionar inscripción y equipos</div></div>
                <button className="btn-sm" onClick={logoutAdmin} style={{background:"transparent",color:"var(--muted)",border:"1px solid var(--border)",fontSize:11}}>Salir</button>
              </div>
            )}
            <div className="counter-row">
              <div>
                <div className={`counter-num ${selected.length===12?"ok":selected.length>=8?"warn":"muted"}`}>{selected.length}</div>
                <div className="counter-label">Anotados</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="counter-num muted">12</div>
                <div className="counter-label">Cupo</div>
              </div>
            </div>
            <div className="card">
              {players.map(p=>{
                const sel=selected.includes(p.id);
                const s=stats[p.id]||{pj:0,wins:0,draws:0,losses:0,dg:0};
                const isMe = p.name===currentUser;
                const canToggle = isAdmin || isMe;
                return(
                  <div className="player-row" key={p.id}>
                    <div className={`avatar ${sel?"selected":""}`}>{p.name[0].toUpperCase()}</div>
                    <div className="player-info">
                      <div className="player-name">{p.name}{isMe&&!isAdmin&&<span style={{fontSize:10,color:"var(--azul-light)",marginLeft:6}}>· vos</span>}</div>
                      <div className="player-pos">{p.positions.map(pos=><span key={pos} className={`pos-tag ${pos==="Arquero"?"arq":""}`}>{pos}</span>)}</div>
                      {s.pj>0&&<div className="stats-mini">
                        <span className="stat-chip">PJ {s.pj}</span>
                        <span className="stat-chip">{pts(s)} pts</span>
                        <span className="stat-chip" style={{color:s.dg>0?"#00e676":s.dg<0?"#ff5252":""}}>DG {s.dg>0?"+":""}{s.dg}</span>
                      </div>}
                    </div>
                    <button
                      className={`toggle-btn ${sel?"in":"out"} ${!canToggle?"disabled":""}`}
                      onClick={()=>canToggle&&toggleSelect(p.id)}
                      style={{opacity:canToggle?1:0.35}}>
                      {sel?"✓ Va":"+ Anotar"}
                    </button>
                  </div>
                );
              })}
            </div>
            {isAdmin?(
              <>
                <button className="btn btn-primary" onClick={generateOptions} disabled={selected.length!==12} style={{opacity:selected.length===12?1:0.4}}>
                  ⚽ Generar Opciones ({selected.length}/12)
                </button>
                {selected.length>0&&(
                  <button className="btn btn-ghost" style={{marginTop:6,borderColor:"var(--red)",color:"var(--red)"}}
                    onClick={async()=>{await updateState({selected:[]});notify("Inscripción reseteada");}}>
                    🗑 Resetear Inscripción
                  </button>
                )}
              </>
            ):(
              <div style={{textAlign:"center",padding:"12px 0",color:"var(--muted)",fontSize:13,fontFamily:"Barlow Condensed,sans-serif"}}>
                {selected.length}/12 jugadores anotados · El admin generará los equipos
              </div>
            )}
          </>
        )}

        {/* EQUIPOS */}
        {tab==="equipos"&&(
          <>
            <div className="section-title">⚽ <span className="accent">Equipos</span></div>
            <div className="phase-steps">
              {["Armar","Votar","Resultado"].map((s,i)=>(
                <div key={s} className={`phase-step ${currentPhase===i+1?"active":currentPhase>i+1?"done":""}`}>
                  <span className="step-num">{currentPhase>i+1?"✓":i+1}</span>{s}
                </div>
              ))}
            </div>
            {!options&&(
              isAdmin?(
                <div className="empty"><div className="empty-icon">⚽</div><div>Seleccioná 12 jugadores en Inscripción</div>
                  <button className="btn btn-ghost" onClick={()=>setTab("inscripcion")} style={{marginTop:16,width:"auto",padding:"8px 20px",fontSize:14}}>Ir a Inscripción</button>
                </div>
              ):(
                <div className="locked-section">
                  <div className="locked-icon">🔒</div>
                  <div className="locked-text">Equipos no generados aún</div>
                  <div className="locked-sub">El administrador generará las opciones antes del partido</div>
                </div>
              )
            )}
            {options&&(
              <>
                {isAdmin&&!chosenOpt&&(
                  <div style={{fontSize:11,color:"var(--yellow)",background:"rgba(255,215,64,0.07)",border:"1px solid rgba(255,215,64,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:10,fontFamily:"Barlow Condensed,sans-serif",letterSpacing:"0.5px"}}>
                    ✏️ Admin: tocá cualquier jugador para intercambiarlo
                  </div>
                )}
                <div className="options-row">
                  {["azul","naranja"].map(opt=>{
                    const team=options[opt]; const isChosen=chosenOpt===opt;
                    return(
                      <div key={opt} className={`team-block ${opt} ${isChosen?"selected-opt":""}`}
                        onClick={()=>currentPhase===2&&isAdmin&&!showSwap&&declareOption(opt)}
                        style={{cursor:currentPhase===2&&isAdmin?"pointer":"default"}}>
                        {isChosen&&<div className="chosen-badge">ELEGIDA</div>}
                        <div className={`opt-label ${opt}`}><span>{opt==="azul"?"🔵":"🟠"}</span>Opción {opt.charAt(0).toUpperCase()+opt.slice(1)}</div>
                        {["negro","blanco"].map(t=>(
                          <div className="team-section" key={t}>
                            <div className="team-section-label">{t==="negro"?"⬛ NEGRO":"⬜ BLANCO"}</div>
                            {team[t].map(p=>(
                              <span key={p.id}
                                className={`team-player-chip ${p.role==="Arquero"?"arq":""} ${swapSource?.playerId===p.id?"selected-swap":""}`}
                                onClick={e=>{e.stopPropagation();handlePlayerChipClick(opt,t,p);}}>
                                {p.role==="Arquero"?"🧤 ":""}{p.name}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {currentPhase===2&&(
                  <>
                    <div className="divider"/>
                    <div className="card">
                      <div className="card-title">Votación · {Object.keys(votes).length}/{selected.length}</div>
                      <div className="vote-count">
                        <span style={{color:"var(--azul-light)"}}>🔵 Azul: {votesAzul}</span>
                        <span style={{color:"var(--naranja-light)"}}>🟠 Naranja: {votesNaranja}</span>
                      </div>
                      <div className="vote-bar">
                        <div className="vote-fill-azul" style={{width:(votesAzul+votesNaranja)>0?`${(votesAzul/(votesAzul+votesNaranja))*100}%`:"50%"}}/>
                      </div>
                      {players.filter(p=>selected.includes(p.id)).map(p=>(
                        <div className="voter-row" key={p.id}>
                          <div style={{flex:1,fontWeight:600}}>{p.name}</div>
                          {votes[p.id]&&<span style={{fontSize:12}}>{votes[p.id]==="azul"?"🔵":"🟠"}</span>}
                          <button className="btn-sm" onClick={()=>castVote(p.id,"azul")}
                            style={{background:votes[p.id]==="azul"?"var(--azul)":"var(--bg3)",color:votes[p.id]==="azul"?"#fff":"var(--muted)",border:"1px solid",borderColor:votes[p.id]==="azul"?"var(--azul)":"var(--border)",marginRight:4}}>🔵</button>
                          <button className="btn-sm" onClick={()=>castVote(p.id,"naranja")}
                            style={{background:votes[p.id]==="naranja"?"var(--naranja)":"var(--bg3)",color:votes[p.id]==="naranja"?"#fff":"var(--muted)",border:"1px solid",borderColor:votes[p.id]==="naranja"?"var(--naranja)":"var(--border)"}}>🟠</button>
                        </div>
                      ))}
                      <div className="divider"/>
                      {isAdmin?(
                        <>
                          <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>Elegir opción ganadora:</div>
                          <div style={{display:"flex",gap:8}}>
                            <button className="btn btn-ghost" style={{flex:1,marginTop:0,borderColor:"var(--azul)",color:"var(--azul-light)"}} onClick={()=>declareOption("azul")}>🔵 Azul ({votesAzul})</button>
                            <button className="btn btn-ghost" style={{flex:1,marginTop:0,borderColor:"var(--naranja)",color:"var(--naranja-light)"}} onClick={()=>declareOption("naranja")}>🟠 Naranja ({votesNaranja})</button>
                          </div>
                        </>
                      ):(
                        <div style={{textAlign:"center",padding:"8px 0",color:"var(--muted)",fontSize:12}}>🔒 El admin declarará la opción ganadora</div>
                      )}
                    </div>
                  </>
                )}

                {chosenOpt&&options&&(()=>{
                  const team=options[chosenOpt];
                  return(<>
                    <div className="divider"/>
                    <div className="section-title" style={{fontSize:20}}>⚽ <span className="accent">Equipos del día</span></div>
                    <PitchSVG negro={team.negro} blanco={team.blanco} fecha={nextFecha} isAdmin={isAdmin}/>
                  </>);
                })()}

                {chosenOpt&&isAdmin&&(
                  <>
                    <div className="divider"/>
                    <div className="section-title" style={{fontSize:20}}>Cargar <span className="accent">Resultado</span></div>
                    <div className="card">
                      <div className="card-title">Fecha del partido</div>
                      <input type="date" className="form-input" value={matchDate} onChange={e=>setMatchDate(e.target.value)}/>
                      <div className="result-input-row">
                        <div className="result-team"><label>⬛ NEGRO</label><input type="number" min="0" placeholder="0" value={resultInput.gn} onChange={e=>setResultInput(r=>({...r,gn:e.target.value}))}/></div>
                        <div className="result-vs">:</div>
                        <div className="result-team"><label>⬜ BLANCO</label><input type="number" min="0" placeholder="0" value={resultInput.gb} onChange={e=>setResultInput(r=>({...r,gb:e.target.value}))}/></div>
                      </div>
                      <button className="btn btn-green" onClick={saveResult}>💾 Guardar Resultado</button>
                    </div>
                  </>
                )}

                {isAdmin&&!chosenOpt&&(
                  <button className="btn btn-ghost" onClick={async()=>{
                    const opts=buildTwoOptions(selected,players,stats);
                    await updateState({options:opts,votes:{},chosenOpt:null});
                    notify("Opciones re-generadas 🔀");
                  }}>🔀 Re-generar Opciones</button>
                )}
              </>
            )}
          </>
        )}

        {/* HISTORIAL */}
        {tab==="historial"&&(
          <>
            <div className="section-title">📅 <span className="accent">Historial</span></div>
            <div className="two-grid">
              <div className="stat-summary-card"><div className="stat-summary-val">{matches.length}</div><div className="stat-summary-lbl">Fechas Jugadas</div></div>
              <div className="stat-summary-card"><div className="stat-summary-val">{matches.reduce((a,m)=>a+m.gn+m.gb,0)}</div><div className="stat-summary-lbl">Goles Totales</div></div>
            </div>
            {[...matches].reverse().map(m=>{
              const nW=m.winner==="negro",bW=m.winner==="blanco";
              const pMap=Object.fromEntries(players.map(p=>[p.id,p.name]));
              return(
                <div className="match-card" key={m.id}>
                  <div className="match-meta">
                    <div className="match-fecha">FECHA {m.fecha} · {m.date}</div>
                    <div className={`result-pill ${m.winner}`}>{m.winner==="empate"?"EMPATE":`GANÓ ${m.winner.toUpperCase()}`}</div>
                  </div>
                  <div className="match-score-row">
                    <div className="score-team"><div className="score-team-name">⬛ NEGRO</div><div className={`score-num ${nW?"winner-score":"loser-score"}`}>{m.gn}</div></div>
                    <div className="score-divider">:</div>
                    <div className="score-team"><div className="score-team-name">⬜ BLANCO</div><div className={`score-num ${bW?"winner-score":"loser-score"}`}>{m.gb}</div></div>
                  </div>
                  <div className="match-players-row">
                    {["negro","blanco"].map(t=>(
                      <div className="match-team-list" key={t}>
                        <div className="match-team-label">{t==="negro"?"⬛ Negro":"⬜ Blanco"}</div>
                        {(m[t]||[]).map(id=><div className="match-player-name" key={id}>{pMap[id]||id}</div>)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* TABLA */}
        {tab==="tabla"&&(
          <>
            <div className="section-title">🏆 <span className="accent">Tabla 2026</span></div>
            <div className="two-grid">
              <div className="stat-summary-card"><div className="stat-summary-val">{matches.length}</div><div className="stat-summary-lbl">Fechas</div></div>
              <div className="stat-summary-card"><div className="stat-summary-val">{players.length}</div><div className="stat-summary-lbl">Jugadores</div></div>
            </div>
            <div className="card">
              <div className="tabla-header">
                <div className="rank">#</div><div style={{flex:1}}>Jugador</div>
                <div className="stat-col" style={{width:28}}><div className="stat-lbl">PJ</div></div>
                <div className="stat-col" style={{width:28}}><div className="stat-lbl" style={{color:"var(--green)"}}>V</div></div>
                <div className="stat-col" style={{width:28}}><div className="stat-lbl">E</div></div>
                <div className="stat-col" style={{width:28}}><div className="stat-lbl" style={{color:"var(--red)"}}>D</div></div>
                <div className="stat-col" style={{width:36}}><div className="stat-lbl">DG</div></div>
                <div style={{width:38,textAlign:"center"}}><div className="stat-lbl">PTS</div></div>
              </div>
              {sortedPlayers.filter(p=>stats[p.id]?.pj>0).map((p,i)=>{
                const s=stats[p.id]||{pj:0,wins:0,draws:0,losses:0,dg:0};
                const wr=s.pj>0?(s.wins/s.pj)*100:0;
                const rk=i===0?"gold":i===1?"silver":i===2?"bronze":"";
                return(
                  <div className="tabla-row" key={p.id}>
                    <div className={`rank ${rk}`}>{i+1}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="player-name" style={{fontSize:13}}>{p.name}</div>
                      <div className="winbar"><div className="winbar-fill" style={{width:`${wr}%`}}/></div>
                    </div>
                    <div className="stat-col" style={{width:28}}><div className="stat-val" style={{fontSize:14,color:"var(--muted)"}}>{s.pj}</div></div>
                    <div className="stat-col" style={{width:28}}><div className="stat-val" style={{fontSize:14,color:"var(--green)"}}>{s.wins}</div></div>
                    <div className="stat-col" style={{width:28}}><div className="stat-val" style={{fontSize:14,color:"var(--muted)"}}>{s.draws}</div></div>
                    <div className="stat-col" style={{width:28}}><div className="stat-val" style={{fontSize:14,color:"var(--red)"}}>{s.losses}</div></div>
                    <div className="stat-col" style={{width:36}}><div className={`stat-val ${s.dg>0?"dg-positive":s.dg<0?"dg-negative":"dg-zero"}`} style={{fontSize:13}}>{s.dg>0?"+":""}{s.dg}</div></div>
                    <div className="pts-col">{pts(s)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:8,fontFamily:"Barlow Condensed,sans-serif"}}>
              Puntos: V=3 · E=1 · D=0 · DG: diferencia de goles acumulada
            </div>
          </>
        )}

        {/* JUGADORES */}
        {tab==="jugadores"&&(
          <>
            <div className="section-title" style={{justifyContent:"space-between"}}>
              <span>👤 <span className="accent">Jugadores</span></span>
              {isAdmin&&<button className="btn-sm" onClick={()=>setShowAddPlayer(!showAddPlayer)} style={{background:showAddPlayer?"var(--red)":"var(--azul)",color:"#fff",fontSize:13}}>{showAddPlayer?"✕ Cancelar":"+ Nuevo"}</button>}
            </div>
            {showAddPlayer&&isAdmin&&(
              <div className="card" style={{borderColor:"rgba(41,121,255,0.3)"}}>
                <div className="card-title">Agregar Jugador</div>
                <input className="form-input" placeholder="Nombre" value={newPlayer.name}
                  onChange={e=>setNewPlayer(p=>({...p,name:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&addPlayer()}/>
                <div className="card-title" style={{marginBottom:8}}>Posiciones (orden de prioridad)</div>
                <div className="pos-selector">
                  {POSITIONS.map(pos=>(
                    <button key={pos} className={`pos-toggle ${newPlayer.positions.includes(pos)?"selected":""}`}
                      onClick={()=>setNewPlayer(p=>({...p,positions:p.positions.includes(pos)?p.positions.filter(x=>x!==pos):[...p.positions,pos]}))}>
                      {pos}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" style={{marginTop:4}} onClick={addPlayer}>+ Agregar</button>
              </div>
            )}
            <div className="card">
              {players.map(p=>{
                const s=stats[p.id]||{pj:0,wins:0,draws:0,losses:0,dg:0};
                const isEditing=editPlayer&&editPlayer.id===p.id;
                return(
                  <div key={p.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    {isEditing?(
                      <div style={{padding:"10px 0"}}>
                        <input className="form-input" value={editPlayer.name} onChange={e=>setEditPlayer(ep=>({...ep,name:e.target.value}))} style={{marginBottom:8}}/>
                        <div className="pos-selector" style={{marginBottom:10}}>
                          {POSITIONS.map(pos=>(
                            <button key={pos} className={`pos-toggle ${editPlayer.positions.includes(pos)?"selected":""}`}
                              onClick={()=>setEditPlayer(ep=>({...ep,positions:ep.positions.includes(pos)?ep.positions.filter(x=>x!==pos):[...ep.positions,pos]}))}>
                              {pos}
                            </button>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <button className="btn-sm" onClick={saveEditPlayer} style={{background:"var(--green)",color:"#000",flex:1,padding:"8px"}}>✓ Guardar</button>
                          <button className="btn-sm" onClick={()=>setEditPlayer(null)} style={{background:"var(--bg3)",color:"var(--muted)",border:"1px solid var(--border)",flex:1,padding:"8px"}}>Cancelar</button>
                        </div>
                      </div>
                    ):(
                      <div className="player-row" style={{borderBottom:"none"}}>
                        <div className="avatar">{p.name[0].toUpperCase()}</div>
                        <div className="player-info">
                          <div className="player-name">{p.name}</div>
                          <div className="player-pos">{p.positions.map(pos=><span key={pos} className={`pos-tag ${pos==="Arquero"?"arq":""}`}>{pos}</span>)}</div>
                          {s.pj>0&&<div className="stats-mini"><span className="stat-chip">PJ {s.pj}</span><span className="stat-chip">{pts(s)} pts</span></div>}
                        </div>
                        {isAdmin&&(
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn-sm" onClick={()=>setEditPlayer({...p})} style={{background:"var(--bg3)",color:"var(--muted)",border:"1px solid var(--border)"}}>✏️</button>
                            <button className="del-btn" onClick={()=>removePlayer(p.id)}>✕</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
      {notif&&<div className={`notif ${notif.type}`}>{notif.msg}</div>}
    </div>
  );
}
