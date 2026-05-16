import React from 'react'
import Hero from '../components/Hero'
import VenueCard from '../components/VenueCard'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import TrainerCard from '../components/TrainerCard'

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
