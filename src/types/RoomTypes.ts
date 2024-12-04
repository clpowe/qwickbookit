import { type Models } from "node-appwrite";

export interface Room extends Models.Document {
  user_id: string;
  name: string;
  description: string;
  address: string;
  location?: string;
  availability: string;
  sqft?: string;
  capacity?: string;
  price_per_hour: string;
  amenities: string;
  image: string;
}
