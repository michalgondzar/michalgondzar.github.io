
import { Tag, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-scroll";

const PromoBanner = () => {
  return (
    <section className="py-8 bg-gradient-to-r from-orange-500 to-red-500">
      <div className="container mx-auto px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Tag className="h-6 w-6 text-orange-600" />
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                  LETNÁ AKCIA
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Týždenný pobyt len za <span className="text-orange-600">399,- EUR</span>
              </h2>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stačí ak pri rezervácií zadáte kód <span className="font-bold text-orange-600">ZLAVALETO25</span> a zarezervujete si týždenný pobyt.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8"
                >
                  <Link to="rezervacia" spy={true} smooth={true} offset={-100} duration={500} className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Rezervovať teraz
                  </Link>
                </Button>
                
                <div className="text-sm text-gray-500">
                  ⏰ Akcia platí do konca augusta 2025
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PromoBanner;
