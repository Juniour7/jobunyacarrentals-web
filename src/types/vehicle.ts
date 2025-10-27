export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  pricePerDay: number;
  rating: number;
  image: string;
  images?: { id: number; image: string }[]; 
  seats: number;
  status: 'Available' | 'Booked';
  description: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  min_days: number | null;
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

export interface UserInfo {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  license_number: string;
}

export interface Booking {
  id: number;
  user: number;
  user_info: UserInfo; 
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
