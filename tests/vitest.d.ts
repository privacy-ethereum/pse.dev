/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers"
import type { Assertion, AsymmetricMatchersContaining } from "vitest"

declare module "vitest" {
  interface Assertion<T = any>
    extends jest.Matchers<void>,
      TestingLibraryMatchers<T, void> {
    toBeInTheDocument(): void
  }
  interface AsymmetricMatchersContaining extends jest.Expect {
    toBeInTheDocument(): void
  }
}
