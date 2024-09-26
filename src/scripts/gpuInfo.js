// gpuInfo.js

export function isGPUSupported(gpuKeywords) {
    // Create a WebGL canvas context
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.warn('WebGL not supported');
        return false; // WebGL not supported
    }

    // Get debug information if the extension is supported
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (!debugInfo) {
        console.warn('WEBGL_debug_renderer_info not available');
        return false; // Extension not available
    }

    // Extract renderer information
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    // Log the raw renderer information for debugging purposes
    console.log("Renderer:", renderer);

    // Create a regular expression from the gpuKeywords array
    const keywordRegex = new RegExp(gpuKeywords.join('|'), 'i');

    // Check if any of the keywords are present in the renderer string
    const isSupported = keywordRegex.test(renderer);

    return isSupported;
}
