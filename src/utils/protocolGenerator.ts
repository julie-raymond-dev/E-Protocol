import { DayProtocol } from '../types';
import { PLATS, PLAT_NAMES, ACTIVITES, PETIT_DEJEUNER, COLLATIONS, CLEAR_WHEY, COMPLEMENTS } from '../data/protocol';

/**
 * Generates a complete daily protocol with meals, supplements, and activity
 * @param {Date} date - The date to generate the protocol for
 * @param {object} customMeals - Optional custom meal selections
 * @param {string} customActivity - Optional custom activity selection
 * @returns {DayProtocol} Complete protocol for the specified date
 */
export function generateDayProtocol(date: Date, customMeals?: { dejeuner?: string; diner?: string; colation?: string }, customActivity?: string): DayProtocol {
  const startDate = new Date(2025, 8, 1);
  const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const defaultDejeunerKey = PLAT_NAMES[Math.abs(daysDiff * 2) % PLAT_NAMES.length];
  const defaultDinerKey = PLAT_NAMES[Math.abs(daysDiff * 2 + 1) % PLAT_NAMES.length];
  
  const dejeunerKey = customMeals?.dejeuner || defaultDejeunerKey;
  const dinerKey = customMeals?.diner || defaultDinerKey;
  const colationKey = customMeals?.colation || 'Fruit + amandes';
  
  const dejeunerPlat = PLATS[dejeunerKey];
  const dinerPlat = PLATS[dinerKey];
  const colationPlat = COLLATIONS[colationKey];
  
  const sport = customActivity || ACTIVITES[Math.abs(daysDiff) % ACTIVITES.length];
  
  const totals = {
    kcal: PETIT_DEJEUNER.kcal + dejeunerPlat.kcal + dinerPlat.kcal + colationPlat.kcal + CLEAR_WHEY.kcal,
    P: PETIT_DEJEUNER.P + dejeunerPlat.P + dinerPlat.P + colationPlat.P + CLEAR_WHEY.P,
    L: PETIT_DEJEUNER.L + dejeunerPlat.L + dinerPlat.L + colationPlat.L + CLEAR_WHEY.L,
    G: PETIT_DEJEUNER.G + dejeunerPlat.G + dinerPlat.G + colationPlat.G + CLEAR_WHEY.G
  };
  
  return {
    date: date.toISOString().split('T')[0],
    petitDejeuner: PETIT_DEJEUNER,
    dejeuner: dejeunerPlat,
    diner: dinerPlat,
    colation: colationPlat,
    clearWhey: CLEAR_WHEY,
    sport,
    complements: COMPLEMENTS,
    totals
  };
}