import { Link } from 'react-router-dom'
export default function Home(){
  return (<main>
    <section className='container-p py-16 text-center'>
      <div className='badge mx-auto mb-4'>New · 50 Free AI Interview Prompts</div>
      <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight'>Speak smarter. <span className='text-brand'>Interview better.</span></h1>
      <p className='text-muted max-w-2xl mx-auto mt-3'>Practical AI tools and tips to improve your communication and interview performance.</p>
      <div className='mt-6 space-x-2'><Link className='btn btn-primary' to='/free-prompts'>🎁 Get the Free PDF</Link><Link className='btn btn-ghost' to='/blog'>Explore the Blog</Link></div>
    </section>
    <section className='container-p grid grid-cols-1 sm:grid-cols-3 gap-4'>
      <div className='card'><div className='text-2xl mb-2'>🎤</div><h3 className='font-semibold text-lg'>AI Interview Practice</h3><p className='text-muted'>Mock prompts and feedback ideas.</p></div>
      <div className='card'><div className='text-2xl mb-2'>🗣️</div><h3 className='font-semibold text-lg'>Speaking Confidence</h3><p className='text-muted'>Exercises for clarity and pace.</p></div>
      <div className='card'><div className='text-2xl mb-2'>⚙️</div><h3 className='font-semibold text-lg'>Tool Reviews</h3><p className='text-muted'>STT, note-taking, and prep tools.</p></div>
    </section>
    <section className='container-p py-12'>
      <h2 className='text-2xl font-bold mb-4'>Latest from the blog</h2>
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <a className='card' href='/blog/ai-interview-tips'><h3 className='font-semibold'>10 AI prompts…</h3><p className='text-muted'>Simulate HR and technical rounds.</p><span className='text-brand font-semibold'>Read →</span></a>
        <a className='card' href='/blog/best-ai-tools-interview-prep'><h3 className='font-semibold'>Best Free AI Tools (2025)</h3><p className='text-muted'>Top free apps.</p><span className='text-brand font-semibold'>Read →</span></a>
        <a className='card' href='/blog/chatgpt-prompts-hr-interviews'><h3 className='font-semibold'>25 HR Prompts</h3><p className='text-muted'>Copy‑paste and practice.</p><span className='text-brand font-semibold'>Read →</span></a>
        <a className='card' href='/blog/speech-to-text-apps-india'><h3 className='font-semibold'>STT Apps in India</h3><p className='text-muted'>Our hands‑on review.</p><span className='text-brand font-semibold'>Read →</span></a>
      </div>
    </section>
    <section className='container-p py-12 text-center'>
      <div className='card inline-block text-left'>
        <h3 className='text-xl font-semibold mb-2'>Get the weekly SpeakAI newsletter</h3>
        <p className='text-muted'>One high‑value email. Prompts, scripts, and tool picks.</p>
        <form name='subscribe' method='POST' data-netlify='true' className='mt-3 flex flex-col sm:flex-row gap-2'>
          <input className='input' type='email' name='email' placeholder='you@example.com' required />
          <button className='btn btn-primary' type='submit'>Subscribe</button>
        </form>
      </div>
    </section>
  </main>)}
