import React, { useEffect, useState } from "react";

const TestimonialCard = ({ image, alt, name, role, review, index }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="group w-full flex flex-col items-center border border-gray-300 dark:border-gray-700 p-6 md:p-10 rounded-lg bg-white dark:bg-gray-800
        transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 150}ms, transform 0.5s ease ${index * 150}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      <img
        className="h-20 w-20 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md"
        src={image}
        alt={alt}
      />
      <h2 className="text-lg font-medium mt-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
        {name}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">{role}</p>

      <div className="flex items-center justify-center mt-3 gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-110"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <path
              d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
              fill="#FF532E"
            />
          </svg>
        ))}
      </div>

      <p className="text-center text-sm md:text-[15px] mt-3 text-gray-500 dark:text-gray-300">
        {review}
      </p>
    </div>
  );
};

const Testimonial = () => {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      alt: "userImage1",
      name: "Ankush Sharma",
      role: "Footballer",
      review: `"I've been booking this venue for football for nearly two years, and the pitch quality and management have consistently made our games easier and better."`,
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      alt: "userImage2",
      name: "Swayam Shrestha",
      role: "Cricketer",
      review: `"I've been playing cricket here for almost two years, and the ground conditions are always excellent, making every match smooth and enjoyable."`,
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      alt: "userImage3",
      name: "Sagal Chand",
      role: "Basketball Player",
      review: `"I've been using this court for basketball for almost two years, and the smooth playing surface and great environment make every session enjoyable."`,
    },
  ];

  return (
    <div className="px-4 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
