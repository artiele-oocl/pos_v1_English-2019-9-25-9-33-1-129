'use strict';

describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expected = '***<store earning no money>Receipt ***\n' +
      'Name: Sprite, Quantity: 5 bottles, Unit: 3.00(yuan), Subtotal: 12.00(yuan)\n' +
      'Name: Litchi, Quantity: 2.5 pounds, Unit: 15.00(yuan), Subtotal: 37.50(yuan)\n' +
      'Name: Instant Noodles, Quantity: 3 bags, Unit: 4.50(yuan), Subtotal: 9.00(yuan)\n' +
      '----------------------\n' +
      'Total: 58.50(yuan)\n' +
      'Discounted prices: 7.50(yuan)\n' +
      '**********************';

    expect(console.log).toHaveBeenCalledWith(expected);
  });

  it('should return list of decoded barcodes with corresponding counts', () => {
    const tags = ['ITEM000001', 'ITEM000002-7'];

    const result = decodeBarcodes(tags);

    const expected = [{
      barcode: 'ITEM000001',
      count: 1
    },
    {
      barcode: 'ITEM000002',
      count: 7
    }];

    expect(result).toEqual(expected);
  });

  it('should return items object from loadItems without count when decoded barcodes provided', () => {
    const decodedBarcodes = [{
      barcode: 'ITEM000001',
      count: 1
    }];

    const result = loadItems(decodedBarcodes);

    const expected = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      price: 3.00,
      unit: 'bottle'
    }];

    expect(result).toEqual(expected);
  });

  it('should return item object with count when decoded barcodes provided in combine items', () => {
    const decodedBarcodes = [{
      barcode: 'ITEM000001',
      count: 1
    }];

    const result = combineItems(decodedBarcodes);

    const expected = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      price: 3.00,
      unit: 'bottle',
      count: 1
    }];

    expect(result).toEqual(expected);
  });

  it('should return item object with count when decodeTags finds a dash "-"', () => {
    const tags = [
      'ITEM000001-5'
    ];

    const result = decodeTags(tags);

    const expected = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      price: 3.00,
      unit: 'bottle',
      count: 5
    }];

    expect(result).toEqual(expected);
  });

  it('should return adjust subtotal of receipt items when promotion is applied', () => {
    const items = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      price: 3.00,
      unit: 'bottle',
      count: 3,
      subtotal: 9.00
    },
    {
      barcode: 'ITEM000002',
      name: 'Apple',
      price: 5.50,
      unit: 'pound',
      count: 2,
      subtotal: 11.00
    }];

    const result = promoteReceiptItems(items);

    const expected = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      price: 3.00,
      unit: 'bottle',
      count: 3,
      subtotal: 6.0
    },
    {
      barcode: 'ITEM000002',
      name: 'Apple',
      price: 5.50,
      unit: 'pound',
      count: 2,
      subtotal: 11.00
    }];

    expect(result).toEqual(expected);
  });

  it('should return grand total of items without promotions when receiptItems is provided to calculateReceiptTotal', () => {
    const receiptItems = [{
      barcode: 'ITEM000001',
      name: 'Sprite',
      price: 3.00,
      unit: 'bottle',
      count: 2,
      subtotal: 6.00
    },
    {
      barcode: 'ITEM000002',
      name: 'Apple',
      price: 5.50,
      unit: 'pound',
      count: 2,
      subtotal: 11.00
    }];

    const result = calculateReceiptTotal(receiptItems);

    const expected = {
      receiptItems: [{
        barcode: 'ITEM000001',
        name: 'Sprite',
        price: 3.00,
        unit: 'bottle',
        count: 2,
        subtotal: 6.00
      },
      {
        barcode: 'ITEM000002',
        name: 'Apple',
        price: 5.50,
        unit: 'pound',
        count: 2,
        subtotal: 11.00
      }],
      total: 17.00
    };

    expect(result).toEqual(expected);
  });

  it('should return grand total of items with savings when promoted receiptItems is provided to calculateReceiptSavings', () => {
    const receipt = {
      receiptItems: [{
        barcode: 'ITEM000001',
        name: 'Sprite',
        price: 3.00,
        unit: 'bottle',
        count: 3,
        subtotal: 6.00
      },
      {
        barcode: 'ITEM000002',
        name: 'Apple',
        price: 5.50,
        unit: 'pound',
        count: 2,
        subtotal: 11.00
      }],
      total: 17.00
    };

    const result = calculateReceiptSavings(receipt);

    const expected = {
      receiptItems: [{
        barcode: 'ITEM000001',
        name: 'Sprite',
        price: 3.00,
        unit: 'bottle',
        count: 3,
        subtotal: 6.00
      },
      {
        barcode: 'ITEM000002',
        name: 'Apple',
        price: 5.50,
        unit: 'pound',
        count: 2,
        subtotal: 11.00
      }],
      total: 17.00,
      savings: 3.00
    };

    expect(result).toEqual(expected);
  });
});
