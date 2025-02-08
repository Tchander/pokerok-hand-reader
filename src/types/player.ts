import type { SixMaxPositions } from '@/enums/positions';
import type { StartHand } from './hand';

export type PlayerId = string;

export type Player = {
  id: PlayerId;
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

