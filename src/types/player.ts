import type { TableType } from '@/enums/pokerType';
import type { SixMaxPositions } from '@/enums/positions';
import type { StartHand } from './hand';

export type Player = {
  id: string;
  tableType: TableType;
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
