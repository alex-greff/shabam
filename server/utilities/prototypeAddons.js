// Importing this function globally attaches a variety of useful functions to the prototypes of objects

// https://stackoverflow.com/questions/44850135/function-similar-to-promise-some-any-for-an-unknown-amount-of-promises
/**
 * Returns a list of all resolved values where at least the given count amount resolve.
 * 
 * @param {Array} promises An array of promises.
 * @param {Number} count The minimum amount of promises that need to resolve.
 */
Promise.some = async function(promises, count = 1) {
    // Wrapp all the promises to handle the fail cases
    const wrapped = promises.map(async promise => {
        try {
            const value = await promise();
            return {
                success: true,
                value
            }
        } catch(err) {
            return {
                success: false
            }
        }
    });

    const results = await Promise.all(wrapped);
    const successful = results.filter(result => result.success);

    if (successful.length < count) {
        throw new Error(`Only ${successful.length} promises resolved`);
    }

    return successful.map(result => result.value);
};