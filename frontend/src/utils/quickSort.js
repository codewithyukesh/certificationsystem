// src/utils/quickSort.js
export const quickSort = (data, field, order) => {
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = [];
    const right = [];

    for (const item of data) {
        if (item[field] < pivot[field]) {
            left.push(item);
        } else if (item[field] > pivot[field]) {
            right.push(item);
        }
    }

    const sortedData = [...quickSort(left, field, order), pivot, ...quickSort(right, field, order)];

    // Reverse if descending order is needed
    return order === 'desc' ? sortedData.reverse() : sortedData;
};
