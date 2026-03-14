
type Props={
title:string
description:string
onClick:()=>void
}

export default function AppCard({title,description,onClick}:Props){
return(
<div className="card" onClick={onClick}>
<h2>{title}</h2>
<p>{description}</p>
</div>
)
}
