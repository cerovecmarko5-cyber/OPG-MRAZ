export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  unit?: string;
  comingSoon?: boolean;
}