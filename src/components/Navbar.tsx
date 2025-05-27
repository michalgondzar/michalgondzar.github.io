
import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Opis", to: "opis" },
  { name: "Galéria", to: "galeria" },
  { name: "Rezervácia", to: "rezervacia" },
  { name: "Kontakt", to: "kontakt" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-booking-primary">
          Apartmán Tília
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className="text-booking-darkGray hover:text-booking-primary cursor-pointer font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Button className="bg-booking-primary hover:bg-booking-secondary">
            <Link to="rezervacia" spy={true} smooth={true} offset={-100} duration={500}>
              Rezervovať
            </Link>
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                  className="text-lg text-booking-darkGray hover:text-booking-primary cursor-pointer transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
              <Button className="w-full bg-booking-primary hover:bg-booking-secondary mt-4">
                <Link to="rezervacia" spy={true} smooth={true} offset={-100} duration={500} className="w-full">
                  Rezervovať
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
