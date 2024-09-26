import React, { useEffect } from 'react';

function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="about-section px-6 py-10 md:px-16 lg:px-32 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6 text-center">About BlogNotes</h1>
      <h1 className="text-2xl font-bold mb-6 text-center ">
      <em >Notes from the Mind, Ideas for the Blog</em>
      </h1>

      <p className="mb-6">
        Welcome to <strong>BlogNotes</strong>, a digital space where thoughts, creativity, and innovation come to life. This blog is built on a passion for sharing ideas that inspire, inform, and ignite meaningful conversations. BlogNotes is more than just a collection of articles—it’s a platform for exploring diverse topics and deep reflections.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
      <p className="mb-6">
        At <strong>BlogNotes</strong>, we believe that knowledge is limitless, and curiosity is the spark that fuels progress. The blog is a reflection of this philosophy, aimed at sparking new ideas, connecting people with unique insights, and fostering a space where everyone can contribute to the growth of knowledge.
      </p>

      <h2 className="text-2xl font-semibold mb-4">What We Write About</h2>
      <p className="mb-4">
        Our blog covers a wide range of topics, catering to a curious and forward-thinking audience. Whether you're here for personal growth, tips on productivity, tech reviews, creative writing, or insights into culture and philosophy, BlogNotes offers something for everyone.
      </p>

      <ul className="list-disc list-inside mb-6 space-y-2">
        <li><strong>Technology & Innovation:</strong> Stay updated with the latest in the tech world, from software development tips to future trends.</li>
        <li><strong>Productivity & Personal Growth:</strong> Get actionable advice on how to enhance your productivity and work-life balance.</li>
        <li><strong>Creative Writing:</strong> Dive into stories, poems, and creative musings that stir the imagination.</li>
        <li><strong>Philosophy & Reflection:</strong> Explore deep thoughts and philosophical discussions that challenge conventional thinking.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Why BlogNotes?</h2>
      <p className="mb-6">
        The internet is filled with content, but at <strong>BlogNotes</strong>, we aim to stand out by offering fresh perspectives, insightful analysis, and quality over quantity. Each post is crafted to deliver meaningful value, leaving you with something to ponder long after you've finished reading. Our mission is to inspire curiosity and encourage lifelong learning.
      </p>

      <h2 className="text-2xl font-semibold mb-4">A Community of Thinkers</h2>
      <p className="mb-6">
        At its core, <strong>BlogNotes</strong> is driven by the contributions and engagement of our readers. Whether you’re someone who loves to consume knowledge or share it, we want to hear from you. Through thoughtful comments, guest posts, and engaging discussions, BlogNotes is as much yours as it is ours.
      </p>

      <p className="mb-6">
        We believe in building a community of thinkers, dreamers, and doers who want to make the world a better, more informed place. Your voice is important to us, and we encourage you to join the conversation.
      </p>

      
      <h2 className="text-2xl font-semibold mb-4">Join the Journey</h2>
      <p className="mb-6">
        We invite you to join us on this journey of discovery and exploration. Subscribe to our blog, comment on the posts, and become part of the <strong>BlogNotes</strong> community. Together, we can make this space a hub for creativity, innovation, and thoughtful dialogue.
      </p>

      <p className="text-lg font-medium">Thank you for being here. Let’s create, learn, and grow together!</p>
      <h3 className="text-xl font-semibold mt-6">Welcome to BlogNotes!</h3>
    </div>
  );
}

export default About;
