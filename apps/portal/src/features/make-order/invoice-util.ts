import { Installment } from "@/types/sale-type";
import { Customer } from "@/app/(root)/sales/create/page";

export const handlePrintReceipt = (
    orderNumber: string,
    companyInfo: { name: string; address: string; phone: string; email: string; website: string; taxId: string },
    selectedCustomer: Customer | null,
    orderItems: { name: string; price: number; quantity: number }[],
    calculateSubtotal: () => number,
    calculateTax: () => number,
    calculateTotal: () => number,
    paymentMethod: string,
    cardLastDigits: string,
    isPaid: boolean,
    partialPaymentAmount: number,
    installmentPlan: Installment[],
    deliveryAddress: string,
    discountAmount: number
) => {
    const printWindow = window.open("", "_blank");

    printWindow?.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-info { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #eee; padding: 8px; text-align: left; }
            .items-table th { background-color: #f9f9f9; }
            .totals { margin-left: auto; width: 300px; }
            .totals table { width: 100%; }
            .totals table td { padding: 5px; }
            .totals table td:last-child { text-align: right; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>${companyInfo.name}</h1>
              <p>${companyInfo.address}</p>
              <p>Phone: ${companyInfo.phone} | Email: ${companyInfo.email}</p>
              <p>Website: ${companyInfo.website} | Tax ID: ${companyInfo.taxId}</p>
              <h2>RECEIPT</h2>
            </div>

            <div class="company-info">
              <h3>Order Information</h3>
              <p><strong>Order Number:</strong> ${orderNumber}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
            </div>

            <div class="customer-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${selectedCustomer?.name}</p>
              <p><strong>Email:</strong> ${selectedCustomer?.email}</p>
              <p><strong>Phone:</strong> ${selectedCustomer?.phone}</p>
              <p><strong>Address:</strong> ${deliveryAddress || selectedCustomer?.address}</p>
            </div>

            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems
                    .map((item) => {
                        const itemTotal = item.price * item.quantity;
                        const itemSubtotal = itemTotal;

                        return `
                    <tr>
                      <td>${item.name}</td>
                      <td>$${item.price}</td>
                      <td>${item.quantity}</td>
                      <td>$${itemSubtotal.toFixed(2)}</td>
                    </tr>
                  `;
                    })
                    .join("")}
              </tbody>
            </table>

            <div class="totals">
              <table>
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td>$${calculateSubtotal().toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Tax (10%):</strong></td>
                  <td>$${calculateTax().toFixed(2)}</td>
                </tr>
                ${
                    discountAmount > 0
                        ? `
                  <tr>
                    <td><strong>Discount:</strong></td>
                    <td>-$${discountAmount.toFixed(2)}</td>
                  </tr>
                `
                        : ""
                }
                <tr>
                  <td><strong>Total:</strong></td>
                  <td><strong>$${calculateTotal().toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>

            ${
                paymentMethod === "installment"
                    ? `
              <h3>Installment Plan</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Installment</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${installmentPlan
                      .map(
                          (installment) => `
                    <tr>
                      <td>${installment.id}</td>
                      <td>$${installment.amount.toFixed(2)}</td>
                      <td>${new Date(installment.dueDate).toLocaleDateString()}</td>
                      <td>${installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}</td>
                    </tr>
                  `
                      )
                      .join("")}
                </tbody>
              </table>
            `
                    : ""
            }

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>For any questions regarding this receipt, please contact us at ${companyInfo.email}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow?.document.close();
    printWindow?.focus();
    setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
    }, 250);
};

export const handleDownloadInvoice = (
    orderNumber: string,
    companyInfo: { name: string; address: string; phone: string; email: string; website: string; taxId: string },
    selectedCustomer: Customer | null,
    orderItems: { name: string; price: number; quantity: number }[],
    calculateSubtotal: () => number,
    calculateTax: () => number,
    calculateTotal: () => number,
    paymentMethod: string,
    cardLastDigits: string,
    isPaid: boolean,
    partialPaymentAmount: number,
    installmentPlan: Installment[],
    deliveryAddress: string,
    discountAmount: number
) => {
    const printWindow = window.open("", "_blank");

    printWindow?.document.write(`
      <html>
        <head>
          <title>Invoice - ${orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .company-logo { font-size: 24px; font-weight: bold; color: #ff6b00; }
            .company-details { text-align: right; }
            .invoice-title { text-align: center; margin: 20px 0; }
            .invoice-title h2 { margin: 0; color: #333; }
            .invoice-title p { margin: 5px 0; color: #666; }
            .parties { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .from-details, .to-details { width: 48%; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #eee; padding: 10px; text-align: left; }
            .items-table th { background-color: #f9f9f9; }
            .totals { margin-left: auto; width: 300px; }
            .totals table { width: 100%; }
            .totals table td { padding: 5px; }
            .totals table td:last-child { text-align: right; }
            .payment-info { margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div class="company-logo">
                ${companyInfo.name}
              </div>
              <div class="company-details">
                <p>${companyInfo.address}</p>
                <p>Phone: ${companyInfo.phone}</p>
                <p>Email: ${companyInfo.email}</p>
                <p>Website: ${companyInfo.website}</p>
                <p>Tax ID: ${companyInfo.taxId}</p>
              </div>
            </div>

            <div class="invoice-title">
              <h2>INVOICE</h2>
              <p>Invoice #: ${orderNumber}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="parties">
              <div class="from-details">
                <h3>From:</h3>
                <p><strong>${companyInfo.name}</strong></p>
                <p>${companyInfo.address}</p>
                <p>Phone: ${companyInfo.phone}</p>
                <p>Email: ${companyInfo.email}</p>
              </div>

              <div class="to-details">
                <h3>To:</h3>
                <p><strong>${selectedCustomer?.name}</strong></p>
                <p>${selectedCustomer?.email}</p>
                <p>${selectedCustomer?.phone}</p>
                <p>${deliveryAddress || selectedCustomer?.address}</p>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems
                    .map((item) => {
                        const itemTotal = item.price * item.quantity;
                        const itemSubtotal = itemTotal;

                        return `
                    <tr>
                      <td>${item.name}</td>
                      <td>$${item.price}</td>
                      <td>${item.quantity}</td>
                      <td>$${itemSubtotal.toFixed(2)}</td>
                    </tr>
                  `;
                    })
                    .join("")}
              </tbody>
            </table>

            <div class="totals">
              <table>
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td>$${calculateSubtotal().toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Tax (10%):</strong></td>
                  <td>$${calculateTax().toFixed(2)}</td>
                </tr>
                ${
                    discountAmount > 0
                        ? `
                  <tr>
                    <td><strong>Discount:</strong></td>
                    <td>-$${discountAmount.toFixed(2)}</td>
                  </tr>
                `
                        : ""
                }
                <tr>
                  <td><strong>Total:</strong></td>
                  <td><strong>$${calculateTotal().toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>

            ${
                paymentMethod === "installment"
                    ? `
              <div class="payment-info">
                <h3>Installment Plan</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${installmentPlan
                        .map(
                            (installment) => `
                      <tr>
                        <td>${installment.id}</td>
                        <td>$${installment.amount.toFixed(2)}</td>
                        <td>${new Date(installment.dueDate).toLocaleDateString()}</td>
                        <td>${installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}</td>
                      </tr>
                    `
                        )
                        .join("")}
                  </tbody>
                </table>
              </div>
            `
                    : ""
            }

            <div class="payment-info">
              <h3>Payment Information</h3>
              <p><strong>Payment Method:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
              ${paymentMethod === "card" ? `<p><strong>Card:</strong> **** **** **** ${cardLastDigits}</p>` : ""}
              ${!isPaid && paymentMethod !== "installment" ? `<p><strong>Payment Status:</strong> Partially Paid ($${partialPaymentAmount})</p>` : ""}
              ${paymentMethod === "installment" ? `<p><strong>Payment Status:</strong> First installment paid, remaining installments due as scheduled</p>` : ""}
            </div>

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>For any questions regarding this invoice, please contact us at ${companyInfo.email}</p>
              <p>Terms & Conditions Apply</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow?.document.close();
    printWindow?.focus();
    setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
    }, 250);
};
