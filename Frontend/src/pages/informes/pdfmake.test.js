import test from 'node:test';
import assert from 'node:assert/strict';
import pdfMake from 'pdfmake/build/pdfmake.js';
import 'pdfmake/build/vfs_fonts.js';

test('pdfmake 0.3 genera informes con el layout personalizado', async () => {
  pdfMake.tableLayouts = {
    customLayout: {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
    },
  };

  const pdf = pdfMake.createPdf({
    content: [{ table: { body: [['Riesgo']] }, layout: 'customLayout' }],
  });
  const buffer = await pdf.getBuffer();

  assert.equal(buffer.subarray(0, 4).toString(), '%PDF');
});
