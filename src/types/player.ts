import type { SixMaxPositions } from '@/enums/positions';
import type { StartHand } from './hand';

export type Player = {
  id: string;
  seatNumber: number;
  startStackInChips: number;
  startStackInBB: number;
  currentStackInChips: number;
  currentStackInBB: number;
  position: SixMaxPositions;
  moneyInPotInChips: number;
  moneyInPotInBB: number;
  isPreFlopRaise: boolean;
  hand?: StartHand;
  straddle?: number,
}
