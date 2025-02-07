import { useCountersStore } from '@/stores/counters';
import { KEY_WORDS } from '@/enums/parser';
import { getArrayFromString, startsWith } from '@/utils';
import { getBlinds, getTableTypeAndButtonSeat } from '@/utils/parser';
import type { Blinds, PokerHand } from '@/types';
import type { TableType } from '@/enums/pokerType';

const defaultPokerHand: PokerHand = {
  sizeOfSB: 0,
  sizeOfBB: 0,
  tableType: null,
  buttonSeat: null,
  players: [],
  maxNumberOfPlayers: 0,
  currentNumberOfPlayers: 0,
  potInChips: 0,
  potInBB: 0,
  preFlopActions: [],
  flopActions: [],
  turnActions: [],
  riverActions: [],
  boardCards: [null, null, null, null, null],
};

export function resetPokerHand() {
  return structuredClone(defaultPokerHand);
}

export function setBlinds(hand: PokerHand, blinds: Blinds) {
  hand.sizeOfSB = blinds.sb;
  hand.sizeOfBB = blinds.bb;
}

export function setTableType(hand: PokerHand, tableType: TableType) {
  hand.tableType = tableType;
}

export function setButtonSeat(hand: PokerHand, buttonSeat: number) {
  hand.buttonSeat = buttonSeat;
}

export async function handHandler(hand: string[]) {
  console.log(hand);
  const pokerHand = resetPokerHand();

  const countersStore = useCountersStore();

  for (const str of hand) {
    if (startsWith(str, KEY_WORDS.POKER_HAND)) {
      const blinds = getBlinds(getArrayFromString(str, ' '));

      setBlinds(pokerHand, blinds);
      continue;
    }

    if (startsWith(str, KEY_WORDS.TABLE)) {
      const tempArray = getArrayFromString(str, ' ');
      const { tableType, buttonSeat } = getTableTypeAndButtonSeat(tempArray);

      setTableType(pokerHand, tableType);
      setButtonSeat(pokerHand, buttonSeat);
    }
  }
}
