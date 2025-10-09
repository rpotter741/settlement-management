import getContent from '@/services/tool/getContent.js';
import getContentByName from '@/services/tool/getContentByName.js';
import getItem from '@/services/tool/getItem.js';
import fetchByIds from '@/services/tool/fetchByIds.js';
import saveTool from '@/services/tool/saveTool.js';
import deleteTool from '@/services/tool/deleteTool.js';
import publishTool from '@/services/tool/publishTool.js';
import prefetchToolContent from '@/services/tool/prefetchToolContent.js';
import paginateToolContent from '@/services/tool/paginateToolContent.js';

export {
  getContent,
  getContentByName,
  getItem,
  fetchByIds,
  saveTool,
  deleteTool,
  publishTool,
  prefetchToolContent,
  paginateToolContent,
};

const toolServices = {
  getContent,
  getContentByName,
  getItem,
  fetchByIds,
  saveTool,
  deleteTool,
  publishTool,
  prefetchToolContent,
  paginateToolContent,
};

export default toolServices;
