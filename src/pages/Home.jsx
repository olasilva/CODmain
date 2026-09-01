import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import WhyUs from '../components/WhyUs'
import AboutSection from '../components/AboutSection'
import StatsBar from '../components/StatsBar'
import Programmes from '../components/Programmes'
import ApplyAdmission from '../components/ApplyAdmission'
import BlogNews from '../components/BlogNews'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyUs />
      <AboutSection />
      <StatsBar />
      <Programmes />
      <ApplyAdmission />
      <BlogNews />
      <Footer />
    </>
  )
}
