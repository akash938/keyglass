"use client";

import React, { memo } from "react";

/**
 * Ultra-lightweight static Apple mesh gradient backdrop.
 * Zero continuous JS/blur animations behind backdrop-filter glass surfaces -> drops idle GPU load near 0%.
 */
export const AmbientBackdrop = memo(function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(620px circle at 12% 4%, var(--bg-gradient-1), transparent 65%),
          radial-gradient(640px circle at 92% 8%, var(--bg-gradient-2), transparent 65%),
          radial-gradient(700px circle at 52% 96%, var(--bg-gradient-3), transparent 68%)
        `,
      }}
    />
  );
});
