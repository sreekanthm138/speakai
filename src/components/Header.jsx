import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
export default function Header(){
  const [open,setOpen]=useState(false)
  const link=(to,t)=>(<NavLink onClick={()=>setOpen(false)} className={({isActive})=>`px-3 py-2 rounded-lg ${isActive?'underline':''}`} to={to}>{t}</NavLink>)
  return (<header className='sticky top-0 z-50 border-b border-border/70 bg-surface/70 backdrop-blur-md'>
    <div className='container-p flex items-center justify-between h-16'>
      <Link to='/' className='flex items-center gap-2 font-bold'><img src='/logo.svg' className='w-7 h-7' alt='SpeakAI'/><span>SpeakAI</span></Link>
      <nav className='hidden md:flex items-center'>{link('/','Home')}{link('/blog','Blog')}{link('/free-prompts','Free Prompts')}{link('/services','Services')}{link('/resources','Resources')}{link('/about','About')}{link('/contact','Contact')}</nav>
      <button className='md:hidden px-3 py-2 border border-border rounded-xl' onClick={()=>setOpen(!open)} aria-label='Toggle menu'>☰</button>
    </div>
    {open&&<div className='md:hidden container-p pb-3 space-y-1'><div className='flex flex-col'>{link('/','Home')}{link('/blog','Blog')}{link('/free-prompts','Free Prompts')}{link('/services','Services')}{link('/resources','Resources')}{link('/about','About')}{link('/contact','Contact')}</div></div>}
  </header>)
}
