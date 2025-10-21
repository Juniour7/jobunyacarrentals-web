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
  id: number;
  user: number;
  vehicle: number;
  vehicle_name: string;
  vehicle_image: string;
  start_date: string;
  end_date: string;
  total_price: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  daily_rate: string;
  created_at: string;
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
