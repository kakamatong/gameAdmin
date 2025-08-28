/**
 * 公用枚举定义文件
 * 统一管理项目中的所有枚举类型，方便维护和扩展
 * 使用常量对象来替代枚举，以符合项目的 TypeScript 配置
 */

// =============================================================================
// 用户相关常量
// =============================================================================

/**
 * 用户状态常量
 */
export const UserStatus = {
  /** 禁用 */
  DISABLED: 0,
  /** 正常 */
  ACTIVE: 1,
  /** 封禁 */
  BANNED: 2,
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

/**
 * 性别常量
 */
export const Gender = {
  /** 未知 */
  UNKNOWN: 0,
  /** 男 */
  MALE: 1,
  /** 女 */
  FEMALE: 2,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

// =============================================================================
// 财富/奖励相关常量
// =============================================================================

/**
 * 财富类型常量
 * 统一管理游戏内的各种虚拟货币和道具
 */
export const RichType = {
  /** 钻石 */
  DIAMOND: 1,
  /** 金币 */
  GOLD: 2,
  /** 门票 */
  TICKET: 3,
  /** 体力 */
  ENERGY: 4,
  /** VIP经验 */
  VIP_EXP: 5,
  /** 道具 */
  ITEM: 6,
} as const;

export type RichType = (typeof RichType)[keyof typeof RichType];

/**
 * 奖励类型常量 (与财富类型保持一致)
 */
export const AwardType = {
  /** 钻石 */
  DIAMOND: 1,
  /** 金币 */
  GOLD: 2,
  /** 门票 */
  TICKET: 3,
  /** 体力 */
  ENERGY: 4,
  /** VIP经验 */
  VIP_EXP: 5,
  /** 道具 */
  ITEM: 6,
} as const;

export type AwardType = (typeof AwardType)[keyof typeof AwardType];

// =============================================================================
// 邮件相关常量
// =============================================================================

/**
 * 邮件类型常量
 */
export const MailType = {
  /** 全服邮件 */
  GLOBAL: 0,
  /** 个人邮件 */
  PERSONAL: 1,
} as const;

export type MailType = (typeof MailType)[keyof typeof MailType];

/**
 * 邮件状态常量
 */
export const MailStatus = {
  /** 禁用 */
  DISABLED: 0,
  /** 启用 */
  ACTIVE: 1,
} as const;

export type MailStatus = (typeof MailStatus)[keyof typeof MailStatus];

/**
 * 邮件读取状态常量
 */
export const MailReadStatus = {
  /** 未读 */
  UNREAD: 0,
  /** 已读 */
  READ: 1,
} as const;

export type MailReadStatus = (typeof MailReadStatus)[keyof typeof MailReadStatus];

/**
 * 邮件领取状态常量
 */
export const MailReceiveStatus = {
  /** 未领取 */
  NOT_RECEIVED: 0,
  /** 已领取 */
  RECEIVED: 1,
} as const;

export type MailReceiveStatus = (typeof MailReceiveStatus)[keyof typeof MailReceiveStatus];

// =============================================================================
// 管理员相关常量
// =============================================================================

/**
 * 管理员状态常量
 */
export const AdminStatus = {
  /** 未激活 */
  INACTIVE: 0,
  /** 正常 */
  ACTIVE: 1,
  /** 锁定 */
  LOCKED: 2,
} as const;

export type AdminStatus = (typeof AdminStatus)[keyof typeof AdminStatus];

// =============================================================================
// 日志相关常量
// =============================================================================

/**
 * 游戏结果常量
 */
export const GameResult = {
  /** 失败 */
  LOSE: 0,
  /** 胜利 */
  WIN: 1,
  /** 平局 */
  DRAW: 2,
} as const;

export type GameResult = (typeof GameResult)[keyof typeof GameResult];

/**
 * 登录状态常量
 */
export const LoginStatus = {
  /** 失败 */
  FAILED: 0,
  /** 成功 */
  SUCCESS: 1,
} as const;

export type LoginStatus = (typeof LoginStatus)[keyof typeof LoginStatus];

// =============================================================================
// 系统相关常量
// =============================================================================

/**
 * 请求状态常量
 */
export const RequestStatus = {
  /** 空闲 */
  IDLE: 'idle',
  /** 加载中 */
  LOADING: 'loading',
  /** 成功 */
  SUCCESS: 'success',
  /** 错误 */
  ERROR: 'error',
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 获取用户状态显示文本
 */
export const getUserStatusText = (status: number): string => {
  const textMap: Record<number, string> = {
    [UserStatus.DISABLED]: '禁用',
    [UserStatus.ACTIVE]: '正常',
    [UserStatus.BANNED]: '封禁',
  };
  return textMap[status] || '未知';
};

/**
 * 获取性别显示文本
 */
export const getGenderText = (gender: number): string => {
  const textMap: Record<number, string> = {
    [Gender.UNKNOWN]: '未知',
    [Gender.MALE]: '男',
    [Gender.FEMALE]: '女',
  };
  return textMap[gender] || '未知';
};

/**
 * 获取财富类型显示文本
 */
export const getRichTypeText = (richType: number): string => {
  const textMap: Record<number, string> = {
    [RichType.DIAMOND]: '钻石',
    [RichType.GOLD]: '金币',
    [RichType.TICKET]: '门票',
    [RichType.ENERGY]: '体力',
    [RichType.VIP_EXP]: 'VIP经验',
    [RichType.ITEM]: '道具',
  };
  return textMap[richType] || '未知';
};

/**
 * 获取邮件类型显示文本
 */
export const getMailTypeText = (mailType: number): string => {
  const textMap: Record<number, string> = {
    [MailType.GLOBAL]: '全服邮件',
    [MailType.PERSONAL]: '个人邮件',
  };
  return textMap[mailType] || '未知';
};

/**
 * 获取邮件状态显示文本
 */
export const getMailStatusText = (status: number): string => {
  const textMap: Record<number, string> = {
    [MailStatus.DISABLED]: '禁用',
    [MailStatus.ACTIVE]: '启用',
  };
  return textMap[status] || '未知';
};

/**
 * 获取游戏结果显示文本
 */
export const getGameResultText = (result: number): string => {
  const textMap: Record<number, string> = {
    [GameResult.LOSE]: '失败',
    [GameResult.WIN]: '胜利',
    [GameResult.DRAW]: '平局',
  };
  return textMap[result] || '未知';
};