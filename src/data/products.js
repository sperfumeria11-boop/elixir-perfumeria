import lacostYellow from '../assets/Lacoste_yellow.png';

export const categories = [
  { id: 'dama', name: 'Dama', icon: '🌸', includes: ['dama', 'unisex'] },
  { id: 'caballero', name: 'Caballero', icon: '🖤', includes: ['caballero', 'unisex'] },
  { id: 'arabes_dama', name: 'Árabes Dama', icon: '🌙', includes: ['arabes_dama', 'arabes_unisex'] },
  { id: 'arabes_caballero', name: 'Árabes Caballero', icon: '🌙', includes: ['arabes_caballero', 'arabes_unisex'] },
];

export const specialFilters = [
  { id: 'destacados', name: 'Destacados', icon: '⭐' },
  { id: 'mas_vendidos', name: 'Más vendidos', icon: '🔥' },
  { id: 'ofertas', name: 'Ofertas', icon: '🏷️' },
];

export const products = [
  {
    id: 1,
    name: 'Eau de Lacoste L.12.12 Yellow',
    category: 'caballero',
    price: 175000,
    image: lacostYellow,
    description: 'Una fragancia masculina fresca y energizante que combina cítricos vibrantes con especias y maderas.',
    family: 'Cítrica Aromática',
    duration: '6 - 8 horas',
    intensity: 'Media',
    occasion: 'Día / Primavera-Verano',
    notes: {
      salida: ['Pomelo', 'Hojas de violeta', 'Hinojo'],
      corazon: ['Jazmín', 'Ylang-Ylang', 'Jengibre'],
      fondo: ['Madera de guayaco', 'Musgo de roble', 'Haba tonka'],
    },
  },
];