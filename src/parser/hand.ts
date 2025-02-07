import { setBlinds, setButtonSeat, setMaxNumberOfPlayers, setTableType } from './setParams';
import { KEY_WORDS } from '@/enums/parser';
import { getArrayFromString, startsWith } from '@/utils';
import { getBlinds, getPlayersInfo, getTableTypeAndButtonSeat, setInitPot } from '@/utils/parser';
import type { PokerHand } from '@/types';

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

export async function handHandler(hand: string[]) {
  const pokerHand = resetPokerHand();

  for (const str of hand) {
    if (startsWith(str, KEY_WORDS.POKER_HAND)) {
      const blinds = getBlinds(getArrayFromString(str, ' '));

      setBlinds(pokerHand, blinds);
      continue;
    }

    if (startsWith(str, KEY_WORDS.TABLE)) {
      const { tableType, buttonSeat } = getTableTypeAndButtonSeat(str);

      setTableType(pokerHand, tableType);
      setButtonSeat(pokerHand, buttonSeat);
      setMaxNumberOfPlayers(pokerHand, tableType);
    }

    /* *** Set players data *** */
    if (startsWith(str, KEY_WORDS.SEAT) && str.includes(KEY_WORDS.IN_CHIPS)) {
      const player = getPlayersInfo(str, pokerHand.buttonSeat, pokerHand.sizeOfBB);
      pokerHand.players.push(player);
    }

    if (str.includes(KEY_WORDS.POSTS_SMALL_BLIND)) {
      const player = setInitPot(str, pokerHand);

      if (player) {
        pokerHand.potInChips += pokerHand.sizeOfSB;
        pokerHand.potInBB += pokerHand.sizeOfSB / pokerHand.sizeOfBB;

        player.moneyInPotInChips += pokerHand.sizeOfSB;
        player.moneyInPotInBB += pokerHand.sizeOfSB / pokerHand.sizeOfBB;
      }
    }

    if (str.includes(KEY_WORDS.POSTS_BIG_BLIND)) {
      const player = setInitPot(str, pokerHand);

      if (player) {
        pokerHand.potInChips += pokerHand.sizeOfBB;
        pokerHand.potInBB += 1;

        player.moneyInPotInChips += pokerHand.sizeOfBB;
        player.moneyInPotInBB += 1;
      }
    }
  }

  console.log(pokerHand);
}
