
export const Logo = ({ white = false }: { white?: boolean }) => {
  return (
    <div className="flex items-center">
      <span className={`text-2xl font-bold ${white ? 'text-white' : 'text-booking-primary'}`}>
        Apartmán Tília
      </span>
    </div>
  );
};
