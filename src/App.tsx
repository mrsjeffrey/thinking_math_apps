
import { useState } from "react";
import { apps } from "./data/apps";
import AppCard from "./components/AppCard";
import SlidePanel from "./components/SlidePanel";

export default function App(){

const [active,setActive]=useState<string|null>(null)

const activeApp=apps.find(a=>a.id===active)

return(
<>
<div className="grid">
{apps.map(app=>(
<AppCard
key={app.id}
title={app.title}
description={app.description}
onClick={()=>setActive(app.id)}
/>
))}
</div>

<SlidePanel
open={!!active}
title={activeApp?.title||""}
onClose={()=>setActive(null)}
>
{activeApp && <activeApp.component/>}
</SlidePanel>
</>
)
}
