import React from 'react'
import { useState } from 'react'

const AddVenue = () => {

  const [image, setImage] = useState(null);
  const [venue, setVenue] = useState({
    name: "",
    category: "",
    pricePerHour: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  });


  return (
    <div className='px-4 py-10 md:px-1- flex-1'>

      <h1 className='text-2xl font-semibold mb-1'>Add New Venue</h1>
      <p className='text-gray-500 mb-6'>
        Fill in details to list a new venue for booking, including pricing, availability, and venue specifications.
      </p>

      <form

      className='flex flex-col gap-6 text-gray-600 text-sm max-w-xl'
      >

        <div className='flex items-center gap-3'>
          <label htmlFor="venue-image" className='cursor-pointer'>
            <div className='h-20 w-20 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center'>
                {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Venue Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">Upload</span>
              )}
            </div>
            <input
              type="file"
              id="venue-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>
        <p className='text-sm text-gray-500'>Upload a picture of your venue</p>

        {/* venue name and category  */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

          <div>
          <label className='text-sm'>Venue Name</label>
          <input className='w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none'
          type="text"
          placeholder='e.g. Velocity Futsal'
          />
          </div>

          <div>
            <label className="text-sm">Category</label>
            <select className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none">
              <option>Select a category</option>
              <option>Futsal</option>
              <option>Cricket</option>
              <option>BasketBall</option>
              <option>Table Tennis</option>
            </select>
          </div>
        </div>

        {/* price and date */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='text-sm'>Price per Hour</label>
            <input className='w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none'
            type="text"
            placeholder='Rs 1500 / hr'
            />
          </div>

          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
            />
          </div>


          <div>
            <label className='text-sm'>Start Time</label>
            <input className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"  type="time" />

          </div>

          <div>
            <label className='text-sm'>End Time</label>
            <input className='w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none' type="time" />
          </div>

        </div>

        {/* location                  */}
        <div>
          <label className="text-sm">Location</label>
          <input
            type="text"
            placeholder="e.g. Shantinagar, Kathmandu"
            className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
          />
        </div>



        {/* description about the venue  */}

        <div>
          <label className='text-sm'>Description</label>
          <textarea rows="4" placeholder='e.g. Great futsal.'
          className='w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none resize-none'
          >

          </textarea>
        </div>

        {/* Button */}
        <button
          type="button"
          className="bg-gray-300 px-6 py-2 rounded-md font-medium hover:bg-gray-400"
        >
          Add Venue
        </button>



      </form>
    </div>
  )
}

export default AddVenue