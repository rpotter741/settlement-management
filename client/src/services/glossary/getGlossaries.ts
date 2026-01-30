import api from '../interceptor.js';

export default async function getGlossaries() {
  return api.get('/glossary').then((res: any) => {
    return res.data;
  });
}
