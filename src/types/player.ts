import type { SixMaxPositions } from '@/enums/positions';
import type { StartHand } from './hand';

export type Player = {
  id: string;
  isHero: boolean;
  seatNumber: number;
  startStackInChips: number;
  startStackInBB: number;
  currentStackInChips: number;
  currentStackInBB: number;
  moneyInPotInChips: number;
  moneyInPotInBB: number;
  isPreFlopRaise: boolean;
  position?: SixMaxPositions;
  hand?: StartHand;
  straddle?: number,
}
