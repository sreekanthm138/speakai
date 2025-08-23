import { useEffect } from 'react'
export default function GA4(){
  useEffect(()=>{const id=import.meta.env.VITE_GA_ID;if(!id)return;const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${id}`;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)};window.gtag=gtag;gtag('js',new Date());gtag('config',id)},[]);return null}
