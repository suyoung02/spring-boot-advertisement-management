import { RequirementStatus, Role } from '@/types/enum';

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

export const STATUS_TITLE: Record<string, string> = {
  [RequirementStatus.IN_PROGRESS]: 'Đang xử lý',
  [RequirementStatus.ACTIVE]: 'Chấp nhận',
  [RequirementStatus.REJECT]: 'Từ chối',
};

export const ICON = {
  AD: 'https://firebasestorage.googleapis.com/v0/b/poetic-tube-407505.appspot.com/o/files%2FThie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(1).png?alt=media&token=0aaa2909-0926-4182-815f-52cbf6c050c1',
};
