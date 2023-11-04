import React from 'react';
import './App.css';
import Banner from './components/Banner';
import Card from './components/Card';
import Navbar from './components/Navbar';
import { musicalEvents } from './mockdata';

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
          keep up with events happening close to you...
        </p>
        <section className="grid grid-cols-4 gap-4 mt-5">
          {musicalEvents.map(
            ({
              id,
              eventName,
              eventLocation,
              eventDate,
              pricing,
              path,
              eventDescription,
              helpLine,
            }) => (
              <Card
                id={id}
                eventName={eventName}
                path={path}
                eventLocation={eventLocation}
                eventDate={eventDate}
                pricing={pricing}
                eventDescription={eventDescription}
                helpLine={helpLine}
              />
            )
          )}
        </section>
      </section>
    </div>
  );
}

export default App;
