/**
 * remove dupicates from arr
 * @param arr 
 * @returns 
 */
const removeDuplicates = (arr: any) => {
    if (!arr) {
        return [];
    }

    return [...new Set(arr)];
}

export { removeDuplicates };