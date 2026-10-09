/**
 * Honest comparison data between Wiggle and typical preschool averages.
 * 6 rows covering educator ratio, outdoor hours, screen policy, food, updates, and safety.
 */
export const comparison = {
  ratio: {
    wiggle: 8,
    typical: 25,
  },
  rows: [
    {
      label: 'Children per teacher',
      wiggle: '8 (strict 1:8 ratio)',
      typical: '20 to 28 children per teacher',
    },
    {
      label: 'Outdoor play each day',
      wiggle: '60 to 90 mins daily in garden',
      typical: '20 to 30 mins, weather permitting',
    },
    {
      label: 'Classroom screens & tablets',
      wiggle: '0% screen-free environment',
      typical: 'Screens used for nursery rhymes & drills',
    },
    {
      label: 'Pantry & daily meals',
      wiggle: 'Freshly cooked organic vegetarian',
      typical: 'Packaged processed snacks or home lunchbox',
    },
    {
      label: 'Parent updates & notes',
      wiggle: 'Daily handover notes & candid photos',
      typical: 'Monthly written diary or once-a-term report',
    },
    {
      label: 'Staff pediatric first-aid',
      wiggle: '100% certified educators & aides',
      typical: 'Designated administrative nurse only',
    },
  ],
  note: 'Typical figures are illustrative averages and vary from school to school. Ask every school for its own numbers.',
};
