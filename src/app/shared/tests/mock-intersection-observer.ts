class MockIntersectionObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}

/**
 * Mocks the IntersectionObserver which isn't available in non-browser environments
 */
export const mockIntersectionObserver = () => {
  // @ts-expect-error IntersectionObserver mocking
  window.IntersectionObserver = MockIntersectionObserver;
};
