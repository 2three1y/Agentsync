import { NSECValidator } from '../utils/NSECValidator';

describe('NSECValidator', () => {
  const mockData = { workspace: 'test-workspace', action: 'transition' };
  const mockSignature = 'abc123signature';
  const mockPublicKey = 'pubkey789';

  test('should verify valid signature', async () => {
    const isValid = await NSECValidator.verifySignature(mockSignature, JSON.stringify(mockData), mockPublicKey);
    expect(isValid).toBe(true);
  });

  test('should validate valid change request', async () => {
    const changeRequest = {
      data: mockData,
      signature: mockSignature,
      publicKey: mockPublicKey
    };
    const isValid = await NSECValidator.validateChange(changeRequest);
    expect(isValid).toBe(true);
  });

  test('should return false if signature is missing', async () => {
    const isValid = await NSECValidator.verifySignature('', JSON.stringify(mockData), mockPublicKey);
    expect(isValid).toBe(false);
  });

  test('should return false if message is missing', async () => {
    const isValid = await NSECValidator.verifySignature(mockSignature, '', mockPublicKey);
    expect(isValid).toBe(false);
  });

  test('should return false if public key is missing', async () => {
    const isValid = await NSECValidator.verifySignature(mockSignature, JSON.stringify(mockData), '');
    expect(isValid).toBe(false);
  });
});
