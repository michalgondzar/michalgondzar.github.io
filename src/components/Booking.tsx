
import BookingForm from "@/components/booking/BookingForm";
import PricingCard from "@/components/booking/PricingCard";

const Booking = () => {
  return (
    <section id="rezervacia" className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Rezervácia a cenník
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vytvorte si nezáväznú rezerváciu alebo si pozrite aktuálne ceny pre váš pobyt
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <BookingForm />
          <PricingCard />
        </div>
      </div>
    </section>
  );
};

export default Booking;
