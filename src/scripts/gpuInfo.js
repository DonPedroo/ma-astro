// gpuInfo.js

export const gpuKeywords = "(NVIDIA|AMD|M1|M2|M3)";

function extractValue(reg, str) {
    const matches = str.match(reg);
    return matches && matches[0];
}

export function getGPUInfo() {
    // Create a WebGL canvas context
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
        console.warn('WebGL not supported');
        return null; // WebGL not supported
    }

    // Get debug information if the extension is supported
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    if (!debugInfo) {
        console.warn('WEBGL_debug_renderer_info not available');
        return null; // Extension not available
    }

    // Extract vendor and renderer information
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    // Log the raw information for debugging purposes
    console.log("Raw GPU Information:");
    console.log("Vendor:", vendor);
    console.log("Renderer:", renderer);

    // Extract detailed information
    const card = extractValue(new RegExp(`(${gpuKeywords})[^\d]*[^\s]+`), renderer);
    
    if (!card) {
        // console.warn('Unsupported GPU');
        return null;
    }

    const tokens = card.split(' ');
    tokens.shift();

    const manufacturer = extractValue(new RegExp(gpuKeywords), card);
    const cardVersion = tokens.pop();
    const brand = tokens.join(' ');
    const integrated = manufacturer === 'Intel';

    // Return the GPU information as an object
    return {
        card,
        manufacturer,
        cardVersion,
        brand,
        integrated,
        vendor,
        renderer,
    };
}
