/* eslint-disable new-cap */
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import Loading from '../components/loadingComponent/Loading';

const Test = () => {
  const array = Array(50).fill(0);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (loading) {
        zipping();
    }
  },[loading]);

  const triggerZip = () =>{
    setLoading(true);
  };

  const zipping = () => {
    const zip = new JSZip();
    const Pdf = new jsPDF({
      orientation: 'l',
      unit: 'pt',
      format: 'A4',
      compress: true,
    });

    const wait = new Promise((resolve, reject) => {
      const indexArray = [];
      array.forEach((e, i, a) => {
        const input = document.getElementById(`image${i}`);

        html2canvas(input).then(async (data) =>{
            const image = data.toDataURL('image/png');
            Pdf.addImage(image, 'PNG', 0, 0, data.width, data.height);
        });

        const blob = Pdf.output('blob');
        zip.file(`${i}.pdf`, blob);
        indexArray.push(i);
        if (indexArray.length === a.length) resolve();
      });
    });

    wait.then(() => zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'filename.zip');
        setLoading(false);
      }));
  };

  return (
    <div>
      {loading && <Loading />}
      {array.map((e, i) => (
        <div onClick={triggerZip} key={i} id={`image${i}`}>
          <img src="/images/logo-bri.png" />
        </div>
      ))}
    </div>
  );
};

export default Test;
