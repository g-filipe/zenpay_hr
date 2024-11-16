import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Department, Employee, MealVoucher, Workdays } from '@prisma/client';
import { formatForBrazilianReal } from 'utils.js';

type ReportData = {
  employee: Employee;
  departments: Department[];
  leaderName?: string;
  workdays: Workdays;
  mealVoucher: MealVoucher;
};

export async function exportToPDF(reportDataList: ReportData[], filePath: string) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  function breakLine(doc: any, lines = 1) {
    const lineHeight = 15;
    doc.y += lines * lineHeight;
  }

  function formatTitle(title: string) {
    doc.fillColor('blue').font('Helvetica-Bold').fontSize(14).text(`${title}`, { align: 'right' });
    restoreColorDefault();
  }

  function restoreColorDefault() {
    const colorDefault = 'black';
    return doc.fillColor(colorDefault);
  }

  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .text(
      `Relatório de Vale Alimentação/Refeição ${reportDataList[0].mealVoucher.month}/${reportDataList[0].mealVoucher.year}`,
      { align: 'center' }
    );
  breakLine(doc, 3);

  reportDataList.sort((a, b) => a.employee.name.localeCompare(b.employee.name));

  reportDataList.forEach(({ employee, departments, leaderName, workdays, mealVoucher }: ReportData) => {
    doc.lineGap(4);
    formatTitle('Info. Colaborador(a)');
    separator();
    breakLine(doc);
    doc.font('Helvetica-Bold').fontSize(12).text('Matrícula: ', { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${employee.id}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Colaborador(a): ', { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${employee.name}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Departamento(s): ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${departments.map((department) => department.name).join(', ')}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Liderança: ', { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${leaderName}\n`);
    breakLine(doc);

    formatTitle('Espelho de Ponto');
    separator();

    doc.font('Helvetica-Bold').fontSize(12).text('\nTotal de Dias Trabalhados: ', { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${workdays.total_worked_days}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Dias Trabalhados: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${workdays.worked_days.length == 0 ? "-" : workdays.worked_days.join(', ')}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Total de Dias Trabalhados (Jornada 8h): ', { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${workdays.worked_8h}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Dias Trabalhados (Jornada 8h): ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${workdays.worked_days_8h.length == 0 ? 0 : workdays.worked_days_8h.join(', ')}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Total de Dias Trabalhados (Jornada 6h): ', { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${workdays.worked_6h}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Dias Trabalhados (Jornada 6h): ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${workdays.worked_days_6h.length == 0 ? 0 : workdays.worked_days_6h.join(', ')}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Faltas injustificadas no período: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${workdays.unjustified_absences.length == 0 ? 0 : workdays.unjustified_absences.join(', ')}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Faltas injustificadas no período anterior: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(
        `${
          mealVoucher.unjustified_absences_previous_month.length == 0
            ? 0
            : mealVoucher.unjustified_absences_previous_month.join(', ')
        }`
      );

    doc.font('Helvetica-Bold').fontSize(12).text('Férias: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${workdays.vacation.length == 0 ? '-' : workdays.vacation.join(', ')}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Período de licença: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${workdays.unpaid_leave.length == 0 ? '-' : workdays.unpaid_leave.join(', ')}\n`);

    breakLine(doc);
    formatTitle('Sumário Vale-Alimentação');
    separator();

    doc.font('Helvetica-Bold').fontSize(12).text('\nTotal Vale-Alimentação/Refeição Jornada 8h: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${formatForBrazilianReal(mealVoucher.total_value_8h)}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Total Vale-Alimentação/Refeição Jornada 6h: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${formatForBrazilianReal(mealVoucher.total_value_6h)}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Total Descontos Jornada 8h: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${formatForBrazilianReal(mealVoucher.total_discount_8h)}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Total Descontos Jornada 6h: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${formatForBrazilianReal(mealVoucher.total_discount_6h)}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Descontos totais: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${formatForBrazilianReal(mealVoucher.total_days_discounted)}`);

    doc.font('Helvetica-Bold').fontSize(12).text('Total do Benefício: ', { continued: true });
    doc
      .font('Helvetica')
      .fontSize(11)
      .text(`${formatForBrazilianReal(mealVoucher.amount)}`);

    if (reportDataList.length == 1) {
      return;
    }

    doc.addPage();
  });

  function separator() {
    doc.moveTo(70, doc.y).lineTo(530, doc.y).stroke();
  }

  doc.end();

  stream.on('finish', () => {
    console.log(`PDF criado com sucesso em: ${filePath}`);
  });

  stream.on('error', (err) => {
    console.error('Erro ao criar o PDF:', err);
  });
}
