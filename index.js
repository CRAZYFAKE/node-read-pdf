/**
 * !
 * please install XPdf & ImageMagick
 */
const
    path = require("path"),
    fs = require("fs"),
    util = require("util"),
    exec = require("child_process").exec;

/**
 * ReadPDF construct 
 * @param {String} pdfPath  pdfpath
 * @param {Object} options      config
 */
function ReadPDF(pdfPath, options) {
    if (!options) options = {};
    this.pdfPath = pdfPath; //Path of pdf you want to convert
    this.outputFileName = options.outputName ? options.outputName : path.basename(pdfPath, ".pdf"); //The file name of you want to output
    this.convertOptions = options.convertOptions || {}; //Options with imagemagick
    this.extension = options.extension || "png"; //The extension of your output file,DEFAULT PNG
    this.outputDirectory = options.outputDirectory || path.dirname(pdfPath); //Output file directory
}

ReadPDF.prototype = {

    /**
     * Get PDF File info use XPdf
     * @return {Json}
     */
    pdfInfo: function() {
        var getInfoCommand = constructCommand('getInfo', { pdfPath: this.pdfPath });
        return new Promise(function(resolve, reject) {
            exec(getInfoCommand, function(err, stdout, stderr) {
                if (err) {
                    reject(err);
                } else {
                    resolve(format(stdout));
                }
            });
        });
    },

    /**
     * Get PDF File pages
     * @return {Promise} {Pages:'12']}
     */
    pageNumbers: function() {
        return new Promise((resolve, reject) => {
            this.pdfInfo().then((info) => {
                resolve({ Pages: info['Pages'] });
            }, (err) => {
                reject(err);
            });
        });
    },

    /**
     * Rename output filename
     * eg: <outputfilename>-<pageNumber>.<extension>
     * @param {Integer} pageNumber the page number of the pdf
     */
    getOutputImagePathForPage: function(pageNumber) {
        return path.join(
            this.outputDirectory,
            this.outputFileName + "-" + pageNumber + "." + this.extension
        );
    },

    /**
     * Convert pages of pdf
     * @param {Interger} pageNumber the number of pdf pages
     */
    convertPage: function(pageNumber) {
        var pdfPath = this.pdfPath;
        var outputImagePath = this.getOutputImagePathForPage(pageNumber);
        var convertCommand = constructCommand('convert', {
            pdfPath: this.pdfPath,
            convertOptions: this.convertOptions,
            pageNumber: pageNumber,
            outputImagePath: outputImagePath
        });

        var promise = new Promise(function(resolve, reject) {
            function convertPageToImage() {
                exec(convertCommand, function(err, stdout, stderr) {
                    if (err) {
                        reject(err);
                    }
                    resolve(outputImagePath);
                });
            }

            fs.stat(outputImagePath, function(err, imageFileStat) {
                var imageNotExists = err && err.code === "ENOENT";
                if (!imageNotExists && err) {
                    reject(err);
                }
                //If image not exist,then convert
                if (imageNotExists) {
                    convertPageToImage();
                } else {
                    //If image exist. check image.timestamp.if image.mtime < pdf.mtime then convert
                    fs.stat(pdfPath, function(err, pdfFileStat) {
                        if (err) {
                            reject(err);
                        }
                        if (imageFileStat.mtime < pdfFileStat.mtime) {
                            convertPageToImage();
                        }
                        resolve(outputImagePath);
                    });
                }
            });
        });
        return promise;
    },

    /**
     * convert pages
     * @param {Array} pageArr number array of pagenumbers
     * TIP : If param is undefined,then conver all pages,if param is an array,then convert valid pages
     */
    convertPages: function(pageArr) {
        return new Promise((resolve, reject) => {
            this.pageNumbers().then(totalNums => {
                try {
                    let pageNums = parseInt(totalNums['Pages']);
                    if (pageNums) {

                        let validArr = []; //store valid page numbers
                        //If pageArr exists and pagrArr is an Array
                        if (pageArr && isArray(pageArr)) {
                            for (let i = 0, arrLength = pageArr.length; i < arrLength; i++) {
                                let page = parseInt(pageArr[i]);
                                if (page >= 0 && page < pageNums) {
                                    validArr.push(page);
                                }
                            }
                            //If pageArr not exists,or pageArr is not an Array
                        } else {
                            for (let i = 0; i < pageNums; i++) {
                                validArr.push(i);
                            }
                        }

                        let convertList = [];
                        //Convert all valid pages
                        for (let i = 0, validLen = validArr.length; i < validLen; i++) {
                            convertList.push(this.convertPage(validArr[i]));
                        }
                        Promise.all(convertList).then(results => {
                            resolve(results);
                        }, err => {
                            reject(err);
                        });

                    } else {
                        throw new Error('There is no pages for your pdf file');
                    }
                } catch (error) {
                    reject(error);
                }
            }, err => {
                reject(err);
            });
        });
    }
};

/**
 * Generate command
 * @param {String} signal 
 * @param {Oject}  attach 
 */
function constructCommand(signal, attach) {
    let command = '';
    switch (signal) {
        case 'getInfo':
            command = util.format(
                "pdfinfo '%s'",
                attach.pdfPath
            );
            break;
        case "convert":
            let pdfPath = attach.pdfPath,
                convertOptionsString = format(attach.convertOptions);
            command = util.format(
                "%s %s'%s[%d]' '%s'",
                "convert",
                convertOptionsString ? convertOptionsString + " " : "",
                pdfPath, attach.pageNumber, attach.outputImagePath
            );
            break;
        default:
            break;
    }
    return command;
}

/**
 * Fromat String to Json
 * @param {String/Json} toBeformat 
 */
function format(toBeformat) {
    let _type = typeof toBeformat;
    let result = null;
    switch (_type) {
        case 'string':
            //Format pdf info
            result = {};
            toBeformat.split("\n").forEach(function(line) {
                if (line.match(/^(.*?):[ \t]*(.*)$/)) {
                    result[RegExp.$1] = RegExp.$2;
                }
            });
            break;
        case 'object':
            //Fromat Json to string with space
            result = Object.keys(toBeformat).sort().map(function(key) {
                if (toBeformat[key] !== null) {
                    return key + " " + toBeformat[key];
                } else {
                    return key;
                }
            }, this).join(" ");
            break;
        default:
            throw new Error('Type of param not allowed');
    }
    return result;
}

function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

module.exports = ReadPDF;