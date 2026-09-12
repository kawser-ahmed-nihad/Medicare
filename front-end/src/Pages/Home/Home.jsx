import React from 'react'
import Hero from '../../Components/Hero'
import OurServices from '../../Components/OurServices'
import OurImpact from '../../Components/OurImpact'
import Testimonials from '../../Components/Testimonials'
import HealthNews from '../../Components/HealthNews'

const Home = () => {
  return (
    <div className=''>
      <Hero />
      <OurServices />
      <OurImpact />
      <Testimonials />
      <HealthNews />
    </div>
  )
}

export default Home