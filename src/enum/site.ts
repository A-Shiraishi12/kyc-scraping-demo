/** ECサイト */
export const SITE = {
  /** 78:DCMオンライン */
  DCM_ONLINE: {
    id: 'dcmOnline',
    name: 'DCMオンライン',
    disabled: false,
    number: 78,
  },
} as const;
/** ECサイト */
export type SITE = (typeof SITE)[keyof typeof SITE];
