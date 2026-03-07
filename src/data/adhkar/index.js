import { MORNING_ADHKAR } from './morning';
import { EVENING_ADHKAR } from './evening';
import { AFTER_PRAYER_ADHKAR } from './afterPrayer';
import { QADR_ADHKAR } from './qadr';
import { GENERAL_ADHKAR } from './general';
import { ASMAUL_HUSNA } from './asmaulHusnaData';
import { HADITH_DATA } from './hadithData';

const ALL_ADHKAR = {
  morning: MORNING_ADHKAR,
  evening: EVENING_ADHKAR,
  after_prayer: AFTER_PRAYER_ADHKAR,
  qadr: QADR_ADHKAR,
  general: GENERAL_ADHKAR,
  asmaul_husna: ASMAUL_HUSNA,
  hadith: HADITH_DATA
};

export { 
  MORNING_ADHKAR, 
  EVENING_ADHKAR, 
  AFTER_PRAYER_ADHKAR, 
  QADR_ADHKAR, 
  GENERAL_ADHKAR, 
  ASMAUL_HUSNA,
  HADITH_DATA 
};
export default ALL_ADHKAR;
