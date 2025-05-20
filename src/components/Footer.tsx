
import { Logo } from "./Logo";
import { Link } from "react-scroll";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-booking-darkGray text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Logo white />
            <p className="mt-4 text-gray-300">
              Komfortné ubytovanie v blízkosti aquaparku Bešeňová pre váš dokonalý oddych.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigácia</h3>
            <ul className="space-y-2">
              {["opis", "galeria", "rezervacia", "kontakt"].map((item) => (
                <li key={item}>
                  <Link
                    to={item}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="text-gray-300 hover:text-booking-primary cursor-pointer transition-colors"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Bešeňová 123</p>
              <p>034 83 Bešeňová</p>
              <p>+421 900 123 456</p>
              <p>info@trivily.sk</p>
            </address>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Platobné možnosti</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/10 px-3 py-2 rounded text-sm">Hotovosť</div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm">Bankový prevod</div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm">Platobná karta</div>
            </div>
          </div>
        </div>
        
        <hr className="my-8 border-white/10" />
        
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Apartmán Tri víly. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
