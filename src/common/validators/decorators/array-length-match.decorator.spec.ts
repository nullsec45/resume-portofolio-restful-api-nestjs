import { validate } from 'class-validator';
import { ArrayLengthMatch } from './array-length-match.decorator';

describe('ArrayLengthMatch', () => {
  class TestCase {
    field1: string[];

    @ArrayLengthMatch('field1')
    field2: number[];
  }

  it('should fail validation if length of field2 is not equal to field 1', async () => {
    const testCase = new TestCase();
    testCase.field1 = ['Cat', 'Dog'];
    testCase.field2 = [1];

    const errors = await validate(testCase);

    expect(errors).toHaveLength(1);
  });

  it('should pass validation if length of field2 is equal to field 1', async () => {
    const testCase = new TestCase();
    testCase.field1 = ['Cat', 'Dog'];
    testCase.field2 = [1, 2];

    const errors = await validate(testCase);

    expect(errors).toHaveLength(0);
  });
});
