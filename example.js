const ReadPDF = require('./index');
var readPDF = new ReadPDF('/pdf/slide.pdf', {
    outputName: 'testpdf',
    extension: 'jpg'
});

//convert pageNumber to image
readPDF.convertPage(0).then((imagePath) => {
    console.log(imagePath)
        // /pdf/testpdf-0.jpg
}, err => {
    console.log(err)
});

// get pdfinfo
readPDF.pdfInfo().then((info) => {
    console.log(info);
    // { Creator: 'Adobe Acrobat 7.0',
    //   Producer: 'Adobe Acrobat 7.0 Image Conversion Plug-in',
    //   CreationDate: 'Fri Jul 15 17:13:46 2016',
    //   ModDate: 'Fri Jul 15 17:16:26 2016',
    //   Tagged: 'yes',
    //   Form: 'none',
    //   Pages: '26',
    //   Encrypted: 'no',
    //   'Page size': '534.24 x 720 pts (rotated 0 degrees)',
    //   'File size': '5891714 bytes',
    //   Optimized: 'yes',
    //   'PDF version': '1.6' }
    //
})

//get pdf pageNumbers base on readPDF.pdfInfo()
readPDF.pageNumbers().then((pageNumbers) => {
    console.log(pageNumbers);
    // { Pages: '26' }
}, err => {
    console.log(err)
})

//Convert pages,default convert all pages
let arr = [0, 1, 2, 3];
readPDF.convertPages(arr).then(re => {
    console.log(re);
    //['/pdf/testpdf-0.jpg',
    // '/pdf/testpdf-1.jpg',
    // '/pdf/testpdf-2.jpg',
    // '/pdf/testpdf-3.jpg'
    //]
}, err => {
    console.log(err)
});