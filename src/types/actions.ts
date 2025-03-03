import type { StartHand } from './hand';
import type { PlayerAction } from '@/enums/actions';

export type Action = {
  id: string;
  action: PlayerAction;
  amount?: number;
  cards?: StartHand;
};
