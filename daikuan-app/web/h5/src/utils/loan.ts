export const applicationStatus: Record<string, { label: string; description: string; type: string }> = {
  draft: { label: '待提交', description: '申请信息已保存，请确认后提交审核', type: 'default' },
  manual: { label: '人工审核中', description: '专员正在核验您提交的申请材料', type: 'default' },
  phone: { label: '等待电话核验', description: '请保持电话畅通，留意审核来电', type: 'primary' },
  funding: { label: '放款处理中', description: '正在核对放款信息，请留意进度更新', type: 'primary' },
  approved: { label: '审核已通过', description: '申请已经审核通过，请等待后续通知', type: 'success' },
  rejected: { label: '审核未通过', description: '本次申请暂未通过，可查看审核说明', type: 'danger' },
  cancelled: { label: '申请已取消', description: '该笔申请已经取消', type: 'default' },
}

export const getApplicationStatus = (status?: string) =>
  applicationStatus[status || ''] || { label: '状态更新中', description: '请稍后刷新查看', type: 'default' }

export const reviewStep = (status?: string) => {
  if (status === 'approved') return 3
  if (status === 'funding') return 2
  if (status === 'phone') return 1
  return 0
}
