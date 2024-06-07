import { render } from '@testing-library/react';

import DomainKeywords from './domain-keywords';

describe('DomainKeywords', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DomainKeywords />);
    expect(baseElement).toBeTruthy();
  });
});
