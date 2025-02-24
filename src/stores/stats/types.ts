export type Stats = {
  numberOfHands: number;
  vpip: number;
  pfr: number;
  threeBet: number;
  wtsd: number;
  wmsd: number;
  wwsf: number;
  foldThreeBetAfterRaising: number;
  preFlopSqueeze: number;
};

export type StatsStore = {
  id: string;
  stats: Stats;
};
