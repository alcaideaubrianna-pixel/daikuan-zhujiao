export type LoanStatus = '审核中' | '还款中' | '已逾期' | '已结清'
export interface Loan { id:number; amount:number; term:number; repaid:number; nextAmount:number; nextDate:string; status:LoanStatus; purpose:string; annualRate:number; bank:string }
export const loans: Loan[] = [
  { id:2026091101,amount:10000,term:6,repaid:2,nextAmount:1726.32,nextDate:'2026-10-11',status:'还款中',purpose:'日常消费',annualRate:10.8,bank:'招商银行（尾号 8866）' },
  { id:2026041802,amount:5000,term:3,repaid:3,nextAmount:0,nextDate:'2026-07-18',status:'已结清',purpose:'教育培训',annualRate:9.6,bank:'工商银行（尾号 2198）' },
]
export const money=(n:number)=>`¥${n.toLocaleString('zh-CN',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})}`
export const certifications = [
  { key:'iou',title:'借条材料',desc:'上传借条照片或视频',icon:'description-o',required:true },
  { key:'income',title:'收入证明',desc:'工资或经营流水，任选一项',icon:'balance-list-o',required:true },
  { key:'debt',title:'负债信息',desc:'如实上传现有负债证明',icon:'bill-o',required:true },
  { key:'identity',title:'身份认证',desc:'身份证信息核验',icon:'idcard',required:true },
  { key:'face',title:'人脸核身',desc:'确认由本人完成申请',icon:'scan',required:true },
  { key:'personal',title:'个人信息',desc:'学历、职业及居住信息',icon:'contact',required:true },
  { key:'contact',title:'联系人认证',desc:'填写 1 位亲属和 2 位朋友',icon:'friends-o',required:true },
  { key:'bank',title:'收款银行卡',desc:'用于接收借款资金',icon:'card',required:true },
]
