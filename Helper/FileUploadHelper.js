const path = require("path");
const fs = require("fs");

const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        try {
            if (!file) return reject("No file provided");

            const folderName = "uploads";
            // Ensure the uploads directory exists
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName, { recursive: true });
            }

            // Generate a unique file name
            const timeStamp = Date.now();
            //console.log("timeStamp", timeStamp)
            const ext = path.extname(file.name);
            //console.log("ext", ext)
            const baseName = path.basename(file.name, ext);
            //console.log("baseName", baseName)
            const uniqueFileName = `${baseName}-${timeStamp}${ext}`;
            //console.log("uniquename", uniqueFileName)

            const uploadPath = path.join(folderName, uniqueFileName);
            //console.log("uploadPath", uploadPath)

            file.mv(uploadPath, (err) => {
                if (err) return reject(err);
                resolve(uploadPath); 
            });
        } catch (err) {
            
            reject(err);
        }
    });
};

module.exports = { uploadFile };
