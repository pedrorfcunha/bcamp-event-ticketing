import './App.css';
import Banner from './components/Banner';
import Card from './components/Card';
import Navbar from './components/Navbar';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/all';

function App() {
  return (
    <div className="">
      <section className="bannerBg border-b-[1px] border-gray-700">
        <Navbar />
        <Banner />
      </section>

      <section className="container mx-auto py-20">
        <h3 className="hagrid text-white text-2xl">UPCOMING EVENTS 💫</h3>
        <p className="text-white mt-3">
          keepup with event happening closee to you...
        </p>
        <section className="grid grid-cols-5 gap-4 mt-5">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </section>
      </section>
    </div>
  );
}

export default App;
