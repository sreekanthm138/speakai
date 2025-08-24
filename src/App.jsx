import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import Post from './pages/Post.jsx'
import FreePrompts from './pages/FreePrompts.jsx'
import ThankYou from './pages/ThankYou.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Services from './pages/Services.jsx'
import Resources from './pages/Resources.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Affiliate from './pages/Affiliate.jsx'
import NotFound from './pages/NotFound.jsx'
import Coach from './pages/Coach.jsx'

export default function App(){
  return (<div>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/blog' element={<Blog/>}/>
      <Route path="/coach" element={<Coach />} />
      <Route path='/blog/:slug' element={<Post/>}/>
      <Route path='/free-prompts' element={<FreePrompts/>}/>
      <Route path='/thank-you' element={<ThankYou/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/services' element={<Services/>}/>
      <Route path='/resources' element={<Resources/>}/>
      <Route path='/privacy' element={<Privacy/>}/>
      <Route path='/terms' element={<Terms/>}/>
      <Route path='/affiliate-disclosure' element={<Affiliate/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    <Footer/>
    <a className='fixed right-4 bottom-4 bg-green-500 text-black font-semibold px-4 py-2 rounded-full shadow-soft' href='https://wa.me/919110733750' target='_blank' rel='noreferrer'>WhatsApp</a>
  </div>)
}
