import React from 'react'
import Hero from '../components/Hero'
import VenueCard from '../components/VenueCard'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import TrainerCard from '../components/TrainerCard'


const Home = () => {
  return (
    <div>
      <Hero />
      <VenueCard />
      <TrainerCard />
      <Testimonial />
      <Newsletter />
      <Footer />



    </div>
  )
}

export default Home