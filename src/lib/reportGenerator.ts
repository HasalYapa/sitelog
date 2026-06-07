import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Task } from './ganttScheduler';

export const generateRFIReport = async (projectTitle: string, tasks: Task[]) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  let yPos = margin;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('REQUEST FOR INFORMATION (RFI)', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
  yPos += 30;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${projectTitle}`, margin, yPos);
  
  const rfiNo = `RFI-${new Date().getTime().toString().slice(-6)}`;
  doc.text(`RFI No: ${rfiNo}`, doc.internal.pageSize.width - margin - 100, yPos);
  yPos += 15;
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - margin - 100, yPos);
  
  doc.line(margin, yPos + 10, doc.internal.pageSize.width - margin, yPos + 10);
  yPos += 30;

  // RFI Details Block
  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    body: [
      [{ content: 'To (Consultant/Client):', styles: { fontStyle: 'bold', fillColor: [240,240,240] } }, ''],
      [{ content: 'From (Contractor):', styles: { fontStyle: 'bold', fillColor: [240,240,240] } }, 'SiteLog Pro Management'],
      [{ content: 'Subject:', styles: { fontStyle: 'bold', fillColor: [240,240,240] } }, 'Information required for scheduled upcoming tasks'],
    ],
    columnStyles: { 0: { cellWidth: 150 } },
    styles: { fontSize: 10, cellPadding: 5 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFont('helvetica', 'bold');
  doc.text('1. Description of Request:', margin, yPos);
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  doc.text('Please verify and provide additional details/drawings for the following scheduled tasks:', margin, yPos);
  yPos += 15;

  const upcomingTasks = tasks.filter(t => t.start_date != null).slice(0, 5).map(t => [t.wbs, t.task_name, t.start_date?.toLocaleDateString() || '-']);
  autoTable(doc, {
    startY: yPos,
    head: [['WBS', 'Task Name', 'Start Date']],
    body: upcomingTasks.length > 0 ? upcomingTasks : [['-', 'No upcoming tasks scheduled', '-']],
    theme: 'plain',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5, lineColor: [200, 200, 200], lineWidth: 0.5 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 30;

  doc.setFont('helvetica', 'bold');
  doc.text('2. Proposed Solution / Contractor\'s Recommendation:', margin, yPos);
  yPos += 10;
  doc.rect(margin, yPos, doc.internal.pageSize.width - 2 * margin, 60);
  yPos += 80;

  doc.text('3. Potential Impacts:', margin, yPos);
  yPos += 15;
  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    body: [
      ['Schedule Impact?', '[   ] Yes   [   ] No', 'Days: ........'],
      ['Cost Impact?', '[   ] Yes   [   ] No', 'Amount: ........']
    ],
    styles: { fontSize: 10, cellPadding: 5 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 30;

  // Signatures
  doc.text('Requested by (Name/Sign): _______________________', margin, yPos);
  doc.text('Date: ____________', doc.internal.pageSize.width - margin - 150, yPos);

  yPos += 50;
  doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
  yPos += 20;

  doc.setFontSize(12);
  doc.text('CONSULTANT / CLIENT RESPONSE', margin, yPos);
  yPos += 15;
  doc.rect(margin, yPos, doc.internal.pageSize.width - 2 * margin, 100);
  yPos += 120;
  
  doc.setFontSize(10);
  doc.text('Responded by (Name/Sign): _______________________', margin, yPos);
  doc.text('Date: ____________', doc.internal.pageSize.width - margin - 150, yPos);

  doc.save(`${rfiNo}_ISO_Format.pdf`);
};

export const generateDPRReport = async (projectTitle: string, tasks: Task[]) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  let yPos = margin;

  // Header Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DAILY PROGRESS REPORT (DPR)', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
  yPos += 20;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dprNo = `DPR-${new Date().getTime().toString().slice(-6)}`;
  doc.text(`Project: ${projectTitle}`, margin, yPos);
  doc.text(`Report No: ${dprNo}`, doc.internal.pageSize.width - margin - 150, yPos);
  yPos += 15;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
  doc.text(`Working Hours: 08:00 - 17:00`, doc.internal.pageSize.width - margin - 150, yPos);
  
  doc.line(margin, yPos + 10, doc.internal.pageSize.width - margin, yPos + 10);
  yPos += 30;

  // Weather block
  let weatherText = 'Sunny / Clear';
  try {
    const loc = localStorage.getItem('projectLocation') || 'Colombo';
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1`);
    const geoData = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      const gLoc = geoData.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${gLoc.latitude}&longitude=${gLoc.longitude}&current=temperature_2m,weather_code&timezone=auto`);
      const wData = await weatherRes.json();
      weatherText = `${wData.current.temperature_2m} C - code ${wData.current.weather_code}`;
    }
  } catch(e) {}

  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    body: [
      [{ content: 'Weather Condition:', styles: { fontStyle: 'bold', fillColor: [240,240,240] } }, weatherText],
    ],
    styles: { fontSize: 9, cellPadding: 4 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Work Executed (Schedule Linked)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Activities in Progress (Schedule)', margin, yPos);
  yPos += 10;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find tasks that might be active today
  const activeTasks = tasks.filter(t => {
    if (!t.start_date || !t.finish_date) return false;
    const st = new Date(t.start_date);
    const fn = new Date(t.finish_date);
    st.setHours(0, 0, 0, 0);
    fn.setHours(0, 0, 0, 0);
    return today >= st && today <= fn;
  }).map(t => [t.wbs, t.task_name, t.start_date?.toLocaleDateString() || '', t.finish_date?.toLocaleDateString() || '']);

  autoTable(doc, {
    startY: yPos,
    head: [['WBS', 'Task Description', 'Start Date', 'End Date']],
    body: activeTasks.length > 0 ? activeTasks : [['-', 'No scheduled tasks active today', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Fetch real workforce
  let workforceRows: string[][] = [];
  try {
    const wSnap = await getDocs(collection(db, 'workforce'));
    workforceRows = wSnap.docs.map(doc => [doc.data().category || doc.id, doc.data().count?.toString() || '0']);
  } catch(e) {}

  // Fetch real machinery
  let machineryRows: string[][] = [];
  try {
    const mSnap = await getDocs(collection(db, 'machinery'));
    machineryRows = mSnap.docs.map(doc => [doc.data().name || '-', doc.data().status || '-']);
  } catch(e) {}

  // 2-column layout for Workforce and Machinery
  if (yPos > doc.internal.pageSize.height - 200) {
    doc.addPage();
    yPos = margin;
  }

  const colWidth = (doc.internal.pageSize.width - 2 * margin - 20) / 2;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Workforce', margin, yPos);
  
  autoTable(doc, {
    startY: yPos + 10,
    margin: { left: margin, right: margin + colWidth + 20 },
    head: [['Category', 'Count']],
    body: workforceRows.length > 0 ? workforceRows : [['-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  const workerTableY = (doc as any).lastAutoTable.finalY;

  doc.text('3. Equipment / Machinery', margin + colWidth + 20, yPos);
  autoTable(doc, {
    startY: yPos + 10,
    margin: { left: margin + colWidth + 20, right: margin },
    head: [['Item', 'Status']],
    body: machineryRows.length > 0 ? machineryRows : [['-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  const machineryTableY = (doc as any).lastAutoTable.finalY;
  yPos = Math.max(workerTableY, machineryTableY) + 20;

  if (yPos > doc.internal.pageSize.height - 150) {
    doc.addPage();
    yPos = margin;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Details / Issues / Delays', margin, yPos);
  yPos += 10;
  doc.rect(margin, yPos, doc.internal.pageSize.width - 2 * margin, 50);

  yPos += 80;

  // Signatures
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Prepared By (Contractor): _______________________', margin, yPos);
  doc.text('Checked By (Consultant): _______________________', doc.internal.pageSize.width - margin - 250, yPos);

  doc.save(`${dprNo}_ISO_Format.pdf`);
};

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
