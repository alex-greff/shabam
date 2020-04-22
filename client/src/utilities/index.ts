// -----------------------------------------------
// --- Helpers for the helpers (helperception) ---
// -----------------------------------------------

// Serializes an given element
function serializeInputEl(el: HTMLElement | string | undefined, selectRoot = false): HTMLElement {
    if (el && el instanceof HTMLElement) {
        // Return the element since it's already one
        return el;
    } else if (el) {
        // Select the element
        return document.querySelector(el) as HTMLElement;
    } else {
        // Return root
        if (selectRoot) {
            return document.documentElement;
        } else {
            throw new Error(`Error: ${el} is an invalid element`);
        }
    }
}

// -----------------------
// --- Utility methods ---
// -----------------------

/**
 * Saves a value to a css property.
 * 
 * @param propertyName The name of the property.
 * @param propertyValue The value to set the property to.
 * @param elSel (Optional) The element or selector for the element. If not given then the root is selected.
 */
export const saveCSSProperty = (propertyName: string, propertyValue: string, elSel?: HTMLElement | string) => {
    // Serialize the input element/query selector/none
    const el = serializeInputEl(elSel, true);
    // Set the custom property
    el.style.setProperty(propertyName, propertyValue);
};

/**
 * Removes a css property.
 * 
 * @param propertyName The name of the property.
 * @param elSel (Optional) The element or selector for the element. If not given then the root is selected.
 */
export const removeCSSProperty = (propertyName: string, elSel?: HTMLElement | string) => {
    // Serialize the input element/query selector/none
    const el = serializeInputEl(elSel, true);
    // Remove the custom property
    el.style.removeProperty(propertyName);
};