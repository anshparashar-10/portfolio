import Starfield from './components/Starfield'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/sections/Hero'
import Journey from './components/sections/Journey'
import Marquee from './components/sections/Marquee'
import TechStack from './components/sections/TechStack'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'

export default function App() {
  return (
    <>
      <Starfield />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <Marquee />
        <TechStack />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
