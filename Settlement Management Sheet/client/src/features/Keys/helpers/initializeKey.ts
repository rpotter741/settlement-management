import { v4 as newId } from 'uuid';

function initializeKey() {
  return {
    refId: newId(),
    id: newId(),
    name: '',
    description: '',
  };
}

export default initializeKey;
