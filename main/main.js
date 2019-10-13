'use strict';
export { decodeBarcodes }; // a list of exported variables


function decodeBarcodes(tags) {
    let decodedBarcodes = [];
    tags.forEach(tag => {
        const isExists = decodedBarcodes
            .find(decodedBarcode => {
                return decodedBarcode.barcode === splitBarcodes(tag).barcode;
            });
        isExists ? isExists.count += splitBarcodes(tag).count : decodedBarcodes.push(splitBarcodes(tag));
    });
    return decodedBarcodes;
}

function splitBarcodes(tag) {
    const splitted = tag.split('-');
    let barcode = splitted[0];
    let count = splitted[1];
    return {
        barcode,
        count: (count) ? parseFloat(count) : 1
    };
}
