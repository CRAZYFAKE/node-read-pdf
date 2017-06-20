const
    ReadPDF = require('../index'),
    expect = require('chai').expect;

let path = process.cwd() + '/tests/test.pdf';

let readPDF = new ReadPDF(path, {
    outputName: 'testpdf',
    extension: 'jpg'
});

describe('[CORRECT] read-pdf tests PDF infomation && convert', function() {

    //pdfInfo()
    it('test pdfInfo()', function() {
        readPDF.pdfInfo().then(info => {
            expect(info).to.be.an('object');
        })
    });

    //pageNumbers()
    it('test pageNumbers()', function() {
        readPDF.pageNumbers().then(pageNumbers => {
            expect(pageNumbers).to.be.an('object');
        })
    });


    //pageNumbers() Pages should be string
    it('test pageNumbers() Pages should be string', function() {
        readPDF.pageNumbers().then(pageNumbers => {
            expect(pageNumbers['Pages']).to.be.an('string');
        })
    });

    //convertPage() convert single page
    it('test convertPage()', function() {
        //Convert page one to image
        readPDF.convertPage(0).then(imagePath => {
            expect(imagePath).to.be.an('string');
        })
    });

    //convertPage() convert multi pages
    it('test convertPages()', function() {
        //Convert multi pages to image
        readPDF.convertPages([0, 1, 2, 3, 4, 5]).then(imagePaths => {
            expect(imagePaths.length).to.be.equal(3);
        })
    });

});