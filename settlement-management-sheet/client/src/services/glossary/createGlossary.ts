import api from '../interceptor.js';

export default async function createGlossary({
  id,
  name,
  description,
  genre,
  subGenre,
}: {
  id: string;
  name: string;
  description: {
    markdown: string;
    string: string;
  };
  genre: string;
  subGenre: string;
}) {
  return api
    .post('/glossary', { id, name, description, genre, subGenre })
    .then((res: any) => {
      return res.data;
    });
}
