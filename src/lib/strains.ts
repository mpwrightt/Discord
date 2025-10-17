import { Strain } from '../types/index.js';

export const STRAINS: Strain[] = [
  // COMMON STRAINS (Level 1+, 5-7 days)
  {
    name: 'Northern Lights',
    type: 'indica',
    rarity: 'common',
    growTime: 5,
    minYield: 40,
    maxYield: 60,
    difficulty: 'easy',
    thc: '16-20%',
    cbd: '<1%',
    unlockLevel: 1,
    description: 'Classic indica, easy to grow, perfect for beginners'
  },
  {
    name: 'Early Skunk',
    type: 'hybrid',
    rarity: 'common',
    growTime: 5,
    minYield: 35,
    maxYield: 55,
    difficulty: 'easy',
    thc: '14-18%',
    cbd: '<1%',
    unlockLevel: 1,
    description: 'Fast-growing hybrid, very forgiving'
  },
  {
    name: 'White Widow',
    type: 'hybrid',
    rarity: 'common',
    growTime: 7,
    minYield: 50,
    maxYield: 70,
    difficulty: 'easy',
    thc: '18-22%',
    cbd: '<1%',
    unlockLevel: 1,
    description: 'Legendary hybrid, reliable and potent'
  },
  {
    name: 'AK-47',
    type: 'sativa',
    rarity: 'common',
    growTime: 7,
    minYield: 45,
    maxYield: 65,
    difficulty: 'medium',
    thc: '19-23%',
    cbd: '<1%',
    unlockLevel: 1,
    description: 'Award-winning sativa with energizing effects'
  },

  // UNCOMMON STRAINS (Level 5+, 7 days)
  {
    name: 'Blue Dream',
    type: 'hybrid',
    rarity: 'uncommon',
    growTime: 7,
    minYield: 60,
    maxYield: 90,
    difficulty: 'medium',
    thc: '18-24%',
    cbd: '<1%',
    unlockLevel: 5,
    description: 'Popular hybrid, balanced effects'
  },
  {
    name: 'OG Kush',
    type: 'hybrid',
    rarity: 'uncommon',
    growTime: 7,
    minYield: 55,
    maxYield: 85,
    difficulty: 'medium',
    thc: '20-25%',
    cbd: '<1%',
    unlockLevel: 5,
    description: 'Legendary strain, complex flavor profile'
  },
  {
    name: 'Sour Diesel',
    type: 'sativa',
    rarity: 'uncommon',
    growTime: 7,
    minYield: 50,
    maxYield: 80,
    difficulty: 'medium',
    thc: '20-24%',
    cbd: '<1%',
    unlockLevel: 5,
    description: 'Energizing sativa with diesel aroma'
  },
  {
    name: 'Gorilla Glue #4',
    type: 'hybrid',
    rarity: 'uncommon',
    growTime: 7,
    minYield: 65,
    maxYield: 95,
    difficulty: 'medium',
    thc: '24-28%',
    cbd: '<1%',
    unlockLevel: 5,
    description: 'Potent hybrid, heavy-hitting effects'
  },

  // RARE STRAINS (Level 10+, 7-9 days)
  {
    name: 'Girl Scout Cookies',
    type: 'hybrid',
    rarity: 'rare',
    growTime: 9,
    minYield: 80,
    maxYield: 120,
    difficulty: 'hard',
    thc: '25-28%',
    cbd: '<1%',
    unlockLevel: 10,
    description: 'Premium hybrid with sweet, earthy flavor'
  },
  {
    name: 'Wedding Cake',
    type: 'indica',
    rarity: 'rare',
    growTime: 9,
    minYield: 90,
    maxYield: 130,
    difficulty: 'hard',
    thc: '25-29%',
    cbd: '<1%',
    unlockLevel: 10,
    description: 'Potent indica with vanilla frosting aroma'
  },
  {
    name: 'Gelato',
    type: 'hybrid',
    rarity: 'rare',
    growTime: 9,
    minYield: 75,
    maxYield: 115,
    difficulty: 'hard',
    thc: '23-27%',
    cbd: '<1%',
    unlockLevel: 10,
    description: 'Dessert strain with berry and citrus notes'
  },

  // EXOTIC STRAINS (Level 15+, 9 days)
  {
    name: 'Zkittlez',
    type: 'indica',
    rarity: 'exotic',
    growTime: 9,
    minYield: 85,
    maxYield: 125,
    difficulty: 'hard',
    thc: '18-24%',
    cbd: '<1%',
    unlockLevel: 15,
    description: 'Fruity indica with rainbow of flavors'
  },
  {
    name: 'Runtz',
    type: 'hybrid',
    rarity: 'exotic',
    growTime: 9,
    minYield: 95,
    maxYield: 135,
    difficulty: 'hard',
    thc: '24-29%',
    cbd: '<1%',
    unlockLevel: 15,
    description: 'Candy-flavored hybrid, extremely popular'
  },
  {
    name: 'Purple Punch',
    type: 'indica',
    rarity: 'exotic',
    growTime: 9,
    minYield: 80,
    maxYield: 120,
    difficulty: 'hard',
    thc: '20-25%',
    cbd: '<1%',
    unlockLevel: 15,
    description: 'Grape and blueberry indica, knockout effects'
  },

  // LEGENDARY STRAINS (Level 20, 9 days)
  {
    name: 'Mac 1',
    type: 'hybrid',
    rarity: 'legendary',
    growTime: 9,
    minYield: 100,
    maxYield: 150,
    difficulty: 'hard',
    thc: '28-32%',
    cbd: '<1%',
    unlockLevel: 20,
    description: 'Miracle Alien Cookies, legendary potency'
  },
  {
    name: 'Forbidden Fruit',
    type: 'indica',
    rarity: 'legendary',
    growTime: 9,
    minYield: 90,
    maxYield: 140,
    difficulty: 'hard',
    thc: '24-28%',
    cbd: '1-2%',
    unlockLevel: 20,
    description: 'Tropical indica with cherry undertones'
  },
  {
    name: 'Platinum Cookies',
    type: 'hybrid',
    rarity: 'legendary',
    growTime: 9,
    minYield: 110,
    maxYield: 160,
    difficulty: 'hard',
    thc: '26-30%',
    cbd: '<1%',
    unlockLevel: 20,
    description: 'Premium GSC phenotype, platinum-tier quality'
  }
];

export function getStrainByName(name: string): Strain | undefined {
  return STRAINS.find(s => s.name.toLowerCase() === name.toLowerCase());
}

export function getStrainsByRarity(rarity: Strain['rarity']): Strain[] {
  return STRAINS.filter(s => s.rarity === rarity);
}

export function getAvailableStrains(userLevel: number): Strain[] {
  return STRAINS.filter(s => s.unlockLevel <= userLevel);
}

export function calculateYield(
  strain: Strain,
  health: number,
  boosted: { nutrients: boolean; light: boolean; love: number }
): number {
  let baseYield = (strain.minYield + strain.maxYield) / 2;
  
  // Health affects yield (0-100%)
  baseYield *= (health / 100);
  
  // Boosts
  if (boosted.nutrients) baseYield *= 1.15;
  if (boosted.light) baseYield *= 1.05;
  if (boosted.love > 5) baseYield *= 1.05;
  
  // Add some randomness (±10%)
  const randomFactor = 0.9 + Math.random() * 0.2;
  baseYield *= randomFactor;
  
  return Math.round(baseYield);
}

export function getSeedCost(rarity: Strain['rarity']): number {
  const costs: Record<string, number> = {
    common: 50,
    uncommon: 100,
    rare: 250,
    epic: 500,
    legendary: 1000
  };
  return costs[rarity] || 50; // Default to 50 if rarity not found
}
