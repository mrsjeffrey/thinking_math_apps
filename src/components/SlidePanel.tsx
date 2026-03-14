
import { ReactNode } from "react";

type Props={
open:boolean
title:string
onClose:()=>void
children:ReactNode
}

export default function SlidePanel({open,title,onClose,children}:Props){
return(
<div className={`panel-overlay ${open?"open":""}`} onClick={onClose}>
<div className={`panel ${open?"open":""}`} onClick={e=>e.stopPropagation()}>
<div className="panel-header">
<h2>{title}</h2>
<button onClick={onClose}>Close</button>
</div>
{children}
</div>
</div>
)
}
