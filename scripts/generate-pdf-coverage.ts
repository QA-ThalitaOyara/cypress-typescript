import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

const coveragePath = path.resolve('coverage/api-coverage.json');
const outputPdf = path.resolve('coverage/api-coverage.pdf');

// Lê métricas
const data = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
const metrics = data.metrics;

async function generatePdf() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // HTML do dashboard simples
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>API Coverage Report</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h1 { text-align: center; }
        table { border-collapse: collapse; width: 50%; margin: 20px auto; }
        th, td { border: 1px solid #333; padding: 8px; text-align: center; }
        canvas { display: block; margin: 20px auto; }
      </style>
    </head>
    <body>
      <h1>API Coverage Report</h1>
      <canvas id="coverageChart" width="400" height="400"></canvas>

      <table>
        <thead>
          <tr>
            <th>Tag / Domain</th>
            <th>Total</th>
            <th>Critical</th>
            <th>Additional</th>
            <th>None</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(metrics.byTag).map(([tag, v]: any) =>
            `<tr>
              <td>${tag}</td>
              <td>${v.total}</td>
              <td>${v.critical}</td>
              <td>${v.additional}</td>
              <td>${v.none}</td>
            </tr>`
          ).join('')}
        </tbody>
      </table>

      <script>
        const ctx = document.getElementById('coverageChart').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Critical', 'Additional', 'None'],
            datasets: [{
              data: [${metrics.critical}, ${metrics.additional}, ${metrics.none}],
              backgroundColor: ['#4caf50', '#2196f3', '#f44336']
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      </script>
    </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPdf, format: 'A4', printBackground: true });

  await browser.close();
  console.log('✅ PDF generated at', outputPdf);
}

generatePdf();
