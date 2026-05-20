import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
export async function generateReceipt(items, total) {
const itemRows = items.map(item => `
<tr>
<td>${item.name}</td>
<td style="text-align:center">${item.quantity}</td>
<td style="text-align:right">$${item.price}</td>
<td style="text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
</tr>
`).join('')
const html = `
<html>
<head>
<style>
body { font-family: Arial, sans-serif; padding: 40px; color: #1A1A2E; }
.header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 32px; }
.shop-name { font-size: 24px; font-weight: bold; color: #6C63FF; }
.subtitle { font-size: 14px; color: #999; margin-top: 4px; }
.divider { border: none; border-top: 2px solid #F0F0F0; margin: 20px 0; }
.info { margin-bottom: 20px; }
.info-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
.info-label { color: #999; }
.info-value { font-weight: bold; color: #1A1A2E; }
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
th { background: #6C63FF; color: white; padding: 10px; font-size: 13px; text-align: left; }
th:nth-child(2) { text-align: center; }
th:nth-child(3), th:nth-child(4) { text-align: right; }
td { padding: 10px; font-size: 13px; border-bottom: 1px solid #F0F0F0; }
.total-row { background: #F8F8FF; }
.total-row td { font-weight: bold; font-size: 15px; }
.total-amount { color: #6C63FF; font-size: 18px; }
.footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
.thank-you { font-size: 18px; font-weight: bold; color: #6C63FF; margin-bottom: 4px; }
</style>
</head>
<body>
<div class="header">
<div class="logo">🛍️</div>
<div class="shop-name">ShopApp</div> <div class="subtitle">Order Receipt</div>
</div>
<hr class="divider" />
<div class="info">
<div class="info-row">
<span class="info-label">Receipt No:</span>
<span class="info-value">#${Math.floor(Math.random() * 100000)}</span>
</div>
<div class="info-row">
<span class="info-label">Date:</span>
<span class="info-value">${new Date().toLocaleDateString()}</span>
</div>
<div class="info-row">
<span class="info-label">Time:</span>
<span class="info-value">${new Date().toLocaleTimeString()}</span>
</div>
<div class="info-row">
<span class="info-label">Status:</span>
<span class="info-value" style="color: #4ade80">✅ Paid</span>
</div>
</div>
<hr class="divider" />
<table>
<thead>
<tr>
<th>Item</th>
<th>Qty</th>
<th>Price</th>
<th>Total</th>
</tr></thead><tbody>
${itemRows}
<tr class="total-row">
<td colspan="3">Total Amount</td>
 <td class="total-amount" style="text-align:right">$${total.toFixed(2)}</td>
</tr>
</tbody>
</table>
<hr class="divider" />
<div class="footer">
<div class="thank-you">Thank you for shopping! 🎉</div>
<div>ShopApp — Your favorite online store</div>
<div style="margin-top: 8px">For support: support@shopapp.com</div>
</div>
 </body>
</html>`
const { uri } = await Print.printToFileAsync({ html })
await Sharing.shareAsync(uri, {
mimeType: 'application/pdf',
dialogTitle: 'Save or Share your Receipt',
})
}