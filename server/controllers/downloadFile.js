


export const downloadPayrollFile = async (req, res, next) => {
  // TODO
  const file = '/Users/ptangchaler/Workspaces/workmanship-vta/server/resources/input-template.xlsx'
  res.download(file)
}
