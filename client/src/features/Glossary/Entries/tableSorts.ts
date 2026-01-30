import { GlossaryNode } from '../../../../../shared/types/index.js';

export function sortBySelected(
  type: 'asc' | 'desc',
  list: any[],
  nodeMap?: Record<string, GlossaryNode>
) {
  return list.sort((a, b) => {
    const aSelected = a.isSelected ? 1 : 0;
    const bSelected = b.isSelected ? 1 : 0;
    if (aSelected < bSelected) return type === 'asc' ? -1 : 1;
    if (aSelected > bSelected) return type === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByName(
  type: 'asc' | 'desc',
  list: any[],
  nodeMap?: Record<string, GlossaryNode>
) {
  return list.sort((a, b) => {
    if (!a.name) return 1;
    if (!b.name) return -1;
    if (a.name.toLowerCase() < b.name.toLowerCase())
      return type === 'asc' ? -1 : 1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
      return type === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByParentName(
  type: 'asc' | 'desc',
  list: any[],
  nodeMap: Record<string, GlossaryNode>
) {
  return list.sort((a, b) => {
    const aParentName = a.parentId ? nodeMap[a.parentId].name : '';
    const bParentName = b.parentId ? nodeMap[b.parentId].name : '';
    if (aParentName.toLowerCase() < bParentName.toLowerCase())
      return type === 'asc' ? -1 : 1;
    if (aParentName.toLowerCase() > bParentName.toLowerCase())
      return type === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByChildCount(
  type: 'asc' | 'desc',
  list: any[],
  nodeMap?: Record<string, GlossaryNode>
) {
  return list.sort((a, b) => {
    const aCount = a.children ? a.children.length : 0;
    const bCount = b.children ? b.children.length : 0;
    if (aCount < bCount) return type === 'asc' ? -1 : 1;
    if (aCount > bCount) return type === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByTemplateName(
  type: 'asc' | 'desc',
  list: any[],
  nodeMap?: Record<string, GlossaryNode>
) {
  return list.sort((a, b) => {
    const aTemplateName = a.template ? a.template.name : '';
    const bTemplateName = b.template ? b.template.name : '';
    if (aTemplateName.toLowerCase() < bTemplateName.toLowerCase())
      return type === 'asc' ? -1 : 1;
    if (aTemplateName.toLowerCase() > bTemplateName.toLowerCase())
      return type === 'asc' ? 1 : -1;
    return 0;
  });
}

export function sortByEntryType(
  type: 'asc' | 'desc',
  list: any[],
  nodeMap?: Record<string, GlossaryNode>
) {
  return list.sort((a, b) => {
    if (a.entryType.toLowerCase() < b.entryType.toLowerCase())
      return type === 'asc' ? -1 : 1;
    if (a.entryType.toLowerCase() > b.entryType.toLowerCase())
      return type === 'asc' ? 1 : -1;
    return 0;
  });
}

export const sortFunctions = {
  select: sortBySelected,
  name: sortByName,
  icon: sortByEntryType,
  parent: sortByParentName,
  children: sortByChildCount,
  template: sortByTemplateName,
};
export default sortFunctions;
