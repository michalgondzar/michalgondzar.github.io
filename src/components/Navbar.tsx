
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo white={!isScrolled} />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("ubytovanie")}
              className={`transition-colors hover:text-booking-primary ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {t('nav.accommodation')}
            </button>
            <button 
              onClick={() => scrollToSection("galeria")}
              className={`transition-colors hover:text-booking-primary ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {t('nav.gallery')}
            </button>
            <button 
              onClick={() => scrollToSection("rezervacia")}
              className={`transition-colors hover:text-booking-primary ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {t('nav.booking')}
            </button>
            <button 
              onClick={() => scrollToSection("kontakt")}
              className={`transition-colors hover:text-booking-primary ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {t('nav.contact')}
            </button>
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("ubytovanie")}
                className="block px-3 py-2 text-gray-700 hover:text-booking-primary w-full text-left"
              >
                {t('nav.accommodation')}
              </button>
              <button
                onClick={() => scrollToSection("galeria")}
                className="block px-3 py-2 text-gray-700 hover:text-booking-primary w-full text-left"
              >
                {t('nav.gallery')}
              </button>
              <button
                onClick={() => scrollToSection("rezervacia")}
                className="block px-3 py-2 text-gray-700 hover:text-booking-primary w-full text-left"
              >
                {t('nav.booking')}
              </button>
              <button
                onClick={() => scrollToSection("kontakt")}
                className="block px-3 py-2 text-gray-700 hover:text-booking-primary w-full text-left"
              >
                {t('nav.contact')}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
