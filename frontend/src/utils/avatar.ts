import { Role } from '@/types/enum';

export const stringToHslColor = (
  str: string,
  options?: { s: number; l: number },
) => {
  const { s, l } = options || { s: 30, l: 50 };
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

export const ROLE_TITLE: Record<string, string> = {
  [Role.DISTRICT]: 'Cán bộ Quận',
  [Role.VHTT]: 'Sở VH-TT',
  [Role.WARD]: 'Cán bộ Phường',
};
