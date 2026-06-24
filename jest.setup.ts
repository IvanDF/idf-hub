import '@testing-library/jest-dom'

// Suppress expected console.error noise from jsdom environment
const originalError = console.error.bind(console);
jest.spyOn(console, 'error').mockImplementation((...args) => {
  const msg = args.map((a: unknown) =>
    typeof a === 'string' ? a : typeof a === 'object' && a instanceof Error ? a.message : '',
  ).join(' ');

  // Three.js R3F — unknown custom elements in jsdom
  if (msg.includes('is using incorrect casing') ||
      msg.includes('is unrecognized in this browser')) {
    return;
  }

  // Recognize non-boolean attribute warnings for known false positives
  if (msg.includes('non-boolean attribute')) {
    return;
  }

  // Recognize unknown DOM prop warnings for R3F/Framer Motion specific props
  if (msg.includes('React does not recognize the') &&
      ['sizeAttenuation', 'depthWrite', 'whileInView', 'whileHover'].some(p => msg.includes(p))) {
    return;
  }

  // act(...) environment warning
  if (msg.includes('not configured to support act')) {
    return;
  }

  originalError(...args);
});
