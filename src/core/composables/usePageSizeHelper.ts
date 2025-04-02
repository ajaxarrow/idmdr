export const usePageSizeHelper = () => {
    function generatePageSizeIncrements(totalItems: number): number[] {
        // Return empty array for invalid input
        if (totalItems <= 0) {
            return [];
        }

        // For very small collections, use small increments
        if (totalItems <= 10) {
            return [5, 10];
        }

        const increments: number[] = [];

        // Always start with 5 if totalItems > 5
        if (totalItems > 5) {
            increments.push(5);
        }

        // Calculate base increments as powers of 10 and 5x powers of 10
        let base = 10;
        while (base <= totalItems) {
            increments.push(base);

            // Add the midpoint (e.g., 50 between 10 and 100) if it's less than totalItems
            const midpoint = base * 5;
            if (midpoint <= totalItems) {
                increments.push(midpoint);
            }

            base *= 10;
        }

        // If we don't have enough increments, add some more based on totalItems
        if (increments.length < 3 && totalItems > 10) {
            // Remove the last element which might be too close to totalItems
            if (increments.length > 0 && increments[increments.length - 1] > totalItems * 0.8) {
                increments.pop();
            }

            // Add totalItems itself if it's not too close to the last increment
            if (increments.length === 0 || totalItems > increments[increments.length - 1] * 1.5) {
                increments.push(totalItems);
            }

            // If still not enough, add intermediate values
            if (increments.length < 3) {
                const lastValue = increments[increments.length - 1] || totalItems;
                const firstValue = increments[0] || 5;

                // Add a value between the first and last increments
                const middleValue = Math.floor((firstValue + lastValue) / 2);
                if (middleValue !== firstValue && middleValue !== lastValue) {
                    // Insert at the right position to maintain sorting
                    let inserted = false;
                    for (let i = 0; i < increments.length - 1; i++) {
                        if (middleValue > increments[i] && middleValue < increments[i + 1]) {
                            increments.splice(i + 1, 0, middleValue);
                            inserted = true;
                            break;
                        }
                    }

                    if (!inserted) {
                        increments.push(middleValue);
                    }
                }
            }
        }

        // Sort the increments (just in case)
        increments.sort((a, b) => a - b);

        // Remove duplicates
        return [...new Set(increments)];
    }

    return { generatePageSizeIncrements }
}