import api from '@/services/interceptor.js';

export default async function getNodes({ glossaryId }: { glossaryId: string }) {
  return api
    .get(`/glossary/nodes/${glossaryId}`, { params: { glossaryId } })
    .then((res: any) => {
      return res.data;
    });
}
