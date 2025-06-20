import { jest } from '@jest/globals';
import { openPr } from '../agentic-automation.js';

class MockOctokit {
  constructor(listResponse = []) {
    this.rest = {
      pulls: {
        list: jest.fn().mockResolvedValue({ data: listResponse }),
        create: jest.fn().mockResolvedValue({ data: { number: 1 } }),
        update: jest.fn().mockResolvedValue({ data: { number: 1 } })
      },
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
    expect(mock.rest.pulls.update).not.toHaveBeenCalled();
    expect(mock.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 1,
      labels: ['reader']
    });
  });

  test('updates existing pull request', async () => {
    const mock = new MockOctokit([{ number: 42 }]);

    await openPr(mock);

    expect(mock.rest.pulls.create).not.toHaveBeenCalled();
    expect(mock.rest.pulls.update).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 42,
      title: expect.any(String),
      body: expect.any(String)
    });
    expect(mock.rest.issues.addLabels).toHaveBeenCalled();
  });
});
