
import { Logo } from "./Logo";
import { Link } from "react-scroll";
import { Button } from "./ui/button"; 
import { useNavigate } from "react-router-dom";
import { useContact } from "@/contexts/ContactContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { contactData } = useContact();
  
  const handleAdminEntry = () => {
    navigate("/admin");
  };
  
  return (
    <footer className="bg-booking-darkGray text-white pt-12 pb-6 relative">
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
              <p>{contactData.address}</p>
              <p>{contactData.postalCode}</p>
              <p>{contactData.phone}</p>
              <p>{contactData.email}</p>
            </address>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Platobné možnosti</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/10 px-3 py-2 rounded text-sm">Hotovosť</div>
              <div className="bg-white/10 px-3 py-2 rounded text-sm">Bankový prevod</div>
            </div>
          </div>
        </div>
        
        <hr className="my-8 border-white/10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} Apartmán Tília. Všetky práva vyhradené.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-4 md:mt-0 bg-transparent border-white/30 text-white hover:bg-white/10"
            onClick={handleAdminEntry}
          >
            Vstup pre admina
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
