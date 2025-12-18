import { motion } from 'framer-motion'
import './Navigation.css'

interface NavigationProps {
  activeSection: string
}

const Navigation = ({ activeSection }: NavigationProps) => {
  const navItems = [
    { id: 'hero', label: 'INTRO' },
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'profile', label: 'PROFILE' },
    { id: 'how-i-work', label: 'HOW I WORK' },
    { id: 'contact', label: 'CONTACT' },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    const mainContent = document.querySelector('.main-content')
    if (element && mainContent) {
      const elementLeft = element.offsetLeft
      
      // 가로 스크롤 이동
      mainContent.scrollTo({
        left: elementLeft,
        behavior: 'smooth'
      })
      
      // 세로 스크롤 최상단으로 이동
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.nav
      className="navigation"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="nav-logo" onClick={() => scrollToSection('hero')}>
          rjsgud49
        </div>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}

export default Navigation
