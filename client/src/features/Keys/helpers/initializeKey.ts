import { ulid as newId } from 'ulid';

function initializeKey() {
  return {
    refId: newId(),
    id: newId(),
    name: '',
    description: '',
  };
}

export default initializeKey;
