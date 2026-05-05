import { Product } from '../lib/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Jabuke',
    description: 'Svježe jabuke iz našeg voćnjaka.',
    price: 5.00,
    image: '/images/apples.jpg',
    category: 'Voće',
  },
  {
    id: '2',
    name: 'Kruške',
    description: 'Slatke kruške domaćeg uzgoja.',
    price: 6.00,
    image: '/images/pears.jpg',
    category: 'Voće',
  },
  {
    id: '3',
    name: 'Krumpir',
    description: 'Organski krumpir.',
    price: 3.50,
    image: '/images/potatoes.jpg',
    category: 'Povrće',
  },
  {
    id: '4',
    name: 'Rajčica',
    description: 'Zrela rajčica iz plastenika.',
    price: 4.00,
    image: '/images/tomatoes.jpg',
    category: 'Povrće',
  },
  {
    id: '5',
    name: 'Med',
    description: 'Prirodni med od lokalnih pčela.',
    price: 15.00,
    image: '/images/honey.jpg',
    category: 'Ostalo',
  },
];