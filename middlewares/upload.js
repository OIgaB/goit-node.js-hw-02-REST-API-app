import multer from 'multer';  // текстові поля перетворює на об'єкт і записує в req.body, 
                              // а файли зберігає в тимчас. папці (temp) і передає контролеру дані про цей файл (req.file)
import path from 'path';
import Jimp from "jimp";  //image processing library for Node.js (resizing, cropping, applying filters...)


const destination = path.resolve('temp'); // шлях до папки з файлом // C:\Users\Olga\Desktop\GitHub\goit-node.js-hw-02-REST-API-app\temp

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;  // 1E9 = 1 billion = 1 * 10^9
        const filename = `${uniquePrefix}_${file.originalname}`;  //створюємо унікальне і'мя файла
        // file: {
        //     fieldname: 'avatar',
        //     originalname: 'drink.jpg',
        //     encoding: '7bit',
        //     mimetype: 'image/jpeg'
        // }

        // Jimp.read(filename)
        //     .then(image => {
        //         return image
        //         .resize(30, 250) // resize
        //         .quality(60) // set JPEG quality
        //         .greyscale() // set greyscale
        //         .write(`${destination}/${filename}`); // save
        //     })
        //     .then(() => {
                cb(null, filename); // Once the image is processed and saved, call the callback with the new filename
            // })
            // .catch(err => {
            //     console.error(err);
            //     cb(err); // Call the callback with an error if there's any issue processing the image
            // });  
    }
})







// Обмеження по розміру файла
const limits = {
    fileSize: 1024 * 1024 * 5,  // 1024 байтів = 1 Kb; 1024 * 1024 = 1 Mb; 1024 * 1024 * 5 = 5 Mb 
}

const upload = multer({
    storage,
    limits,
});

export default upload;