/* eslint-disable new-cap */
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Test = () => {
  const zipping = async () => {
    try {
      const zip = new JSZip();
      const Pdf = new jsPDF({
        orientation: 'l',
        unit: 'pt',
        format: 'A4',
        compress: true,
      });

      const array = Array(5).fill(0);
      const wait = new Promise((resolve, reject) => {
        array.forEach(async (e, i, a) => {
          const input = document.getElementById('image');
          const data = await html2canvas(input);
          const image = data.toDataURL('image/png');
           Pdf.addImage(image, 'PNG', 0, 0, data.width, data.height);
          const blob = Pdf.output('blob');
          zip.file(`${i}.pdf`, blob);
          if (i === a.length - 1) resolve();
        });
      });

      wait.then(() => zip.generateAsync({ type: 'blob' }).then((blob) => {
          saveAs(blob, 'filename.zip');
        }));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div onClick={zipping} id="image">
      <img src="/images/logo-bri.png" />
    </div>
  );
};

export default Test;
