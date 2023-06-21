import { faker } from '@faker-js/faker';

export const createFakeUser = () => ({
  username: faker.internet.userName() + Date.now(),
  password: faker.internet.password(),
});
