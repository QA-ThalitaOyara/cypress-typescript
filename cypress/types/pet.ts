export interface PetBody {
  id?: number;
  category?: {
    id: number;
    name: string;
  };
  name: string;
  photoUrls: string[];
  tags?: Array<{
    id: number;
    name: string;
  }>;
  status: "available" | "pending" | "sold";
}