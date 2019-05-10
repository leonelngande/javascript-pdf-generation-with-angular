import {Component, OnInit} from '@angular/core';
import * as jsPDF from 'jspdf';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-html-to-pdf',
  templateUrl: './html-to-pdf.component.html',
  styleUrls: ['./html-to-pdf.component.scss']
})
export class HtmlToPdfComponent implements OnInit {

  margins = {
    top: 70,
    bottom: 40,
    left: 30,
    width: 550,
  };
  paragraphs$: Observable<any[]>;

  constructor (private http: HttpClient) {}

  ngOnInit() {
    this.paragraphs$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/comments');
  }

  htmltoPDF(margins = this.margins) {
    // content is the html element which has to be converted to PDF
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.setFontSize(18);
    pdf.fromHTML(document.getElementById('content'),
      margins.left, // x coordinate
      margins.top,
      {
        // y coordinate
        width: margins.width// max width of content on PDF
      }, (dispose) => {
        this.headerFooterFormatting(pdf, pdf.internal.getNumberOfPages());
      },
      margins);

    const iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;');
    document.body.appendChild(iframe);

    iframe.src = pdf.output('datauristring');
    pdf.save('file.pdf');

  }

  headerFooterFormatting(doc, totalPages) {
    for (let i = totalPages; i >= 1; i--) {
      doc.setPage(i);
      // add header
      this.header(doc);

      // add page number to footer
      this.footer(doc, i, totalPages);
      doc.page++;
    }
  }

  header(doc, margins = this.margins) {
    doc.setFontSize(30);
    doc.setTextColor(40);
    doc.setFontStyle('normal');

    doc.text('Header Template', margins.left + 50, 40 );
    doc.setLineCap(2);
    // doc.line(3, 70, margins.width + 43, 70); // horizontal line
  }

  footer(doc, pageNumber, totalPages, margins = this.margins) {

    const str = 'Page ' + pageNumber + ' of ' + totalPages + ' By Leonel E.';

    doc.setFontSize(10);
    doc.text(str, margins.left, doc.internal.pageSize.height - 20);

  }

}
