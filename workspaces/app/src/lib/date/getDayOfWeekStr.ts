const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export const getDayOfWeekStr = (date: Date) => {
  return days[date.getDay()] as (typeof days)[number];
};
