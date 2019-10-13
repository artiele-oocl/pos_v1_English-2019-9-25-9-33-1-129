'use strict';

function printReceipt(tags) {
    console.log(renderReceipt(calculateReceipt(decodeTags(tags))));
}

function renderReceipt(receipt) {
    let formattedReceipt = "";
    formattedReceipt +=
        '***<store earning no money>Receipt ***\n' +
        getFinalReceipt(receipt) +
        '----------------------\n' +
        `Total: ${receipt.total.toFixed(2)}(yuan)\n` +
        `Discounted prices: ${receipt.savings.toFixed(2)}(yuan)\n` +
        '**********************';
    return formattedReceipt;
}

function getFinalReceipt(receipt) {
    let displayFinalReceipt = "";
    receipt.receiptItems.forEach(items => {
        displayFinalReceipt += `Name: ${items.name}, Quantity: ${items.count} ${items.unit}s, Unit: ${items.price.toFixed(2)}(yuan), Subtotal: ${items.subtotal.toFixed(2)}(yuan)\n`;
    });
    return displayFinalReceipt;
}
function decodeTags(tags) {
    return combineItems(decodeBarcodes(tags));
}
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
function combineItems(decodedBarcodes) {
    let loadedItems = loadItems(decodedBarcodes);
    loadedItems.forEach(loadedItem => {
        let decodedItem = decodedBarcodes.find(item => item.barcode === loadedItem.barcode);
        loadedItem.count = decodedItem.count;
    });
    return loadedItems;
}
function loadItems(decodedBarcodes) {
    return decodedBarcodes.map((item) => {
        return loadAllItems().find(loadItem => loadItem.barcode === item.barcode);
    });
}
function calculateReceipt(items) {
    const receiptItems = calculateReceiptItems(items);
    const receipt = calculateReceiptTotal(receiptItems);

    return calculateReceiptSavings(receipt);
}
function calculateReceiptSavings(receiptItems) {
    let TotalWithoutPromotion = 0;
    receiptItems.receiptItems.map(item => TotalWithoutPromotion += (item.price * item.count));
    receiptItems.savings = TotalWithoutPromotion - receiptItems.total;
    return receiptItems;
}
function calculateReceiptTotal(receiptItems) {
    let total = receiptItems.reduce((total, item) => {
        return total + item.subtotal;
    }, 0);
    return {
        receiptItems: receiptItems,
        total: total
    };
}
function calculateReceiptItems(items) {
    items.forEach(item => {
        item.subtotal = item.price * item.count;
    });
    return promoteReceiptItems(items);
}
function promoteReceiptItems(items) {
    items.forEach(item => {
        if (loadPromotions()[0].barcodes.includes(item.barcode) && item.count > 2) item.subtotal -= item.price;
    });
    return items;
}
