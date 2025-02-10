export type Counters = {
  numberOfHands: number;
  sawFlopTimes: number;
  sawTurnTimes: number;
  sawRiverTimes: number;
  sawShowDownTimes: number;
  wonShowDownTimes: number;
  preFlopRaises: number;
  preFlopThreeBets: number;
  foldPreFlopThreeBets: number;
  preFlopSqueeze: number;
  putIntoPot: number;
  numberOfSqueezeSituations: number;
};

export type CountersStore = {
  id: string;
  counters: Partial<Counters>;
};
