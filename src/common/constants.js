/**
 * 每页默认的分页大小
 */
export const PAGE_SIZE_DEFAULT = 20;

/**
 * 用户审核状态：未审核
 */
export const AUDIT_STATE_UNREVIEWED = '0';

/**
 * 用户审核状态：已通过
 */
export const AUDIT_STATE_PASSED = '1';

/**
 * 用户审核状态：未通过
 */
export const AUDIT_STATE_NOT_APPROVED = '-1';

/**
 * 用户审核状态
 */
export const AUDIT_STATE_LIST = [
  {
    label: '未审核',
    value: AUDIT_STATE_UNREVIEWED,
  },
  {
    label: '已通过',
    value: AUDIT_STATE_PASSED,
  },
  {
    label: '未通过',
    value: AUDIT_STATE_NOT_APPROVED,
  },
];
