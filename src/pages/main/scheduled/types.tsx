export interface EditData{
  id?:number
}

export interface StopScheduledTaskParams{
  id:number;
  status: number;
}

export interface ScheduledTask {
  id: number;
  /**
   * 任务ID备用
   */
  taskId: string;
  /**
   * 任务名称
   */
  taskName: string;
  /**
   * 实例名称
   */
  beanName: string;
  /**
   * 方法名称
   */
  methodName: string;
  /**
   * 参数
   */
  argument: string;
  /**
   * 子任务
   */
  subTask: string;
  /**
   * 任务方式 1正则表达式 2固定时间间隔 3固定延迟
   */
  taskMode: number;
  /**
   * 表达式
   */
  expression: string;
  description: string;
  /**
   * 任务状态 1正常 0暂停
   */
  status: number;
  createTime: string; // LocalDateTime 转换为 string
  updateTime: string; // LocalDateTime 转换为 string
  deleted: boolean;
}