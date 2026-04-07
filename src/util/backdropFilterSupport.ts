const SOFTWARE_RENDERER_PATTERN = /swiftshader|llvmpipe|software|microsoft basic render/i;

function supportsBackdropFilter(): boolean {
  if (typeof window === "undefined" || typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }

  return CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)");
}

function getWebGLRenderer(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return null;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return null;

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return typeof renderer === "string" ? renderer : null;
  } catch {
    return null;
  }
}

export function shouldEnableBackdropFilter(): boolean {
  if (!supportsBackdropFilter()) return false;

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    return false;
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) {
    return false;
  }

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores < 4 || memory < 4) {
    return false;
  }

  const renderer = getWebGLRenderer();
  if (renderer && SOFTWARE_RENDERER_PATTERN.test(renderer)) {
    return false;
  }

  return true;
}

export function applyBackdropFilterCapabilityClass(): void {
  document.documentElement.classList.toggle("can-use-backdrop-filter", shouldEnableBackdropFilter());
}
