import Take6Card from '@/class/Take6Card';

export const calculateBeefHead = (cardOrRank: Take6Card | number) => {
  const rank = typeof cardOrRank === 'number' ? cardOrRank : cardOrRank.rank;

  if (rank % 11 === 0 && rank % 5 === 0 && rank % 10 !== 0) return 7;
  if (rank % 11 === 0) return 5;
  if (rank % 10 === 0) return 3;
  if (rank % 5 === 0) return 2;

  return 1;
};
