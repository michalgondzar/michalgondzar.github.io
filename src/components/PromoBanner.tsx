import { Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const PromoBanner = () => {
  return <section className="py-4 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="container mx-auto px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 max-w-4xl mx-auto">
          <CardContent className="p-4 md:p-6 bg-green-300">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Tag className="h-5 w-5 text-blue-600" />
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  LETNÁ AKCIA
                </span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Týždenný pobyt len za <span className="text-blue-600">399,- EUR</span>
              </h2>
              
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Stačí ak pri rezervácií zadáte kód <span className="font-bold text-blue-600">ZLAVALETO25</span> a zarezervujete si týždenný pobyt.
              </p>
              
              <div className="text-sm text-gray-500 pt-2">
                ⏰ Akcia platí do konca augusta 2025
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default PromoBanner;