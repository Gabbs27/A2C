import React from 'react'
import Hero from '../components/Hero'
import Welcome from '../components/Welcome'
import FeaturedVehicles from '../components/FeaturedVehicles'
import Services from '../components/Services'
import Features from '../components/Features'
import Contact from '../components/Contact'

const HomePage = () => {
  return (
    <>
      <Hero />
      <Welcome />
      <FeaturedVehicles />
      <Services />
      <Features />
      <Contact />
    </>
  )
}

export default HomePage
