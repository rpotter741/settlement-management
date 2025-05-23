import { v4 as newId } from 'uuid';

const defaultKit = {
  refId: newId(),
  id: newId(),
  name: 'Default Kit',
  attribute: [
    {
      id: '5cc3ef20-9c2c-472a-a275-d9c24a31e822',
      refId: '879fe7eb-c648-49b6-b3fe-64c21879df6f',
      name: 'Shelter',
    },
    {
      id: '99a916d4-e33e-4b1f-8547-2c1fb708a898',
      refId: '9a31ff05-ec96-4eb8-8091-4b31ff0a92df',
      name: 'Medical Capacity',
    },
    {
      id: '3508fb04-11ce-476a-a6c2-12e2bf375947',
      refId: 'cf0bc028-4af6-4706-a45c-74ef5c9920a9',
      name: 'Trade',
    },
    {
      id: '72e58745-d941-4a6e-b59e-c715b88c6092',
      refId: '0a57a073-a653-4319-ba2d-eae7339c70e7',
      name: 'Craftsmanship',
    },
    {
      id: 'c3b089c6-71bc-4d17-a79d-2d982d4730e6',
      refId: '0308d870-e3b4-4b7a-b67e-2884b176ef05',
      name: 'Culture',
    },
    {
      id: '4ba9c647-5ebc-458a-984d-69cf2625e368',
      refId: '2a3efc50-2bc8-4267-863b-51455c5fd0fd',
      name: 'Garrison',
    },
    {
      id: 'd6583c86-118d-491f-9e37-2aaf0cf30fec',
      refId: '23d9b0ef-6231-41f4-ad50-f6c2b12dc289',
      name: 'Intelligence',
    },
    {
      id: '6fbcc959-5f6b-4d2a-bc1e-37effd6b5507',
      refId: 'ea9a65b8-c80c-44b0-8332-af62075e69cb',
      name: 'Defensive Infrastructure',
    },
    {
      id: 'a5c97391-9940-407a-b529-41b0734c4e2c',
      refId: 'e12e0bed-4768-443e-aa13-0a9b53f853ce',
      name: 'Food',
    },
  ],
  category: [
    {
      id: 'f4bca2b2-2f68-4fdf-ad21-0a8d176d80b4',
      refId: 'dbdaef8d-403c-434c-9b4b-45aea8c9c330',
      name: 'Economy',
    },
    {
      id: '7b0f0dac-6b78-4b8a-b19d-36cb3104b7f8',
      refId: '9c4b6880-35ac-4785-9b43-6a7853052936',
      name: 'Safety',
    },
    {
      id: '2738ea72-9078-4f16-97e8-3b511258dc11',
      refId: '8fe4ae02-dbfc-4703-8c7d-e35268d4c54e',
      name: 'Survival',
    },
  ],
  contentType: 'OFFICIAL',
  createdBy: 'robbiepottsdm',
};

export default defaultKit;
