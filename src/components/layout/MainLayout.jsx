import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = () => {
  return (
    <div className="md-page flex min-h-screen flex-col font-roboto">
      <div className="md-content-layer flex min-h-screen flex-col">
      <Navbar />
      
      {/* flex-grow ensures the main content stretches to fill the screen, 
        pushing the footer to the bottom even if the page is empty! 
      */}
      <main className="w-full flex-grow">
        <Outlet />
      </main>

      <Footer />
      </div>
    </div>
  );
};