import { getArrayFromString } from '.';
import { KEY_WORDS } from '@/enums/parser';
import type { Blinds } from '@/types';
import type { TableType } from '@/enums/pokerType';

export function getBlinds(arr: string[]): Blinds {
  const blindsInfoString = arr[arr.length - 4];
  const temp = getArrayFromString(blindsInfoString, '/');

  if (temp.length !== 2) throw Error('Передана некорректная строка для подсчёта блайндов');

  const sb = +temp[0].slice(2);
  const bb = +temp[1].slice(1, -1);

  return { sb, bb };
}

export function getTableTypeAndButtonSeat(arr: string[]): { tableType: TableType, buttonSeat: number } {
  const tableType = arr[2] as TableType;
  const buttonSeat = +arr[arr.indexOf(KEY_WORDS.SEAT) + 1].slice(1);

  return { tableType, buttonSeat };
}
