import React from 'react'
import Hero from '../components/Hero'
import VenueCard from '../components/VenueCard'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'


const Home = () => {
  return (
    <div>
      <Hero />
      <VenueCard />
      <Testimonial />
      <Newsletter />
      <Footer />


    </div>
  )
}

export default Home