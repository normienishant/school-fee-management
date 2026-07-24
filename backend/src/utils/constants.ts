export const ROLES = {
  ADMIN: 'ADMIN',
  CLERK: 'CLERK',
} as const;

export const PAYMENT_MODES = ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'REFUND'] as const;

export const DEFAULT_LATE_FEE_RULES = {
  percentage: 0,
  flatFee: 50,
  graceDays: 7,
};

export const DEFAULT_DISCOUNT_RULES = {
  siblingDiscount: 0,
  scholarship: 0,
};