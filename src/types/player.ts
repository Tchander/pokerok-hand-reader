import type { SixMaxPositions } from '@/enums/positions';
import type { StartHand } from './hand';

export type PlayerId = string;

export type Player = {
  id: PlayerId;
  isHero: boolean;
  seatNumber: number;
  startStackInChips: number;
  currentStackInChips: number;
  moneyInPotInChips: number;
  position?: SixMaxPositions;
  hand?: StartHand;
  straddle?: number,
}

