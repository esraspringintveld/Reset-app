import { useState, useEffect, useCallback } from "react";

// ── Storage via localStorage ──────────────────────────────────────────────────
const KEYS = { entries:"reset-entries", phase:"reset-phase", nextDate:"reset-nextdate" };
function load(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

// ── Constants ────────────────────────────────────────────────────────────────
const START_WEIGHT = 137;
const GOAL_WEIGHT  = 65;
const TOTAL_LOSS   = START_WEIGHT - GOAL_WEIGHT;

const HISTORICAL = [
  {date:"2026-02-18",weight:137,  note:"Start!"},
  {date:"2026-02-19",weight:135.9,note:""},
  {date:"2026-02-20",weight:134.8,note:""},
  {date:"2026-02-21",weight:134.3,note:""},
  {date:"2026-02-22",weight:133.8,note:""},
  {date:"2026-02-24",weight:133.6,note:""},
  {date:"2026-02-25",weight:133.2,note:""},
  {date:"2026-02-26",weight:133.1,note:""},
  {date:"2026-02-27",weight:132.5,note:""},
  {date:"2026-03-01",weight:132.8,note:""},
  {date:"2026-03-02",weight:132.2,note:""},
  {date:"2026-03-04",weight:131.9,note:""},
  {date:"2026-03-06",weight:131.2,note:""},
  {date:"2026-03-08",weight:131.3,note:""},
  {date:"2026-03-09",weight:130.7,note:""},
  {date:"2026-03-10",weight:130.5,note:""},
  {date:"2026-03-11",weight:130.2,note:""},
  {date:"2026-03-12",weight:130,  note:""},
  {date:"2026-03-13",weight:129.5,note:""},
  {date:"2026-03-14",weight:129.3,note:""},
  {date:"2026-03-16",weight:128.9,note:""},
  {date:"2026-03-17",weight:128.5,note:""},
  {date:"2026-03-19",weight:127.7,note:""},
  {date:"2026-03-20",weight:127.6,note:""},
  {date:"2026-03-23",weight:127.3,note:""},
  {date:"2026-03-24",weight:126.8,note:""},
  {date:"2026-03-25",weight:126.5,note:""},
  {date:"2026-03-27",weight:126.4,note:"Start fase 3 🥳"},
  {date:"2026-03-28",weight:126,  note:""},
  {date:"2026-03-29",weight:125.8,note:""},
  {date:"2026-03-30",weight:125.4,note:""},
  {date:"2026-03-31",weight:125,  note:""},
  {date:"2026-04-01",weight:124.3,note:""},
  {date:"2026-04-03",weight:124.3,note:""},
  {date:"2026-04-04",weight:124.1,note:""},
  {date:"2026-04-05",weight:124.4,note:""},
  {date:"2026-04-07",weight:124.1,note:""},
  {date:"2026-04-08",weight:123.9,note:""},
  {date:"2026-04-09",weight:124.3,note:""},
  {date:"2026-04-10",weight:123.4,note:"Start fase 2"},
  {date:"2026-04-11",weight:123,  note:""},
  {date:"2026-04-12",weight:122.9,note:""},
  {date:"2026-04-13",weight:122.7,note:""},
  {date:"2026-04-14",weight:122.1,note:""},
  {date:"2026-04-16",weight:121.8,note:""},
  {date:"2026-04-17",weight:121.5,note:""},
  {date:"2026-04-18",weight:121.7,note:""},
  {date:"2026-04-19",weight:121.3,note:""},
  {date:"2026-04-20",weight:121.5,note:""},
  {date:"2026-04-21",weight:121.3,note:""},
  {date:"2026-04-22",weight:120.8,note:""},
  {date:"2026-04-23",weight:120.5,note:""},
  {date:"2026-04-24",weight:120.6,note:""},
  {date:"2026-04-25",weight:120.3,note:""},
  {date:"2026-04-26",weight:119.7,note:""},
  {date:"2026-04-27",weight:119.8,note:""},
  {date:"2026-04-28",weight:120,  note:""},
  {date:"2026-04-29",weight:119.5,note:""},
  {date:"2026-05-01",weight:118.6,note:""},
  {date:"2026-05-02",weight:118.7,note:""},
  {date:"2026-05-03",weight:118.3,note:"Twee dagen terug 12000 stappen gelopen!"},
];

const MILESTONES = [
  {loss:5,   emoji:"🌱", msg:"5 kg eraf! De reis begint!"},
  {loss:10,  emoji:"⭐", msg:"10 kg! Waanzinnig goed bezig!"},
  {loss:17.5,emoji:"🏆", msg:"17,5 kg! Jouw record!"},
  {loss:20,  emoji:"🎯", msg:"20 kg! Ongelooflijk!"},
  {loss:25,  emoji:"💫", msg:"25 kg! Je bent een kampioen!"},
  {loss:30,  emoji:"🔥", msg:"30 kg! Halve weg bijna!"},
  {loss:40,  emoji:"🌟", msg:"40 kg! Fenomenaal!"},
  {loss:50,  emoji:"👑", msg:"50 kg! Een held!"},
  {loss:72,  emoji:"🎉", msg:"DOEL BEREIKT! Je hebt het gedaan!"},
];

const card = { background:"white", borderRadius:20, padding:"20px 18px", margin:"0 0 14px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" };
const lbl  = { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#9ca3af", marginBottom:8, fontFamily:"Georgia,serif" };
const inp  = { width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"13px 14px", fontSize:17, fontFamily:"Georgia,serif", outline:"none", boxSizing:"border-box", background:"white" };
const btn  = { background:"#2d6a4f", color:"white", border:"none", borderRadius:14, padding:"15px 20px", fontSize:15, fontFamily:"Georgia,serif", cursor:"pointer", width:"100%", fontWeight:600 };
const btnSm= { background:"transparent", color:"#2d6a4f", border:"2px solid #2d6a4f", borderRadius:12, padding:"8px 14px", fontSize:12, fontFamily:"Georgia,serif", cursor:"pointer" };

function Confetti() {
  const colors = ["#2d6a4f","#52b788","#b5838d","#ffd166","#06d6a0","#f4a261"];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      {Array.from({length:40},(_,i)=>(
        <div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:"-20px",
          width:8+Math.random()*8,height:8+Math.random()*8,background:colors[i%colors.length],
          borderRadius:Math.random()>.5?"50%":"2px",
          animation:`cffall ${2.5+Math.random()*1.5}s ${Math.random()*1.2}s linear forwards`}}/>
      ))}
      <style>{`@keyframes cffall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

function Chart({ entries, height=140 }) {
  const [tooltip, setTooltip] = useState(null);
  if (entries.length < 2) return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>Voeg meer metingen toe</div>;
  const W=340,H=height,PL=38,PR=14,PT=10,PB=26;
  const ws=entries.map(e=>e.weight);
  const mn=Math.floor(Math.min(...ws))-1,mx=Math.ceil(Math.max(...ws))+1;
  const px=i=>PL+i*(W-PL-PR)/(entries.length-1);
  const py=w=>PT+((mx-w)/(mx-mn))*(H-PT-PB);
  const path=entries.map((e,i)=>`${i===0?"M":"L"}${px(i).toFixed(1)},${py(e.weight).toFixed(1)}`).join(" ");
  const area=path+` L${px(entries.length-1).toFixed(1)},${(H-PB).toFixed(1)} L${PL},${(H-PB).toFixed(1)} Z`;
  const yLabels=Array.from({length:5},(_,i)=>Math.round(mn+(mx-mn)*i/4));
  const xIdx=entries.length<=6?entries.map((_,i)=>i):[0,Math.floor(entries.length*0.33),Math.floor(entries.length*0.66),entries.length-1];
  const fmt=d=>{const dt=new Date(d);return `${dt.getDate()} ${["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"][dt.getMonth()]}`;};
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}} onMouseLeave={()=>setTooltip(null)}>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52b788" stopOpacity=".25"/><stop offset="100%" stopColor="#52b788" stopOpacity="0"/></linearGradient></defs>
      {yLabels.map(y=><g key={y}><line x1={PL} y1={py(y)} x2={W-PR} y2={py(y)} stroke="#f3f4f6" strokeWidth="1"/><text x={PL-4} y={py(y)+4} textAnchor="end" fontSize="9" fill="#9ca3af">{y}</text></g>)}
      {GOAL_WEIGHT>=mn&&GOAL_WEIGHT<=mx&&<><line x1={PL} y1={py(GOAL_WEIGHT)} x2={W-PR} y2={py(GOAL_WEIGHT)} stroke="#b5838d" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7"/><text x={W-PR+2} y={py(GOAL_WEIGHT)+4} fontSize="8" fill="#b5838d">doel</text></>}
      <path d={area} fill="url(#cg)"/>
      <path d={path} fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {xIdx.map(i=><text key={i} x={px(i)} y={H-PB+14} textAnchor="middle" fontSize="9" fill="#9ca3af">{fmt(entries[i].date)}</text>)}
      {entries.map((e,i)=>(
        <g key={i} style={{cursor:"pointer"}} onClick={()=>setTooltip(tooltip?.i===i?null:{i,x:px(i),y:py(e.weight),e})} onMouseEnter={()=>setTooltip({i,x:px(i),y:py(e.weight),e})}>
          <circle cx={px(i)} cy={py(e.weight)} r="16" fill="transparent"/>
          <circle cx={px(i)} cy={py(e.weight)} r={tooltip?.i===i?5:3} fill={tooltip?.i===i?"#1b4332":"#2d6a4f"} stroke={tooltip?.i===i?"white":"none"} strokeWidth="1.5"/>
        </g>
      ))}
      {tooltip&&(()=>{const tx=Math.min(Math.max(tooltip.x,PL+36),W-PR-36),ty=tooltip.y<50?tooltip.y+12:tooltip.y-42;return(<g><rect x={tx-36} y={ty} width="72" height="30" rx="8" fill="#1b4332"/><text x={tx} y={ty+13} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{tooltip.e.weight} kg</text><text x={tx} y={ty+25} textAnchor="middle" fontSize="9" fill="#86efac">{fmt(tooltip.e.date)}</text></g>);})()}
    </svg>
  );
}

function ChartModal({ entries, onClose }) {
  const fmt=d=>new Date(d).toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"});
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"white",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#2d6a4f,#1b4332)",color:"white",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Volledig gewichtsverloop</div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:20}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 12px 40px"}}>
        <div style={{fontSize:12,color:"#9ca3af",textAlign:"center",marginBottom:8}}>Tik op een punt voor details</div>
        <Chart entries={entries} height={200}/>
        <div style={{marginTop:24,fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#2d6a4f",marginBottom:8}}>Alle {entries.length} metingen</div>
        {[...entries].reverse().map((e,idx)=>{
          const i=entries.findIndex(x=>x.date===e.date);
          const prev=entries[i-1];
          const diff=prev?e.weight-prev.weight:0;
          return (
            <div key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 4px",borderBottom:"1px solid #f4f1eb"}}>
              <div><div style={{fontSize:13,color:"#9ca3af"}}>{fmt(e.date)}</div>{e.note?<div style={{fontSize:11,color:"#b5838d",marginTop:1}}>{e.note}</div>:null}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#2d6a4f",textAlign:"right"}}>
                {e.weight} kg
                {prev&&<div style={{fontSize:12,color:diff<0?"#2d6a4f":"#e76f51",fontWeight:400}}>{diff<0?"▼":"▲"}{Math.abs(diff).toFixed(1)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LogForm({ sorted, onSave, onDelete }) {
  const today=new Date().toISOString().slice(0,10);
  const [date,setDate]=useState(today);
  const [weight,setWeight]=useState("");
  const [note,setNote]=useState("");
  const [saved,setSaved]=useState(false);
  const [delConfirm,setDelConfirm]=useState(null);
  const handleSave=()=>{
    const w=parseFloat(weight.replace(",","."));
    if(isNaN(w)||w<40||w>250)return;
    onSave({date,weight:w,note});
    setWeight("");setNote("");
    setSaved(true);setTimeout(()=>setSaved(false),2200);
  };
  return (
    <div style={{padding:"20px 16px"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:16}}>Weging invoeren</div>
      <div style={card}>
        <div style={{...lbl,marginBottom:6}}>Datum</div>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
        <div style={{...lbl,marginTop:16,marginBottom:6}}>Gewicht (kg)</div>
        <input style={inp} inputMode="decimal" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="bijv. 118.3" value={weight} onChange={e=>setWeight(e.target.value)}/>
        <div style={{...lbl,marginTop:16,marginBottom:6}}>Notitie (optioneel)</div>
        <input style={inp} autoComplete="off" autoCorrect="off" autoCapitalize="sentences" spellCheck={true} placeholder="bijv. Appeldag, sportdag..." value={note} onChange={e=>setNote(e.target.value)}/>
        <button onClick={handleSave} style={{...btn,marginTop:14,background:saved?"#52b788":"#2d6a4f",transition:"background .3s"}}>{saved?"✓ Opgeslagen!":"Opslaan"}</button>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#2d6a4f",margin:"20px 0 12px"}}>Recente wegingen</div>
      {[...sorted].reverse().slice(0,30).map(e=>{
        const idx=sorted.findIndex(x=>x.date===e.date);
        const prev=sorted[idx-1];
        const diff=prev?e.weight-prev.weight:0;
        return (
          <div key={e.date} style={{...card,padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#9ca3af"}}>{new Date(e.date).toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"})}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#2d6a4f"}}>
                {e.weight} kg
                {prev&&<span style={{fontSize:13,marginLeft:8,color:diff<0?"#2d6a4f":"#e76f51",fontWeight:400}}>{diff<0?"▼":"▲"}{Math.abs(diff).toFixed(1)}</span>}
              </div>
              {e.note?<div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{e.note}</div>:null}
            </div>
            {delConfirm===e.date?(
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{onDelete(e.date);setDelConfirm(null);}} style={{...btnSm,color:"#e76f51",borderColor:"#e76f51"}}>Ja</button>
                <button onClick={()=>setDelConfirm(null)} style={btnSm}>Nee</button>
              </div>
            ):(
              <button onClick={()=>setDelConfirm(e.date)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#d1d5db",padding:4}}>×</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FasesTab({ currentPhase, nextPhaseDate, totalLost, onSwitch }) {
  const [localPhase,setLocalPhase]=useState(currentPhase);
  const [localDate,setLocalDate]=useState(nextPhaseDate);
  const [saved,setSaved]=useState(false);
  return (
    <div style={{padding:"20px 16px"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:6}}>Fase beheer</div>
      <div style={{fontSize:13,color:"#9ca3af",marginBottom:20}}>Stel in welke fase je zit en wanneer je wisselt.</div>
      <div style={card}>
        <div style={{...lbl,marginBottom:10}}>Huidige fase</div>
        <div style={{display:"flex",gap:10}}>
          {[{id:2,label:"Fase 2",desc:"Vetverbranding"},{id:3,label:"Fase 3",desc:"Stabilisatie"}].map(p=>(
            <button key={p.id} onClick={()=>setLocalPhase(p.id)} style={{flex:1,padding:"12px 8px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,fontSize:14,background:localPhase===p.id?"#2d6a4f":"#f4f1eb",color:localPhase===p.id?"white":"#6b7280",transition:"all 0.2s"}}>
              {p.label}<br/><span style={{fontSize:11,fontWeight:400}}>{p.desc}</span>
            </button>
          ))}
        </div>
        <div style={{...lbl,marginTop:18,marginBottom:6}}>Volgende wissel op</div>
        <input type="date" value={localDate} onChange={e=>setLocalDate(e.target.value)} style={inp}/>
        <button onClick={()=>{onSwitch(localPhase,localDate);setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{...btn,marginTop:14,background:saved?"#52b788":"#2d6a4f",transition:"background .3s"}}>{saved?"✓ Opgeslagen!":"Opslaan"}</button>
      </div>
      <div style={{...card,borderLeft:"4px solid #2d6a4f"}}>
        <div style={{fontWeight:700,color:"#2d6a4f",marginBottom:8}}>🔥 Fase 2 — Vetverbranding (21 dagen)</div>
        <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>• Groenten onbeperkt (min. 400g)<br/>• 250g proteïne per dag<br/>• 2x fruit per dag<br/>• 2x grissini of wasa cracker<br/>• Geen koolhydraten, geen suiker<br/>• Alleen krachtsport op 60%</div>
      </div>
      <div style={{...card,borderLeft:"4px solid #b5838d",marginTop:12}}>
        <div style={{fontWeight:700,color:"#b5838d",marginBottom:8}}>🌿 Fase 3 — Stabilisatie (21 dagen)</div>
        <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>• Gezonde oliën & vetten toevoegen<br/>• Alle groenten toegestaan<br/>• Alle fruitsoorten (banaan met mate)<br/>• Ongebrande noten, kwark, rode wijn<br/>• Haverzemelen max 3x/week (30g)<br/>• Doel: stabiel blijven</div>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#2d6a4f",margin:"20px 0 12px"}}>Mijlpalen</div>
      {MILESTONES.map(m=>{
        const done=totalLost>=m.loss;
        return (
          <div key={m.loss} style={{...card,marginBottom:8,display:"flex",alignItems:"center",gap:12,padding:"12px 16px",opacity:done?1:0.45}}>
            <div style={{fontSize:24}}>{m.emoji}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:done?"#2d6a4f":"#9ca3af"}}>−{m.loss} kg</div><div style={{fontSize:12,color:"#9ca3af"}}>{m.msg}</div></div>
            {done&&<div style={{color:"#2d6a4f",fontSize:18}}>✓</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [entries,setEntries]=useState([]);
  const [currentPhase,setCurrentPhase]=useState(2);
  const [nextPhaseDate,setNextPhaseDate]=useState("2026-05-20");
  const [tab,setTab]=useState("home");
  const [confetti,setConfetti]=useState(false);
  const [celebration,setCelebration]=useState(null);
  const [showChart,setShowChart]=useState(false);

  useEffect(()=>{
    const se=load(KEYS.entries);
    const sp=load(KEYS.phase);
    const sd=load(KEYS.nextDate);
    if(se?.length){
      const storedDates=new Set(se.map(e=>e.date));
      const missing=HISTORICAL.filter(e=>!storedDates.has(e.date));
      const merged=[...se,...missing].sort((a,b)=>a.date.localeCompare(b.date));
      setEntries(merged);save(KEYS.entries,merged);
    } else {
      setEntries(HISTORICAL);save(KEYS.entries,HISTORICAL);
    }
    if(sp)setCurrentPhase(sp);
    if(sd)setNextPhaseDate(sd);
  },[]);

  const sorted=[...entries].sort((a,b)=>a.date.localeCompare(b.date));
  const latest=sorted[sorted.length-1];
  const currentWeight=latest?.weight??START_WEIGHT;
  const totalLost=+(START_WEIGHT-currentWeight).toFixed(1);
  const remaining=+(currentWeight-GOAL_WEIGHT).toFixed(1);
  const progressPct=Math.min(100,(totalLost/TOTAL_LOSS)*100);
  const phaseLabel=currentPhase===2?"Fase 2 — Vetverbranding":"Fase 3 — Stabilisatie";
  const daysToPhase=Math.max(0,Math.ceil((new Date(nextPhaseDate)-new Date())/86400000));

  const checkMilestone=useCallback((newLoss,oldLoss)=>{
    const hit=[...MILESTONES].reverse().find(m=>newLoss>=m.loss&&oldLoss<m.loss);
    if(hit){setCelebration(hit);setConfetti(true);setTimeout(()=>{setConfetti(false);setCelebration(null);},5000);}
  },[]);

  const handleSave=useCallback((entry)=>{
    const oldLoss=totalLost;
    const newEntries=[...entries.filter(e=>e.date!==entry.date),entry].sort((a,b)=>a.date.localeCompare(b.date));
    checkMilestone(+(START_WEIGHT-entry.weight).toFixed(1),oldLoss);
    setEntries(newEntries);save(KEYS.entries,newEntries);
  },[entries,totalLost,checkMilestone]);

  const handleDelete=useCallback((date)=>{
    const newEntries=entries.filter(e=>e.date!==date);
    setEntries(newEntries);save(KEYS.entries,newEntries);
  },[entries]);

  const handleSwitch=useCallback((phase,date)=>{
    setCurrentPhase(phase);setNextPhaseDate(date);
    save(KEYS.phase,phase);save(KEYS.nextDate,date);
  },[]);

  return (
    <div style={{fontFamily:"Georgia,serif",background:"#f4f1eb",minHeight:"100vh",maxWidth:420,margin:"0 auto",paddingBottom:80}}>
      {confetti&&<Confetti/>}
      {showChart&&<ChartModal entries={sorted} onClose={()=>setShowChart(false)}/>}
      {celebration&&(
        <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,background:"rgba(0,0,0,0.4)"}}>
          <div style={{background:"white",borderRadius:24,padding:32,textAlign:"center",margin:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{fontSize:56,marginBottom:12}}>{celebration.emoji}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#2d6a4f",marginBottom:8}}>{celebration.msg}</div>
            <div style={{color:"#9ca3af",fontSize:13}}>Je bent geweldig! 🌿</div>
          </div>
        </div>
      )}

      {tab==="home"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#2d6a4f,#1b4332)",color:"white",padding:"24px 20px 32px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
            <div style={{fontSize:12,letterSpacing:3,textTransform:"uppercase",opacity:.7,marginBottom:6}}>Huidig gewicht</div>
            <div style={{fontSize:52,fontWeight:700,lineHeight:1,marginBottom:4}}>{currentWeight} <span style={{fontSize:20,fontWeight:400}}>kg</span></div>
            <div style={{fontSize:13,opacity:.75}}>{latest?`Gewogen op ${new Date(latest.date).toLocaleDateString("nl-NL",{day:"numeric",month:"long"})}`:"Nog geen metingen"}</div>
            <div style={{marginTop:14,display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"6px 14px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:currentPhase===3?"#f9a8d4":"#86efac"}}/>
              <span style={{fontSize:13}}>{phaseLabel}</span>
            </div>
          </div>
          <div style={{padding:"16px 16px 0"}}>
            <div style={card}>
              <div style={lbl}>Voortgang naar doel</div>
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                {[{v:`−${totalLost}`,l:"kg afgevallen"},{v:`${remaining}`,l:"kg te gaan"},{v:`${progressPct.toFixed(0)}%`,l:"voltooid"}].map((s,i)=>(
                  <div key={i} style={{flex:1,background:"#f4f1eb",borderRadius:14,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#2d6a4f"}}>{s.v}</div>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#d8f3dc",borderRadius:99,height:14,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,#2d6a4f,#52b788)",width:`${progressPct}%`,transition:"width .8s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#9ca3af",marginTop:6}}><span>137 kg</span><span>🎯 65 kg</span></div>
            </div>
            <div style={{...card,background:"linear-gradient(135deg,#fff9f9,#fce4ec)",border:"1.5px solid #f9c6d0"}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:38}}>{currentPhase===2?"🌿":"🔥"}</div>
                <div>
                  <div style={{fontSize:13,color:"#b5838d",fontWeight:600}}>Volgende: {currentPhase===2?"Fase 3 Stabilisatie":"Fase 2 Vetverbranding"}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#2d6a4f"}}>{daysToPhase===0?"Vandaag! 🎉":`${daysToPhase} dagen`}</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>{new Date(nextPhaseDate).toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"})}</div>
                </div>
              </div>
            </div>
            <div style={{...card,cursor:"pointer"}} onClick={()=>setShowChart(true)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={lbl}>Gewichtsverloop</div>
                <div style={{fontSize:11,color:"#2d6a4f",fontWeight:600,letterSpacing:1}}>VOLLEDIG ↗</div>
              </div>
              <Chart entries={sorted.slice(-40)} height={130}/>
              <div style={{fontSize:11,color:"#9ca3af",textAlign:"center",marginTop:6}}>Tik op punt voor details · Tik op kaart voor volledig scherm</div>
            </div>
            {(()=>{const next=MILESTONES.find(m=>totalLost<m.loss);if(!next)return null;return(
              <div style={{...card,background:"#f4f1eb"}}>
                <div style={lbl}>Volgende mijlpaal</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:32}}>{next.emoji}</div>
                  <div><div style={{fontSize:15,fontWeight:600,color:"#2d6a4f"}}>{next.msg}</div><div style={{fontSize:13,color:"#9ca3af",marginTop:2}}>Nog {(next.loss-totalLost).toFixed(1)} kg te gaan!</div></div>
                </div>
              </div>
            );})()}
          </div>
        </div>
      )}
      {tab==="log"&&<LogForm sorted={sorted} onSave={handleSave} onDelete={handleDelete}/>}
      {tab==="fases"&&<FasesTab currentPhase={currentPhase} nextPhaseDate={nextPhaseDate} totalLost={totalLost} onSwitch={handleSwitch}/>}

      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:"white",display:"flex",borderTop:"1px solid #f0f0f0",zIndex:100}}>
        {[{id:"home",icon:"🏠",label:"Dashboard"},{id:"log",icon:"⚖️",label:"Weging"},{id:"fases",icon:"📋",label:"Fases"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"12px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:10,letterSpacing:1,textTransform:"uppercase",fontFamily:"Georgia,serif",color:tab===t.id?"#2d6a4f":"#9ca3af",fontWeight:tab===t.id?700:400,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:20}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
