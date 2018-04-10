// reading this file synchronously as it is a known size
const products = require('./products');
const PackageService = require('./PackageService');
const orderFileName = './datafile';

let fs = require('fs');

/**
 * A solution for bakery challenge, expanded to allow testing
 */
class Bakery {

    constructor() {
        this.packageService = new PackageService();
    }

    readOrderFile() {
        let orderContent = fs.readFileSync(orderFileName);
        orderContent = orderContent ? orderContent.toString() : '';

        // Remove any empty lines
        let lines = orderContent.split(/\r\n|\n/).filter(line => {
            return line && line.trim();
        });
        return lines;
    }

    processOrder() {
        let self = this;
        let orders = this.readOrderFile();

        orders.forEach(function (lineItem){
            var that = this;
            let items = lineItem.split(" ");
            let orderQuantity = items[0];
            let orderProduct = items[1];

            let itemInStock = products.find((item) => {
                return item.itemCode === orderProduct;
            });

            if (itemInStock) {

                let packageDenominations = new Array();
                itemInStock.packs.forEach(function (thePack) {
                    packageDenominations.push(thePack.packSize);
                });

                // sort package by largest first to meet test requirements (assuming these were defined as integers)
                let orderLine = that.packageService.calculatePackages(itemInStock.packs, orderQuantity);

                console.log(orderQuantity, orderProduct, '$' + orderLine.getTotalPrice().toFixed(2));

                let packs = orderLine.getItemPacks();
                packs.forEach(function(pack) {
                   console.log('       ', pack.getQuantity(), 'x', pack.getPackSize(), '$' + pack.getUnitPrice());
                });

                console.log();

            } else {
                console.log('Could not find %s in stock', orderProduct);
            }

        }, self);

    }

}

var aBakery = new Bakery();
aBakery.processOrder();