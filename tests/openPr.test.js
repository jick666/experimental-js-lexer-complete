import { jest } from '@jest/globals';
import { openPr } from '../agentic-automation.js';

class MockOctokit {
  constructor() {
    this.rest = {
      pulls: { create: jest.fn().mockResolvedValue({ data: { number: 1 } }) },
      issues: { addLabels: jest.fn().mockResolvedValue({}) }
    };
  }
}

describe('openPr', () => {
  const repo = 'owner/repo';
  const token = 'test-token';

  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = repo;
    process.env.GITHUB_TOKEN = token;
  });

  afterEach(() => {
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_TOKEN;
  });

  test('labels newly created pull request', async () => {
    const mock = new MockOctokit();

    await openPr(mock);

    expect(mock.rest.pulls.create).toHaveBeenCalled();
    expect(mock.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 1,
      labels: ['reader']
    });
  });
});
