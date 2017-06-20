

# read-pdf  [![Build Status](https://travis-ci.org/CRAZYFAKE/node-read-pdf.svg?branch=master](https://travis-ci.org/CRAZYFAKE/node-read-pdf)

> Before use this module,you need install ImageMagick and Xpdf

1.Install ImageMagick

```shell
[root@localhost]:yum install -y ImageMagick
```

2.install Xpdf

[官网传送门](http://www.foolabs.com/xpdf/download.html)

[Linux package](ftp://ftp.foolabs.com/pub/xpdf/xpdfbin-linux-3.04.tar.gz)

[Windows package](ftp://ftp.foolabs.com/pub/xpdf/xpdfbin-win-3.04.zip)

[Mac Package](ftp://ftp.foolabs.com/pub/xpdf/xpdfbin-mac-3.04.tar.gz)

eg : Centos 6.5 Installation

```shell
[root@localhost xpdf]# tar -zxvf xpdfbin-linux-3.04.tar.gz
[root@localhost xpdf]# cd xpdfbin-linux-3.04
[root@localhost xpdfbin-linux-3.04]# cd bin64/
[root@localhost bin64]# cp ./* /usr/local/bin/
[root@localhost bin64]# cd ../doc/
[root@localhost doc]# mkdir -p /usr/local/man/man1
[root@localhost doc]# mkdir -p /usr/local/man/man5
[root@localhost doc]# cp *.1 /usr/local/man/man1
[root@localhost doc]# cp *.5 /usr/local/man/man5
[root@localhost xpdf]# cp sample-xpdfrc /usr/local/etc/xpdfrc
[root@localhost xpdf]# done
```

## Installation

```shell
$ npm install read-pdf
```

## Examples

```javascript
const ReadPDF = require("read-pdf");

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
```





