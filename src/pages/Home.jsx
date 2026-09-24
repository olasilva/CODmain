// src/pages/Home.jsx
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import AboutSection from '../components/AboutSection';
import StatsBar from '../components/StatsBar';
import Programmes from '../components/Programmes';
import ApplyAdmission from '../components/ApplyAdmission';
import BlogNews from '../components/BlogNews';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero — has its own on-load animation, no wrapper needed */}
      <Hero />

      {/* Everything below scroll-reveals as you scroll down */}
      <Reveal variant="fade-up" threshold={0.1}>
        <WhyUs />
      </Reveal>

      <Reveal variant="fade-up" threshold={0.1}>
        <AboutSection />
      </Reveal>

      <Reveal variant="zoom-in" threshold={0.1}>
        <StatsBar />
      </Reveal>

      <Reveal variant="fade-up" threshold={0.1}>
        <Programmes />
      </Reveal>

      <Reveal variant="fade-up" threshold={0.1}>
        <ApplyAdmission />
      </Reveal>

      <Reveal variant="fade-up" threshold={0.1}>
        <BlogNews />
      </Reveal>

      <Footer />
    </>
  );
}