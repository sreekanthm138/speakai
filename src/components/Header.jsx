import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const link = (to, text) => (
    <NavLink
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg ${isActive ? 'underline text-brand' : ''}`
      }
      to={to}
    >
      {text}
    </NavLink>
  )

  return (
    <header
      className={`sticky top-0 z-50 glass transition ${
        scrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.35)]' : ''
      }`}
    >
      <div className="container-p flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <img src="/logo.svg" className="w-7 h-7" alt="SpeakAI" />
          <span>SpeakAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {link('/', 'Home')}
          {link('/blog', 'Blog')}
          {link('/free-prompts', 'Free Prompts')}
          {link('/services', 'Services')}
          {link('/resources', 'Resources')}
          {link('/about', 'About')}
          {link('/contact', 'Contact')}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <a className="btn btn-primary" href="/free-prompts">
            🎁 Get PDF
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden px-3 py-2 border border-border rounded-xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden container-p pb-3 space-y-1">
          <div className="flex flex-col">
            {link('/', 'Home')}
            {link('/blog', 'Blog')}
            {link('/free-prompts', 'Free Prompts')}
            {link('/services', 'Services')}
            {link('/resources', 'Resources')}
            {link('/about', 'About')}
            {link('/contact', 'Contact')}
          </div>
        </div>
      )}
    </header>
  )
}
