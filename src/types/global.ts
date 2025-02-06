export type GlobalStats = {
  vpip: number;
  pfr: number;
  threeBet: number;
  wtsd: number;
  wmsd: number;
  wwsf: number;
  foldThreeBet: number;
  preFlopSqueeze: number;
};

export type GlobalCounters = {
  numberOfHands: number;
  sawFlopTimes: number;
  sawTurnTimes: number;
  sawRiverTimes: number;
  sawShowDownTimes: number;
  wonShowDownTimes: number;
};
