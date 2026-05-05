import { useState, useEffect, useCallback } from "react";

const KEYS = { entries:"hr-entries", phase:"hr-phase", nextDate:"hr-nextdate", profile:"hr-profile" };
function load(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

const QUOTES = ["Vandaag is een nieuwe kans. Pak hem! 🌿", "Je bent verder dan gisteren. Dat telt.", "Rust is ook vooruitgang.", "Jij doet dit voor jezelf. En dat is genoeg.", "Kleine stapjes, grote reis.", "Je lichaam werkt hard voor je. Wees lief voor hem.", "Elke dag opnieuw — dat is kracht.", "Vandaag goed voor jezelf zorgen is de beste investering.", "Je bent sterker dan je denkt.", "Eén dag tegelijk. Dat is alles wat nodig is.", "Vertrouw op het proces. Jij bent op de goede weg.", "Je hoeft niet perfect te zijn. Gewoon doorgaan.", "Rust nemen is ook werken aan jezelf.", "Elke keuze die je maakt voor jezelf telt.", "Je bent verder dan een week geleden. Kijk eens terug.", "Geduld is ook een superkracht.", "Vandaag is genoeg. Jij bent genoeg.", "Je lichaam doet zijn best. Doe jij dat ook.", "Bewegen, eten, rusten — de drie pijlers van jouw kracht.", "Het gaat niet om snel. Het gaat om blijvend.", "Elke ochtend opnieuw beginnen is moed.", "Jij bent de investering waard.", "Stap voor stap. Dag voor dag.", "Jouw reis is uniek. Vergelijk je niet met anderen.", "Vandaag gezonde keuzes maken is een cadeau aan jezelf.", "Je bent al verder dan degene die het nooit probeerde.", "Elke stap telt, ook de kleine.", "Vandaag mag je trots op jezelf zijn.", "Jij hebt de kracht om door te gaan.", "Je doet het geweldig — ook als het niet zo voelt.", "Vooruitgang is niet altijd zichtbaar, maar het is er.", "Wees geduldig met jezelf.", "Jij bent het waard om voor te zorgen.", "Elke dag een beetje beter is genoeg.", "Vertrouw op jezelf.", "Je lichaam is aan het veranderen, ook als je het niet ziet.", "Doorzetten is jouw superkracht.", "Vandaag ben jij de held van jouw eigen verhaal.", "Geniet van de reis, niet alleen van het doel.", "Jij bent meer dan een getal. Je bent een heel mens.", "Elke dag dat je doorgaat is een overwinning.", "Je bent op de goede weg. Blijf gaan.", "Vandaag is een goede dag om goed voor jezelf te zorgen.", "Jouw lichaam verdient liefde en aandacht.", "Je hebt al zoveel bereikt. Vergeet dat niet.", "Vandaag kies jij voor jezelf.", "Elke goede keuze is een stapje vooruit.", "Het pad is soms hobbelig. Dat hoort erbij.", "Vandaag draag je bij aan jouw toekomst.", "Kleine overwinningen zijn ook overwinningen.", "Je bent precies waar je moet zijn.", "Jouw kracht groeit elke dag.", "Vertrouw op het pad dat je hebt gekozen.", "Je bent niet alleen op deze reis.", "Elke dag is een kans om iets moois te doen voor jezelf.", "Jij bent sterker dan de moeilijke dagen.", "Vandaag zet je weer een stap. Goed bezig!", "Je hoeft niet alles perfect te doen. Gewoon doen is genoeg.", "Jouw gezondheid is jouw grootste rijkdom.", "Elke dag opnieuw kiezen voor jezelf is liefde.", "Je bent verder dan je gisteren was.", "Vandaag mag je trots zijn op wie je bent.", "Jij maakt het verschil voor jezelf.", "Elke ochtend is een nieuw begin.", "Je bent een inspiratie — voor jezelf en anderen.", "Vandaag tel jij. Jouw welzijn telt.", "Doorgaan als het moeilijk is — dat is de echte kracht.", "Je hebt al zoveel mooie stappen gezet.", "Vandaag is de dag dat jij kiest voor jou.", "Jouw reis is de moeite waard.", "Elke dag een beetje meer jezelf zijn.", "Je bent goed bezig. Blijf vertrouwen.", "Vandaag mag je genieten van wie je bent.", "Jij bent de moeite waard om voor te zorgen.", "Elke stap brengt je dichter bij jezelf.", "Vandaag kies jij bewust. Dat is kracht.", "Je groeit elke dag, ook als je het niet voelt.", "Jij bent meer dan je resultaten.", "Vandaag is een cadeau. Gebruik het goed.", "Elke dag dat je doorgaat telt dubbel.", "Vandaag doe je het — stap voor stap.", "Je verdient alle goede dingen die op je pad komen.", "Elke keuze voor jezelf is een daad van zelfliefde.", "Jij hebt dit in je. Dat weet je.", "Vandaag is jouw dag.", "Je bent verder dan je denkt.", "Elke dag bewust leven is een gave.", "Jouw kracht zit van binnen. Tap erop.", "Vandaag zet je de toon voor morgen.", "Je bent op de goede weg. Vertrouw erop.", "Elke dag is een nieuw hoofdstuk in jouw verhaal.", "Jij bent de schrijver van jouw eigen verhaal.", "Vandaag mag je zijn wie je bent.", "Je bent precies goed zoals je bent — en je groeit nog.", "Elke dag opnieuw: jij kiest voor jou. 🌿"];
const FASE2_CHECKLIST = ["Groenten gegeten (min. 400g)?", "250g proteïne gegeten?", "2x fruit gehad?", "Voldoende water gedronken (2L)?", "Supplementen ingenomen?", "Geen koolhydraten gegeten?", "Geen suiker gegeten?", "Gewogen vanochtend?"];
const FASE3_CHECKLIST = ["Gevarieerd gegeten?", "Voldoende water gedronken?", "Supplementen ingenomen?", "Gewogen vanochtend?", "Stabiel gebleven (max 500g schommeling)?", "Bewogen vandaag?"];

function generateMilestones(totalToLose) {
  const milestones = [];
  const max = Math.round(totalToLose);
  const firstEmojis = ["🌱","✨","💪","🌿","⭐"];
  const firstMsgs = ["1 kg eraf! De eerste stap is gezet!","2 kg! Je bent op weg!","3 kg! Geweldig bezig!","4 kg! Je voelt het al!","5 kg! Fantastische start!"];
  for (let i = 1; i <= Math.min(5, max); i++) { milestones.push({ loss: i, emoji: firstEmojis[i-1], msg: firstMsgs[i-1] }); }
  const laterEmojis = ["🎯","🏆","🔥","💫","🌟","👑","🎉","💎","🦋","🌈"];
  for (let i = 10; i < max; i += 5) { const idx = Math.floor((i-10)/5) % laterEmojis.length; milestones.push({ loss: i, emoji: laterEmojis[idx], msg: i + " kg eraf! Ongelooflijk goed bezig!" }); }
  const half = Math.round(totalToLose / 2);
  if (half > 5 && half % 5 !== 0 && half < max) { milestones.push({ loss: half, emoji: "🏅", msg: "Halverwege! " + half + " kg eraf — je bent er bijna!" }); }
  if (max > 0) milestones.push({ loss: max, emoji: "🎊", msg: "DOEL BEREIKT! " + max + " kg eraf — wat een prestatie!" });
  return milestones.sort((a, b) => a.loss - b.loss);
}

const card = { background:"white", borderRadius:20, padding:"20px 18px", margin:"0 0 14px", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" };
const lbl  = { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#9ca3af", marginBottom:8, fontFamily:"Georgia,serif" };
const inp  = { width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"13px 14px", fontSize:17, fontFamily:"Georgia,serif", outline:"none", boxSizing:"border-box", background:"white" };
const btn  = { background:"#2d6a4f", color:"white", border:"none", borderRadius:14, padding:"15px 20px", fontSize:15, fontFamily:"Georgia,serif", cursor:"pointer", width:"100%", fontWeight:600 };
const btnSm= { background:"transparent", color:"#2d6a4f", border:"2px solid #2d6a4f", borderRadius:12, padding:"8px 14px", fontSize:12, fontFamily:"Georgia,serif", cursor:"pointer" };

function HRIcon({ size=60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect width="200" height="200" rx="100" fill="#1b4332"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#52b788" strokeWidth="5"/>
      <text x="100" y="128" textAnchor="middle" fontFamily="Georgia,serif" fontSize="80" fontWeight="700" fill="white">HR</text>
      <ellipse cx="163" cy="32" rx="18" ry="10" fill="#52b788" transform="rotate(-35 163 32)"/>
      <line x1="161" y1="22" x2="148" y2="48" stroke="#1b4332" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const handleCheck = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/check-subscriber", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.toegang) { localStorage.setItem("hr-toegang", email); onLogin(); } else { setStatus("error"); }
    } catch { setStatus("error"); }
  };
  return (
    <div style={{fontFamily:"Georgia,serif",background:"linear-gradient(160deg,#1b4332 0%,#2d6a4f 60%,#40916c 100%)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <HRIcon size={90}/>
      <div style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"#52b788",marginTop:24,marginBottom:8}}>Health Reset 3.0</div>
      <div style={{fontSize:28,fontWeight:700,color:"white",marginBottom:8,textAlign:"center"}}>Jouw persoonlijke dashboard</div>
      <div style={{fontSize:15,color:"rgba(255,255,255,0.7)",marginBottom:36,textAlign:"center",lineHeight:1.6,maxWidth:320}}>Voer je e-mailadres in om toegang te krijgen.</div>
      <div style={{background:"white",borderRadius:24,padding:"32px 28px",width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{...lbl,marginBottom:8}}>E-mailadres</div>
        <input style={{...inp, marginBottom:16}} type="email" placeholder="jouw@email.nl" value={email} onChange={e => { setEmail(e.target.value); setStatus("idle"); }} onKeyDown={e => e.key === "Enter" && handleCheck()} autoCapitalize="off" autoCorrect="off"/>
        {status === "error" && <div style={{background:"#fff0f0",border:"1.5px solid #fca5a5",borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#e76f51",lineHeight:1.5}}>Dit e-mailadres staat niet in onze lijst. Heb je je al aangemeld via de landingspagina?</div>}
        <button onClick={handleCheck} disabled={status === "loading" || !email.includes("@")} style={{...btn, opacity: (status === "loading" || !email.includes("@")) ? 0.6 : 1}}>{status === "loading" ? "Controleren… 🌿" : "Toegang aanvragen 🌿"}</button>
        <div style={{fontSize:11,color:"#9ca3af",textAlign:"center",marginTop:16,lineHeight:1.6}}>Nog geen toegang? Meld je aan via de landingspagina.</div>
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ["#2d6a4f","#52b788","#b5838d","#ffd166","#06d6a0","#f4a261"];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      {Array.from({length:40},(_,i)=>(<div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:"-20px",width:8+Math.random()*8,height:8+Math.random()*8,background:colors[i%colors.length],borderRadius:Math.random()>.5?"50%":"2px",animation:`cffall ${2.5+Math.random()*1.5}s ${Math.random()*1.2}s linear forwards`}}/>))}
      <style>{`@keyframes cffall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

function Chart({ entries, goalWeight, height=140 }) {
  const [tooltip, setTooltip] = useState(null);
  if (entries.length < 2) return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:13}}>Voeg meer metingen toe voor de grafiek</div>;
  const W=340,H=height,PL=38,PR=14,PT=10,PB=26;
  const ws=entries.map(e=>e.weight);
  const mn=Math.floor(Math.min(...ws))-1,mx=Math.ceil(Math.max(...ws))+1;
  const px=i=>PL+i*(W-PL-PR)/(entries.length-1);
  const py=w=>PT+((mx-w)/(mx-mn))*(H-PT-PB);
  const path=entries.map((e,i)=>(i===0?"M":"L")+px(i).toFixed(1)+","+py(e.weight).toFixed(1)).join(" ");
  const area=path+" L"+px(entries.length-1).toFixed(1)+","+(H-PB).toFixed(1)+" L"+PL+","+(H-PB).toFixed(1)+" Z";
  const yLabels=Array.from({length:5},(_,i)=>Math.round(mn+(mx-mn)*i/4));
  const xIdx=entries.length<=6?entries.map((_,i)=>i):[0,Math.floor(entries.length*0.33),Math.floor(entries.length*0.66),entries.length-1];
  const fmt=d=>{const dt=new Date(d);return dt.getDate()+" "+["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"][dt.getMonth()];};
  return (
    <svg width="100%" viewBox={"0 0 "+W+" "+H} style={{overflow:"visible"}} onMouseLeave={()=>setTooltip(null)}>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52b788" stopOpacity=".25"/><stop offset="100%" stopColor="#52b788" stopOpacity="0"/></linearGradient></defs>
      {yLabels.map(y=><g key={y}><line x1={PL} y1={py(y)} x2={W-PR} y2={py(y)} stroke="#f3f4f6" strokeWidth="1"/><text x={PL-4} y={py(y)+4} textAnchor="end" fontSize="9" fill="#9ca3af">{y}</text></g>)}
      {goalWeight>=mn&&goalWeight<=mx&&<><line x1={PL} y1={py(goalWeight)} x2={W-PR} y2={py(goalWeight)} stroke="#b5838d" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7"/><text x={W-PR+2} y={py(goalWeight)+4} fontSize="8" fill="#b5838d">doel</text></>}
      <path d={area} fill="url(#cg)"/>
      <path d={path} fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {xIdx.map(i=><text key={i} x={px(i)} y={H-PB+14} textAnchor="middle" fontSize="9" fill="#9ca3af">{fmt(entries[i].date)}</text>)}
      {entries.map((e,i)=>(
        <g key={i} style={{cursor:"pointer"}} onClick={()=>setTooltip(tooltip&&tooltip.i===i?null:{i,x:px(i),y:py(e.weight),e})} onMouseEnter={()=>setTooltip({i,x:px(i),y:py(e.weight),e})}>
          <circle cx={px(i)} cy={py(e.weight)} r="16" fill="transparent"/>
          <circle cx={px(i)} cy={py(e.weight)} r={tooltip&&tooltip.i===i?5:3} fill={tooltip&&tooltip.i===i?"#1b4332":"#2d6a4f"} stroke={tooltip&&tooltip.i===i?"white":"none"} strokeWidth="1.5"/>
        </g>
      ))}
      {tooltip&&(()=>{const tx=Math.min(Math.max(tooltip.x,PL+36),W-PR-36),ty=tooltip.y<50?tooltip.y+12:tooltip.y-42;return(<g><rect x={tx-36} y={ty} width="72" height="30" rx="8" fill="#1b4332"/><text x={tx} y={ty+13} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{tooltip.e.weight} kg</text><text x={tx} y={ty+25} textAnchor="middle" fontSize="9" fill="#86efac">{fmt(tooltip.e.date)}</text></g>);})()}
    </svg>
  );
}

function ChartModal({ entries, goalWeight, onClose }) {
  const fmt=d=>new Date(d).toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"});
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"white",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#2d6a4f,#1b4332)",color:"white",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700}}>Volledig gewichtsverloop</div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:20}}>x</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 12px 40px"}}>
        <Chart entries={entries} goalWeight={goalWeight} height={200}/>
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
                {prev&&<div style={{fontSize:12,color:diff<0?"#2d6a4f":"#e76f51",fontWeight:400}}>{diff<0?"v":"^"}{Math.abs(diff).toFixed(1)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyQuote({ onClose }) {
  const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,background:"rgba(27,67,50,0.85)",padding:24}}>
      <div style={{background:"white",borderRadius:24,padding:32,textAlign:"center",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontSize:40,marginBottom:16}}>🌿</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#1b4332",lineHeight:1.5,marginBottom:24}}>{quote}</div>
        <button onClick={onClose} style={{background:"#2d6a4f",color:"white",border:"none",borderRadius:14,padding:"12px 32px",fontSize:15,fontFamily:"Georgia,serif",cursor:"pointer",fontWeight:600}}>Aan de slag! 💪</button>
      </div>
    </div>
  );
}

function calcStreak(entries) {
  if (!entries.length) return 0;
  const sorted = [...entries].sort((a,b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().slice(0,10);
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
  if (sorted[0].date !== today && sorted[0].date !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round((new Date(sorted[i-1].date) - new Date(sorted[i].date)) / 86400000);
    if (diff === 1) streak++; else break;
  }
  return streak;
}

function MoodLog({ onClose }) {
  const storageKey = "hr-mood-" + new Date().toISOString().slice(0,10);
  const saved = localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : null;
  const [mood, setMood] = useState(saved&&saved.mood ? saved.mood : null);
  const [note, setNote] = useState(saved&&saved.note ? saved.note : "");
  const [done, setDone] = useState(!!saved);
  const moods = [{emoji:"😄",label:"Super!"},{emoji:"😊",label:"Goed"},{emoji:"😐",label:"Oké"},{emoji:"😔",label:"Minder"},{emoji:"😴",label:"Moe"}];
  const handleSave = () => { localStorage.setItem(storageKey, JSON.stringify({mood, note})); setDone(true); setTimeout(onClose, 800); };
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,background:"rgba(0,0,0,0.5)",padding:24}}>
      <div style={{background:"white",borderRadius:24,padding:28,maxWidth:360,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#1b4332",marginBottom:6}}>Hoe voel je je vandaag?</div>
        <div style={{fontSize:13,color:"#9ca3af",marginBottom:20}}>Optioneel — gewoon voor jezelf</div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
          {moods.map(m=>(<button key={m.emoji} onClick={()=>setMood(m.emoji)} style={{background:mood===m.emoji?"#d8f3dc":"#f4f1eb",border:mood===m.emoji?"2px solid #2d6a4f":"2px solid transparent",borderRadius:14,padding:"10px 8px",cursor:"pointer",textAlign:"center",flex:1}}><div style={{fontSize:28}}>{m.emoji}</div><div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{m.label}</div></button>))}
        </div>
        <textarea style={{width:"100%",border:"1.5px solid #e5e7eb",borderRadius:12,padding:"12px 14px",fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box",resize:"none",height:80}} placeholder="Wil je nog iets kwijt? (optioneel)" value={note} onChange={e=>setNote(e.target.value)} autoCapitalize="sentences"/>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          <button onClick={onClose} style={{flex:1,background:"#f4f1eb",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer",color:"#6b7280"}}>Overslaan</button>
          <button onClick={handleSave} disabled={!mood} style={{flex:2,background:done?"#52b788":mood?"#2d6a4f":"#d1d5db",color:"white",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontFamily:"Georgia,serif",cursor:mood?"pointer":"default",fontWeight:600,transition:"background .3s"}}>{done?"Opgeslagen!":"Opslaan"}</button>
        </div>
      </div>
    </div>
  );
}

function FaseChecklist({ phase, onClose }) {
  const storageKey = "hr-check-" + new Date().toISOString().slice(0,10);
  const saved = localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : {};
  const [checked, setChecked] = useState(saved);
  const list = phase === 2 ? FASE2_CHECKLIST : FASE3_CHECKLIST;
  const toggle = (item) => { const n = {...checked, [item]: !checked[item]}; setChecked(n); localStorage.setItem(storageKey, JSON.stringify(n)); };
  const doneCount = list.filter(i => checked[i]).length;
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,background:"rgba(0,0,0,0.5)",padding:24}}>
      <div style={{background:"white",borderRadius:24,padding:28,maxWidth:360,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#1b4332"}}>{phase===2?"Fase 2 checklist":"Fase 3 checklist"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#9ca3af"}}>x</button>
        </div>
        <div style={{fontSize:13,color:"#9ca3af",marginBottom:16}}>{doneCount} van {list.length} gedaan vandaag</div>
        <div style={{background:"#d8f3dc",borderRadius:99,height:8,marginBottom:20,overflow:"hidden"}}><div style={{height:"100%",background:"#2d6a4f",borderRadius:99,width:`${(doneCount/list.length)*100}%`,transition:"width .3s"}}/></div>
        {list.map(item=>(
          <div key={item} onClick={()=>toggle(item)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #f4f1eb",cursor:"pointer"}}>
            <div style={{width:24,height:24,borderRadius:6,border:checked[item]?"none":"2px solid #d1d5db",background:checked[item]?"#2d6a4f":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>{checked[item]&&<div style={{color:"white",fontSize:14}}>v</div>}</div>
            <div style={{fontSize:14,color:checked[item]?"#9ca3af":"#374151",textDecoration:checked[item]?"line-through":"none",transition:"all .2s"}}>{item}</div>
          </div>
        ))}
        {doneCount===list.length&&<div style={{textAlign:"center",padding:"16px 0",fontSize:16,color:"#2d6a4f",fontWeight:600}}>Alles gedaan vandaag!</div>}
      </div>
    </div>
  );
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10));
  const [phase, setPhase] = useState(2);
  const [nextDate, setNextDate] = useState("");
  const canNext = [name.trim().length>0, parseFloat(startWeight.replace(",","."))>0, parseFloat(goalWeight.replace(",","."))>0, startDate.length>0, nextDate.length>0];
  const finish = () => {
    const profile = { name: name.trim(), startWeight: parseFloat(startWeight.replace(",",".")), goalWeight: parseFloat(goalWeight.replace(",",".")), startDate };
    save(KEYS.profile, profile); save(KEYS.phase, phase); save(KEYS.nextDate, nextDate);
    save(KEYS.entries, [{date: startDate, weight: profile.startWeight, note: "Start!"}]);
    onComplete(profile, phase, nextDate);
  };
  const steps = [
    <div style={{textAlign:"center",padding:"40px 24px"}}><HRIcon size={100}/><div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#2d6a4f",marginTop:24,marginBottom:12}}>Welkom bij Health Reset 3.0</div><div style={{fontSize:15,color:"#6b7280",lineHeight:1.7,marginBottom:32}}>Jouw persoonlijke dashboard voor de reset.</div><button onClick={()=>setStep(1)} style={btn}>Aan de slag!</button></div>,
    <div style={{padding:"32px 24px"}}><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:8}}>Hoe heet je?</div><div style={{fontSize:14,color:"#9ca3af",marginBottom:24}}>Stap 1 van 4</div><input style={inp} autoCapitalize="words" placeholder="Jouw naam" value={name} onChange={e=>setName(e.target.value)}/><button onClick={()=>setStep(2)} disabled={!canNext[0]} style={{...btn,marginTop:20,opacity:canNext[0]?1:0.4}}>Volgende</button></div>,
    <div style={{padding:"32px 24px"}}><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:8}}>Jouw gewichten</div><div style={{fontSize:14,color:"#9ca3af",marginBottom:24}}>Stap 2 van 4</div><div style={{...lbl,marginBottom:6}}>Startgewicht (kg)</div><input style={inp} inputMode="decimal" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="bijv. 95.0" value={startWeight} onChange={e=>setStartWeight(e.target.value)}/><div style={{...lbl,marginTop:16,marginBottom:6}}>Doelgewicht (kg)</div><input style={inp} inputMode="decimal" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="bijv. 70.0" value={goalWeight} onChange={e=>setGoalWeight(e.target.value)}/><div style={{...lbl,marginTop:16,marginBottom:6}}>Startdatum reset</div><input type="date" style={inp} value={startDate} onChange={e=>setStartDate(e.target.value)}/><button onClick={()=>setStep(3)} disabled={!canNext[1]||!canNext[2]||!canNext[3]} style={{...btn,marginTop:20,opacity:(canNext[1]&&canNext[2]&&canNext[3])?1:0.4}}>Volgende</button></div>,
    <div style={{padding:"32px 24px"}}><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:8}}>Welke fase zit je in?</div><div style={{fontSize:14,color:"#9ca3af",marginBottom:24}}>Stap 3 van 4</div><div style={{display:"flex",gap:10,marginBottom:20}}>{[{id:2,label:"Fase 2",desc:"Vetverbranding"},{id:3,label:"Fase 3",desc:"Stabilisatie"}].map(p=>(<button key={p.id} onClick={()=>setPhase(p.id)} style={{flex:1,padding:"14px 8px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,fontSize:15,background:phase===p.id?"#2d6a4f":"#f4f1eb",color:phase===p.id?"white":"#6b7280",transition:"all 0.2s"}}>{p.label}<br/><span style={{fontSize:12,fontWeight:400}}>{p.desc}</span></button>))}</div><div style={{...lbl,marginBottom:6}}>Wanneer wissel je naar de volgende fase?</div><input type="date" style={inp} value={nextDate} onChange={e=>setNextDate(e.target.value)}/><button onClick={()=>setStep(4)} disabled={!canNext[4]} style={{...btn,marginTop:20,opacity:canNext[4]?1:0.4}}>Volgende</button></div>,
    <div style={{textAlign:"center",padding:"40px 24px"}}><div style={{fontSize:64,marginBottom:16}}>🎉</div><div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#2d6a4f",marginBottom:12}}>Alles is ingesteld, {name}!</div><div style={{fontSize:15,color:"#6b7280",lineHeight:1.7,marginBottom:32}}>Jouw persoonlijke Health Reset dashboard staat klaar.</div><button onClick={finish} style={btn}>Naar mijn dashboard</button></div>,
  ];
  return (<div style={{fontFamily:"Georgia,serif",background:"#f4f1eb",minHeight:"100vh",maxWidth:420,margin:"0 auto",display:"flex",flexDirection:"column",justifyContent:"center"}}><div style={{...card,margin:20}}>{steps[step]}</div></div>);
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
    if(isNaN(w)||w<20||w>300)return;
    onSave({date,weight:w,note}); setWeight(""); setNote("");
    setSaved(true); setTimeout(()=>setSaved(false),2200);
  };
  return (
    <div style={{padding:"20px 16px"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:16}}>Weging invoeren</div>
      <div style={card}>
        <div style={{...lbl,marginBottom:6}}>Datum</div><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
        <div style={{...lbl,marginTop:16,marginBottom:6}}>Gewicht (kg)</div><input style={inp} inputMode="decimal" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} placeholder="bijv. 85.3" value={weight} onChange={e=>setWeight(e.target.value)}/>
        <div style={{...lbl,marginTop:16,marginBottom:6}}>Notitie (optioneel)</div><input style={inp} autoComplete="off" autoCorrect="off" autoCapitalize="sentences" spellCheck={true} placeholder="bijv. Appeldag, sportdag..." value={note} onChange={e=>setNote(e.target.value)}/>
        <button onClick={handleSave} style={{...btn,marginTop:14,background:saved?"#52b788":"#2d6a4f",transition:"background .3s"}}>{saved?"Opgeslagen!":"Opslaan"}</button>
      </div>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#2d6a4f",margin:"20px 0 12px"}}>Recente wegingen</div>
      {[...sorted].reverse().slice(0,30).map(e=>{
        const idx=sorted.findIndex(x=>x.date===e.date); const prev=sorted[idx-1]; const diff=prev?e.weight-prev.weight:0;
        return (
          <div key={e.date} style={{...card,padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#9ca3af"}}>{new Date(e.date).toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"})}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#2d6a4f"}}>{e.weight} kg{prev&&<span style={{fontSize:13,marginLeft:8,color:diff<0?"#2d6a4f":"#e76f51",fontWeight:400}}>{diff<0?"v":"^"}{Math.abs(diff).toFixed(1)}</span>}</div>
              {e.note?<div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{e.note}</div>:null}
            </div>
            {delConfirm===e.date?(<div style={{display:"flex",gap:6}}><button onClick={()=>{onDelete(e.date);setDelConfirm(null);}} style={{...btnSm,color:"#e76f51",borderColor:"#e76f51"}}>Ja</button><button onClick={()=>setDelConfirm(null)} style={btnSm}>Nee</button></div>):(<button onClick={()=>setDelConfirm(e.date)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#d1d5db",padding:4}}>x</button>)}
          </div>
        );
      })}
    </div>
  );
}

function FasesTab({ currentPhase, nextPhaseDate, totalLost, onSwitch, milestones }) {
  const [localPhase,setLocalPhase]=useState(currentPhase);
  const [localDate,setLocalDate]=useState(nextPhaseDate);
  const [saved,setSaved]=useState(false);
  return (
    <div style={{padding:"20px 16px"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#2d6a4f",marginBottom:6}}>Fase beheer</div>
      <div style={{fontSize:13,color:"#9ca3af",marginBottom:20}}>Stel in welke fase je zit en wanneer je wisselt.</div>
      <div style={card}>
        <div style={{...lbl,marginBottom:10}}>Huidige fase</div>
        <div style={{display:"flex",gap:10}}>{[{id:2,label:"Fase 2",desc:"Vetverbranding"},{id:3,label:"Fase 3",desc:"Stabilisatie"}].map(p=>(<button key={p.id} onClick={()=>setLocalPhase(p.id)} style={{flex:1,padding:"12px 8px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:600,fontSize:14,background:localPhase===p.id?"#2d6a4f":"#f4f1eb",color:localPhase===p.id?"white":"#6b7280",transition:"all 0.2s"}}>{p.label}<br/><span style={{fontSize:11,fontWeight:400}}>{p.desc}</span></button>))}</div>
        <div style={{...lbl,marginTop:18,marginBottom:6}}>Volgende wissel op</div>
        <input type="date" value={localDate} onChange={e=>setLocalDate(e.target.value)} style={inp}/>
        <button onClick={()=>{onSwitch(localPhase,localDate);setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{...btn,marginTop:14,background:saved?"#52b788":"#2d6a4f",transition:"background .3s"}}>{saved?"Opgeslagen!":"Opslaan"}</button>
      </div>
      <div style={{...card,borderLeft:"4px solid #2d6a4f"}}><div style={{fontWeight:700,color:"#2d6a4f",marginBottom:8}}>Fase 2 — Vetverbranding (21 dagen)</div><div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>Groenten onbeperkt (min. 400g), 250g proteïne, 2x fruit, 2x grissini of wasa, geen koolhydraten, geen suiker, alleen krachtsport op 60%</div></div>
      <div style={{...card,borderLeft:"4px solid #b5838d",marginTop:12}}><div style={{fontWeight:700,color:"#b5838d",marginBottom:8}}>Fase 3 — Stabilisatie (21 dagen)</div><div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>Gezonde oliën en vetten, alle groenten, alle fruitsoorten, noten, kwark, rode wijn, haverzemelen max 3x/week (30g), doel: stabiel blijven</div></div>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#2d6a4f",margin:"20px 0 12px"}}>Mijlpalen</div>
      {milestones.map(m=>{
        const done=totalLost>=m.loss;
        return (<div key={m.loss} style={{...card,marginBottom:8,display:"flex",alignItems:"center",gap:12,padding:"12px 16px",opacity:done?1:0.45}}><div style={{fontSize:24}}>{m.emoji}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:done?"#2d6a4f":"#9ca3af"}}>{"−"+m.loss+" kg"}</div><div style={{fontSize:12,color:"#9ca3af"}}>{m.msg}</div></div>{done&&<div style={{color:"#2d6a4f",fontSize:18}}>v</div>}</div>);
      })}
    </div>
  );
}

export default function App() {
  const [ingelogd, setIngelogd] = useState(false);
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(2);
  const [nextPhaseDate, setNextPhaseDate] = useState("");
  const [tab, setTab] = useState("home");
  const [confetti, setConfetti] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [ready, setReady] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(()=>{
    if (localStorage.getItem("hr-toegang")) setIngelogd(true);
    const p=load(KEYS.profile); const e=load(KEYS.entries); const ph=load(KEYS.phase); const nd=load(KEYS.nextDate);
    if(p) setProfile(p); if(e) setEntries(e); if(ph) setCurrentPhase(ph); if(nd) setNextPhaseDate(nd);
    setReady(true);
    const today = new Date().toISOString().slice(0,10);
    if (localStorage.getItem("hr-last-quote") !== today) { setTimeout(() => setShowQuote(true), 500); localStorage.setItem("hr-last-quote", today); }
  },[]);

  const ESRA_ENTRIES = [{date:"2026-02-18",weight:137,note:"Start!"},{date:"2026-02-19",weight:135.9,note:""},{date:"2026-02-20",weight:134.8,note:""},{date:"2026-02-21",weight:134.3,note:""},{date:"2026-02-22",weight:133.8,note:""},{date:"2026-02-24",weight:133.6,note:""},{date:"2026-02-25",weight:133.2,note:""},{date:"2026-02-26",weight:133.1,note:""},{date:"2026-02-27",weight:132.5,note:""},{date:"2026-03-01",weight:132.8,note:""},{date:"2026-03-02",weight:132.2,note:""},{date:"2026-03-04",weight:131.9,note:""},{date:"2026-03-06",weight:131.2,note:""},{date:"2026-03-08",weight:131.3,note:""},{date:"2026-03-09",weight:130.7,note:""},{date:"2026-03-10",weight:130.5,note:""},{date:"2026-03-11",weight:130.2,note:""},{date:"2026-03-12",weight:130,note:""},{date:"2026-03-13",weight:129.5,note:""},{date:"2026-03-14",weight:129.3,note:""},{date:"2026-03-16",weight:128.9,note:""},{date:"2026-03-17",weight:128.5,note:""},{date:"2026-03-19",weight:127.7,note:""},{date:"2026-03-20",weight:127.6,note:""},{date:"2026-03-23",weight:127.3,note:""},{date:"2026-03-24",weight:126.8,note:""},{date:"2026-03-25",weight:126.5,note:""},{date:"2026-03-27",weight:126.4,note:"Start fase 3"},{date:"2026-03-28",weight:126,note:""},{date:"2026-03-29",weight:125.8,note:""},{date:"2026-03-30",weight:125.4,note:""},{date:"2026-03-31",weight:125,note:""},{date:"2026-04-01",weight:124.3,note:""},{date:"2026-04-03",weight:124.3,note:""},{date:"2026-04-04",weight:124.1,note:""},{date:"2026-04-05",weight:124.4,note:""},{date:"2026-04-07",weight:124.1,note:""},{date:"2026-04-08",weight:123.9,note:""},{date:"2026-04-09",weight:124.3,note:""},{date:"2026-04-10",weight:123.4,note:"Start fase 2"},{date:"2026-04-11",weight:123,note:""},{date:"2026-04-12",weight:122.9,note:""},{date:"2026-04-13",weight:122.7,note:""},{date:"2026-04-14",weight:122.1,note:""},{date:"2026-04-16",weight:121.8,note:""},{date:"2026-04-17",weight:121.5,note:""},{date:"2026-04-18",weight:121.7,note:""},{date:"2026-04-19",weight:121.3,note:""},{date:"2026-04-20",weight:121.5,note:""},{date:"2026-04-21",weight:121.3,note:""},{date:"2026-04-22",weight:120.8,note:""},{date:"2026-04-23",weight:120.5,note:""},{date:"2026-04-24",weight:120.6,note:""},{date:"2026-04-25",weight:120.3,note:""},{date:"2026-04-26",weight:119.7,note:""},{date:"2026-04-27",weight:119.8,note:""},{date:"2026-04-28",weight:120,note:""},{date:"2026-04-29",weight:119.5,note:""},{date:"2026-05-01",weight:118.6,note:""},{date:"2026-05-02",weight:118.7,note:""},{date:"2026-05-03",weight:118.3,note:"Twee dagen terug 12000 stappen gelopen!"},{date:"2026-05-04",weight:118.5,note:""}];

  const handleOnboardingComplete = (p, ph, nd) => {
    setProfile(p); setCurrentPhase(ph); setNextPhaseDate(nd);
    const isEsra = p.name.toLowerCase().trim() === "esra" && parseFloat(p.startWeight) === 137;
    const startEntries = isEsra ? ESRA_ENTRIES : [{date:p.startDate, weight:p.startWeight, note:"Start!"}];
    setEntries(startEntries); save(KEYS.entries, startEntries);
  };

  const sorted = [...entries].sort((a,b)=>a.date.localeCompare(b.date));
  const latest = sorted[sorted.length-1];
  const startWeight = profile ? profile.startWeight : 0;
  const goalWeight = profile ? profile.goalWeight : 0;
  const currentWeight = latest ? latest.weight : startWeight;
  const totalLost = +(startWeight - currentWeight).toFixed(1);
  const remaining = +(currentWeight - goalWeight).toFixed(1);
  const totalToLose = startWeight - goalWeight;
  const progressPct = totalToLose > 0 ? Math.min(100,(totalLost/totalToLose)*100) : 0;
  const phaseLabel = currentPhase===2 ? "Fase 2 — Vetverbranding" : "Fase 3 — Stabilisatie";
  const streak = calcStreak(sorted);
  const daysToPhase = nextPhaseDate ? Math.max(0, Math.ceil((new Date(nextPhaseDate)-new Date())/86400000)) : 0;
  const milestones = generateMilestones(totalToLose);

  const checkMilestone = useCallback((newLoss, oldLoss) => {
    const hit=[...generateMilestones(totalToLose)].reverse().find(m=>newLoss>=m.loss&&oldLoss<m.loss);
    if(hit){setCelebration(hit);setConfetti(true);setTimeout(()=>{setConfetti(false);setCelebration(null);},5000);}
  },[totalToLose]);

  const handleSave = useCallback((entry) => {
    const oldLoss = totalLost;
    const newEntries = [...entries.filter(e=>e.date!==entry.date), entry].sort((a,b)=>a.date.localeCompare(b.date));
    checkMilestone(+(startWeight - entry.weight).toFixed(1), oldLoss);
    setEntries(newEntries); save(KEYS.entries, newEntries);
  },[entries, totalLost, startWeight, checkMilestone]);

  const handleDelete = useCallback((date) => {
    const newEntries = entries.filter(e=>e.date!==date);
    setEntries(newEntries); save(KEYS.entries, newEntries);
  },[entries]);

  const handleSwitch = useCallback((phase, date) => {
    setCurrentPhase(phase); setNextPhaseDate(date);
    save(KEYS.phase, phase); save(KEYS.nextDate, date);
  },[]);

  const handleLogout = async () => {
    localStorage.removeItem("hr-toegang");
    if (navigator.serviceWorker) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let r of registrations) { await r.unregister(); }
    }
    window.location.replace(window.location.pathname + "?uitgelogd=" + Date.now());
  };

  if (!ready) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Georgia,serif",color:"#2d6a4f",fontSize:18}}>Laden…</div>;
  if (!ingelogd) return <LoginScreen onLogin={() => setIngelogd(true)} />;
  if (!profile) return <Onboarding onComplete={handleOnboardingComplete}/>;

  return (
    <div style={{fontFamily:"Georgia,serif",background:"#f4f1eb",minHeight:"100vh",maxWidth:420,margin:"0 auto",paddingBottom:80}}>
      {confetti&&<Confetti/>}
      {showQuote && <DailyQuote onClose={()=>setShowQuote(false)}/>}
      {showMood && <MoodLog onClose={()=>setShowMood(false)}/>}
      {showChecklist && <FaseChecklist phase={currentPhase} onClose={()=>setShowChecklist(false)}/>}
      {showChart&&<ChartModal entries={sorted} goalWeight={goalWeight} onClose={()=>setShowChart(false)}/>}
      {celebration&&(
        <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,background:"rgba(0,0,0,0.4)"}}>
          <div style={{background:"white",borderRadius:24,padding:32,textAlign:"center",margin:24,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{fontSize:56,marginBottom:12}}>{celebration.emoji}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#2d6a4f",marginBottom:8}}>{celebration.msg}</div>
            <div style={{color:"#9ca3af",fontSize:13}}>Je bent geweldig!</div>
          </div>
        </div>
      )}

      {tab==="home"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#2d6a4f,#1b4332)",color:"white",padding:"24px 20px 32px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}/>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <HRIcon size={44}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                <div style={{fontSize:12,letterSpacing:2,textTransform:"uppercase",opacity:.8}}>Health Reset 3.0</div>
                <button onClick={handleLogout} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:99,padding:"6px 14px",fontSize:11,cursor:"pointer",letterSpacing:1}}>Uitloggen</button>
              </div>
            </div>
            <div style={{fontSize:14,opacity:.7,marginBottom:4}}>Hallo {profile.name}! Huidig gewicht</div>
            <div style={{fontSize:52,fontWeight:700,lineHeight:1,marginBottom:4}}>{currentWeight} <span style={{fontSize:20,fontWeight:400}}>kg</span></div>
            <div style={{fontSize:13,opacity:.75}}>{latest?"Gewogen op "+new Date(latest.date).toLocaleDateString("nl-NL",{day:"numeric",month:"long"}):"Nog geen metingen"}</div>
            <div style={{marginTop:14,display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"6px 14px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:currentPhase===3?"#f9a8d4":"#86efac"}}/>
              <span style={{fontSize:13}}>{phaseLabel}</span>
            </div>
          </div>

          <div style={{padding:"16px 16px 0"}}>
            <div style={card}>
              <div style={lbl}>Voortgang naar doel</div>
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                {[{v:"−"+totalLost,l:"kg afgevallen"},{v:""+(remaining>0?remaining:0),l:"kg te gaan"},{v:progressPct.toFixed(0)+"%",l:"voltooid"}].map((s,i)=>(
                  <div key={i} style={{flex:1,background:"#f4f1eb",borderRadius:14,padding:"12px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#2d6a4f"}}>{s.v}</div>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#d8f3dc",borderRadius:99,height:14,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,#2d6a4f,#52b788)",width:`${progressPct}%`,transition:"width .8s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#9ca3af",marginTop:6}}>
                <span>{startWeight} kg</span><span>Doel: {goalWeight} kg</span>
              </div>
            </div>

            {streak>0&&<div style={{...card,background:"linear-gradient(135deg,#fff9f9,#fce4ec)",border:"1.5px solid #f9c6d0",cursor:"pointer"}} onClick={()=>setShowMood(true)}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:38}}>🔥</div>
                <div>
                  <div style={{fontSize:13,color:"#b5838d",fontWeight:600}}>Weegstreak</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#2d6a4f"}}>{streak} {streak===1?"dag":"dagen"} op rij!</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>Tik om je dag te loggen</div>
                </div>
              </div>
            </div>}

            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <button onClick={()=>setShowChecklist(true)} style={{flex:1,background:"white",border:"1.5px solid #e5e7eb",borderRadius:16,padding:"14px 8px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}><div style={{fontSize:24}}>✅</div><div style={{fontSize:11,color:"#2d6a4f",fontWeight:600,marginTop:4}}>Checklist</div></button>
              <button onClick={()=>setShowMood(true)} style={{flex:1,background:"white",border:"1.5px solid #e5e7eb",borderRadius:16,padding:"14px 8px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}><div style={{fontSize:24}}>😊</div><div style={{fontSize:11,color:"#2d6a4f",fontWeight:600,marginTop:4}}>Dagboek</div></button>
              <button onClick={()=>setShowQuote(true)} style={{flex:1,background:"white",border:"1.5px solid #e5e7eb",borderRadius:16,padding:"14px 8px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}><div style={{fontSize:24}}>💬</div><div style={{fontSize:11,color:"#2d6a4f",fontWeight:600,marginTop:4}}>Quote</div></button>
            </div>

            {nextPhaseDate&&<div style={{...card,background:"linear-gradient(135deg,#fff9f9,#fce4ec)",border:"1.5px solid #f9c6d0"}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:38}}>{currentPhase===2?"🌿":"🔥"}</div>
                <div>
                  <div style={{fontSize:13,color:"#b5838d",fontWeight:600}}>Volgende: {currentPhase===2?"Fase 3 Stabilisatie":"Fase 2 Vetverbranding"}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#2d6a4f"}}>{daysToPhase===0?"Vandaag!":daysToPhase+" dagen"}</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>{new Date(nextPhaseDate).toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"})}</div>
                </div>
              </div>
            </div>}

            <div style={{...card,cursor:"pointer"}} onClick={()=>setShowChart(true)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={lbl}>Gewichtsverloop</div>
                <div style={{fontSize:11,color:"#2d6a4f",fontWeight:600,letterSpacing:1}}>VOLLEDIG</div>
              </div>
              <Chart entries={sorted.slice(-40)} goalWeight={goalWeight} height={130}/>
              <div style={{fontSize:11,color:"#9ca3af",textAlign:"center",marginTop:6}}>Tik op punt voor details</div>
            </div>

            {(()=>{
              const next=milestones.find(m=>totalLost<m.loss);
              if(!next)return null;
              return(<div style={{...card,background:"#f4f1eb"}}><div style={lbl}>Volgende mijlpaal</div><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontSize:32}}>{next.emoji}</div><div><div style={{fontSize:15,fontWeight:600,color:"#2d6a4f"}}>{next.msg}</div><div style={{fontSize:13,color:"#9ca3af",marginTop:2}}>{"Nog "+(next.loss-totalLost).toFixed(1)+" kg te gaan!"}</div></div></div></div>);
            })()}
          </div>
        </div>
      )}

      {tab==="log" && <LogForm sorted={sorted} onSave={handleSave} onDelete={handleDelete}/>}
      {tab==="fases" && <FasesTab currentPhase={currentPhase} nextPhaseDate={nextPhaseDate} totalLost={totalLost} onSwitch={handleSwitch} milestones={milestones}/>}

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
