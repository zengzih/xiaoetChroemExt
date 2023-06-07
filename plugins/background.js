const fs = require('fs');
const path = require('path');

const copyFile = (OriginFilePath, CopyFilePath)=> {
    if (!fs.existsSync(CopyFilePath)) {
        fs.mkdirSync(CopyFilePath);
    }
    fs.readdir(OriginFilePath,{withFileTypes:true},(err,files)=>{
        for(let file of files){
            if(!file.isDirectory()){
                const OriginFile = path.resolve(OriginFilePath, file.name)
                const CopyFile = path.resolve(CopyFilePath,file.name)
                fs.copyFileSync(OriginFile,CopyFile)
            }else{
                const CopyDirPath = path.resolve(CopyFilePath,file.name)
                const OriginDirPath = path.resolve(OriginFilePath,file.name)
                fs.mkdirSync(CopyDirPath)
                copyFile(OriginDirPath,CopyDirPath)
            }
        }
    })
}

const moveBackground = ()=> {
    const folderPath = path.join(__dirname, '..', 'chromeExtensions/background');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    const sourcePath = path.join(__dirname, '..', 'static/background/index.js');
    const descPath = path.join(__dirname, '..', 'chromeExtensions/background/index.js');
    fs.copyFileSync(sourcePath, descPath)
    fs.copyFileSync(path.join(__dirname, '..', 'static/manifest.json'), path.join(__dirname, '..', 'chromeExtensions/manifest.json'))
};

const copyImgs = ()=> {
    const sourcePath = path.join(__dirname, '..', 'static/imgs');
    const descPath = path.join(__dirname, '..', 'chromeExtensions/images');
    // fs.cpSync(sourcePath, descPath, { force: true, recursive: true });
    copyFile(sourcePath, descPath);
};

class ChromeBackgroundPlugin {
    apply(compile) {
        compile.hooks.afterEmit.tapAsync('moveBackground', (compilation, callback)=> {
            moveBackground();
            copyImgs();
            callback();
        })
    }
}

module.exports = ChromeBackgroundPlugin;
