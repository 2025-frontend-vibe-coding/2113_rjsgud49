import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Profile from './components/Profile'
import HowIWork from './components/HowIWork'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const mainContent = document.querySelector('.main-content')
    if (!mainContent) return

    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'profile', 'how-i-work', 'contact']
      const scrollLeft = mainContent.scrollLeft
      const containerWidth = mainContent.clientWidth

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetLeft, offsetWidth } = element
          // 현재 보이는 섹션 확인
          if (scrollLeft >= offsetLeft - containerWidth / 2 && scrollLeft < offsetLeft + offsetWidth - containerWidth / 2) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    mainContent.addEventListener('scroll', handleScroll)
    return () => mainContent.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      <Navigation activeSection={activeSection} />
      <div className="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Profile />
        <HowIWork />
        <Contact />
      </div>
    </div>
  )
}

export default App
