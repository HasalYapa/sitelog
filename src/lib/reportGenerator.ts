import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export const generatePDFReport = async (projectTitle: string, reportType: string, dateStr: string) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  let yPos = margin;

  // Header Title
  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175); // brand-blue
  doc.text(projectTitle, margin, yPos);
  yPos += 30;

  // Subtitle
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Report Type: ${reportType}`, margin, yPos);
  yPos += 20;
  doc.text(`Generated On: ${dateStr}`, margin, yPos);
  yPos += 30;

  // Draw separator line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(1);
  doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
  yPos += 30;

  // 1. Fetch Weather Data
  try {
    const loc = localStorage.getItem('projectLocation') || 'Colombo';
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1`);
    const geoData = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      const gLoc = geoData.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${gLoc.latitude}&longitude=${gLoc.longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`);
      const wData = await weatherRes.json();
      
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Weather Overview', margin, yPos);
      yPos += 20;
      
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // slate-600
      const weatherText = `Location: ${gLoc.name}, ${gLoc.country} | Temp: ${wData.current.temperature_2m}°C | Wind: ${wData.current.wind_speed_10m} km/h | Humidity: ${wData.current.relative_humidity_2m}%`;
      doc.text(weatherText, margin, yPos);
      yPos += 30;
    }
  } catch (err) {
    console.error('Failed to fetch weather for report', err);
  }

  // 2. Daily Logs
  try {
    const logsSnap = await getDocs(query(collection(db, 'daily_logs'), orderBy('timestamp', 'desc'), limit(15)));
    const logs = logsSnap.docs.map(doc => {
      const data = doc.data();
      return [
        data.timestamp?.toDate ? data.timestamp.toDate().toLocaleDateString() : dateStr,
        data.subcontractor || 'N/A',
        data.summary || '-',
        data.milestones || '-'
      ];
    });

    if (logs.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('Recent Daily Logs', margin, yPos);
      yPos += 15;

      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Subcontractor', 'Summary', 'Milestones']],
        body: logs,
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 6 },
        columnStyles: { 2: { cellWidth: 150 }, 3: { cellWidth: 150 } },
      });
      yPos = (doc as any).lastAutoTable.finalY + 30;
    }
  } catch (err) {
    console.error('Failed to fetch logs', err);
  }

  // 3. Workforce
  try {
    const workforceSnap = await getDocs(collection(db, 'workforce'));
    const workforce = workforceSnap.docs.map(doc => {
      const data = doc.data();
      return [data.category || doc.id, data.count?.toString() || '0'];
    });

    // Check if new page needed
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = margin;
    }

    if (workforce.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('Workforce Breakdown', margin, yPos);
      yPos += 15;

      const totalWorkforce = workforceSnap.docs.reduce((sum, doc) => sum + (doc.data().count || 0), 0);

      autoTable(doc, {
        startY: yPos,
        head: [['Category', 'Count']],
        body: [...workforce, [{ content: 'Total', styles: { fontStyle: 'bold' } }, { content: totalWorkforce.toString(), styles: { fontStyle: 'bold' } }]],
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 6 },
      });
      yPos = (doc as any).lastAutoTable.finalY + 30;
    }
  } catch (err) {
    console.error('Failed to fetch workforce', err);
  }

  // 4. Machinery
  try {
    const machinerySnap = await getDocs(collection(db, 'machinery'));
    const machinery = machinerySnap.docs.map(doc => {
      const data = doc.data();
      return [data.name || '-', data.id || '-', data.status || 'Unknown', `${data.hours || 0} hrs`];
    });

    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = margin;
    }

    if (machinery.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('Machinery Status', margin, yPos);
      yPos += 15;

      autoTable(doc, {
        startY: yPos,
        head: [['Equipment Name', 'ID', 'Status', 'Logged Hours']],
        body: machinery,
        theme: 'striped',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 6 },
      });
    }
  } catch (err) {
    console.error('Failed to fetch machinery', err);
  }

  // Save the PDF
  const filename = `Report_${reportType.replace(/\s+/g, '_')}_${dateStr.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
};
