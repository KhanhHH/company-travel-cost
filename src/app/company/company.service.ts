import { Injectable } from '@nestjs/common';
import { CompanyFetcherService } from './company-fetcher.service';
import { Company, CompanyNode } from './interfaces/company.interface';
import { Travel } from './interfaces/travel.interface';

@Injectable()
export class CompanyService {
  constructor(private companyFetcherService: CompanyFetcherService) {}

  findCompanyById(companies: Company[], id: string) {
    return companies.find((company) => company.id === id);
  }

  findAllCompanyByParentId(companies: Company[], parentId: string) {
    return companies.filter((company) => company.parentId === parentId);
  }

  async getTravelCostByCompanyId(companyId: string) {
    const { companies, travels } = await this.companyFetcherService.fetchData();
    const tree = this.transformToHierarchyTree(companies, travels, companyId);
    const output = this.addTravelCostToAllNode(tree);
    return output;
  }

  transformToHierarchyTree(
    companies: Company[],
    travels: Travel[],
    targetId: string,
  ): CompanyNode[] {
    const recursivePopulate = (parents: CompanyNode[]) => {
      parents.forEach((parent) => {
        parent.childrens = this.findAllCompanyByParentId(companies, parent.id);
        parent.independentCost = this.calculateIndependentTravelCostByCompanyId(
          travels,
          parent.id,
        );
        if (parent.childrens.length === 0) {
          return;
        }
        recursivePopulate(parent.childrens);
      });
    };

    const tree = [this.findCompanyById(companies, targetId)] as CompanyNode[];

    recursivePopulate(tree);

    return tree;
  }

  calculateIndependentTravelCostByCompanyId(
    travels: Travel[],
    companyId: string,
  ) {
    let total = 0;
    travels.forEach((travel) => {
      if (travel.companyId === companyId) {
        total += parseFloat(travel.price);
      }
    });
    return total;
  }

  calculateChildrenNodeTravelCost = (tree: CompanyNode[]) => {
    let totalCostTopDown = 0;
    const treeTraversal = (parents: CompanyNode[]) => {
      parents.forEach((parent) => {
        totalCostTopDown += parent.independentCost;
        if (parent.childrens.length === 0) {
          return;
        }
        treeTraversal(parent.childrens);
      });
    };
    treeTraversal(tree);
    return totalCostTopDown;
  };

  addTravelCostToAllNode(tree: CompanyNode[]): CompanyNode[] {
    const treeTraversal = (parents: CompanyNode[]) => {
      parents.forEach((parent) => {
        if (parent.childrens.length === 0) {
          parent.childrenCost = 0;
          parent.cost = parent.independentCost;
          return;
        }
        parent.childrenCost = this.calculateChildrenNodeTravelCost(
          parent.childrens,
        );
        parent.cost = parent.independentCost + parent.childrenCost;
        treeTraversal(parent.childrens);
      });
    };
    treeTraversal(tree);
    return tree;
  }
}
