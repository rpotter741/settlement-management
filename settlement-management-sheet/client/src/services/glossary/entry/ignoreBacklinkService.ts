import api from '@/services/interceptor.js';

export default async function ignoreBacklinkService({
  linkId,
  targetIgnore,
}: {
  linkId: string;
  targetIgnore: boolean;
}) {
  return api
    .patch(`/glossary/backlinks/toggleIgnore`, {
      linkId,
      targetIgnore,
    })
    .then((res: any) => {
      return res.data;
    });
}
