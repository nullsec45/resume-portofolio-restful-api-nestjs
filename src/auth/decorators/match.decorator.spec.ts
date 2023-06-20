import { validate } from 'class-validator';
import { Match } from './match.decorator';

describe('MatchDecorator', () => {
  class TestCase {
    field1: string;

    @Match(TestCase, (dto) => dto.field1)
    field2: string;
  }

  it('should fail validation if value of field 2 is not equal to field 1', async () => {
    const testCase = new TestCase();
    testCase.field1 = 'Hello World';
    testCase.field2 = 'Hello';

    const errors = await validate(testCase);

    expect(errors).toHaveLength(1);
  });

  it('should pass validation if value of field 2 is equal to field 1', async () => {
    const testCase = new TestCase();
    testCase.field1 = 'Hello World';
    testCase.field2 = 'Hello World';

    const errors = await validate(testCase);

    expect(errors).toHaveLength(0);
  });
});
