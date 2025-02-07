export type Counters = {
  numberOfHands: number;
  sawFlopTimes: number;
  sawTurnTimes: number;
  sawRiverTimes: number;
  sawShowDownTimes: number;
  wonShowDownTimes: number;
};

export type CountersStore = {
  id: string;
  counters: Partial<Counters>;
};
