export type Stats = {
  vpip: number;
  pfr: number;
  threeBet: number;
  wtsd: number;
  wmsd: number;
  wwsf: number;
  foldThreeBet: number;
  preFlopSqueeze: number;
};

export type StatsStore = {
  id: string;
  stats: Partial<Stats>;
};
