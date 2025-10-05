export interface Vehicle {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  rating: number;
  image: string;
  seats: number;
  transmission: string;
  fuelType: string;
  mileage: string;
  minimumHirePeriod: string;
  engine: string;
  enginePower: string;
  engineTorque: string;
  fuelEconomy: {
    city: string;
    highway: string;
  };
  available: boolean;
  features?: string[];
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface DamageReport {
  id: string;
  bookingId: string;
  vehicleName: string;
  description: string;
  dateReported: string;
  status: 'pending' | 'reviewed' | 'resolved';
  images?: string[];
}
