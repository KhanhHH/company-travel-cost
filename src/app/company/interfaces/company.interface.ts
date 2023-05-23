export interface Company {
  id: string
  createdAt: string
  name: string
  parentId: string
}


export interface CompanyNode extends Company {
  independentCost?: number
  childrenCost?: number
  cost?: number
  childrens?: CompanyNode[]
}


