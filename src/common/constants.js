/**
 * 每页默认的分页大小
 */
export const PAGE_SIZE_DEFAULT = 20;

/**
 * NO: 0
 */
export const BOOLEAN_NO = 0;

/**
 * YES: 1
 */
export const BOOLEAN_YES = 1;

/**
 * 用户审核状态：未审核
 */
export const AUDIT_STATE_UNREVIEWED = BOOLEAN_NO;

/**
 * 用户审核状态：已通过
 */
export const AUDIT_STATE_PASSED = BOOLEAN_YES;

/**
 * 用户审核状态：未通过
 */
export const AUDIT_STATE_REFUSE = 2;

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
    value: AUDIT_STATE_REFUSE,
  },
];

/**
 * 广告粘贴状态：未审核
 */
export const AD_PASTE_STATE_UN_REVIEW = BOOLEAN_NO;

/**
 * 广告粘贴状态：审核通过，未粘贴
 */
export const AD_PASTE_STATE_UN_PASTED = BOOLEAN_YES;

/**
 * 广告粘贴状态：审核通过，已粘贴
 */
export const AD_PASTE_STATE_PASTED = 2;

/**
 * 广告粘贴状态：审核被拒绝
 */
export const AD_PASTE_STATE_REFUSE = 3;

/**
 * 广告粘贴状态
 */
export const AD_PASTE_STATE_LIST = [
  {
    label: '未粘贴',
    value: AD_PASTE_STATE_UN_PASTED,
  },
  {
    label: '已粘贴',
    value: AD_PASTE_STATE_PASTED,
  },
  {
    label: '已拒绝',
    value: AD_PASTE_STATE_REFUSE,
  },
];

/**
 * 签约金结算状态：未结算
 */
export const SIGNING_GOLD_SETTLEMENT_STATE_UN_SETTLED = BOOLEAN_NO;

/**
 * 签约金结算状态：已结算
 */
export const SIGNING_GOLD_SETTLEMENT_STATE_SETTLED = BOOLEAN_YES;

/**
 * 签约金结算状态
 */
export const SIGNING_GOLD_SETTLEMENT_STATE_LIST = [
  {
    label: '未结算',
    value: SIGNING_GOLD_SETTLEMENT_STATE_UN_SETTLED,
  },
  {
    label: '已结算',
    value: SIGNING_GOLD_SETTLEMENT_STATE_SETTLED,
  },
];

/**
 * 发布状态：未发布
 */
export const PUBLISH_STATE_NO = BOOLEAN_NO;

/**
 * 发布状态：已发布
 */
export const PUBLISH_STATE_YES = BOOLEAN_YES;

/**
 * 发布状态
 */
export const PUBLISH_STATE_LIST = [
  {
    label: '未发布',
    value: PUBLISH_STATE_NO,
  },
  {
    label: '已发布',
    value: PUBLISH_STATE_YES,
  },
];

/**
 *  置顶状态：已置顶
 */
export const TOP_STATE_YES = BOOLEAN_YES;

/**
 *  置顶状态：未置顶
 */
export const TOP_STATE_NO = BOOLEAN_NO;

/**
 * 积分结算状态：已结算
 */
export const INTEGRAL_SETTLEMENT_STATE_YES = BOOLEAN_YES;

/**
 * 积分结算状态：未结算
 */
export const INTEGRAL_SETTLEMENT_STATE_NO = BOOLEAN_NO;

// export const WECHAT_APPID = 'wxe2f3fc904dcf43f4';
// export const WECHAT_APP_SECRET = '429c9d561e8009e0586e6f5d1c4d28b5';
export const WECHAT_APPID = 'wxdeccec8d16c71e0c';
export const WECHAT_APP_SECRET = 'adf861f192b1f9727ae5ff4ca9f04737';
