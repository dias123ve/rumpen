const Program = require("../model/model-program");
const path = require("path");
const ExcelJS = require('exceljs');
// const urlBase = "http://localhost:4000"
module.exports = {
    getAllProgram: async(req, res, next) => {
        try {
            const programs = await Program.find()
            return res.status(200).json({data: programs});
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    getDetailProgram:async (req, res, next) => {
        try {
            const program = await Program.findById(req.params.id);
            return res.status(200).json({data: program});
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    uploadProgram: async (req, res, next) => {
        try {
            const { nama } = req.body;
            const { file } = req.files;
    
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.data);
    
            const worksheet = workbook.worksheets[0];
            const finalData = [];
            const nama_lengkap = [];
            const link_gd = [];
            
            const namaColumn = worksheet.getColumn(2);
            const linkColumn = worksheet.getColumn(3);
    
            // Melakukan iterasi melalui setiap sel dalam kolom kedua
            namaColumn.eachCell((cell, rowNumber) => {
                console.log(cell.value)
                if (rowNumber > 1) nama_lengkap.push(cell.value);
            });
    
            // Melakukan iterasi melalui setiap sel dalam kolom ketiga
            linkColumn.eachCell((cell, rowNumber) => {
                if (rowNumber > 1) {
                    const splittedLink = cell.value.split('/file/d/')
                    const secondSplit = splittedLink[1].split('/view')
                    const finalLink = `${splittedLink[0]}/uc?export=download&id=${secondSplit[0]}`
                    link_gd.push(finalLink)
                };
            });
    
            if (link_gd.length === nama_lengkap.length) {
                for (let i = 0; i < link_gd.length; i++) {
                    finalData.push({
                        nama_lengkap: nama_lengkap[i],
                        link: link_gd[i]
                    });
                }
            } else {
                return res.status(400).json({ message: "Tolong liat lagi excel nya. Mungkin ada nama yang tidak ada link nya?" });
            }
    
            const data = await Program.create({
                nama,
                contents: finalData
            });
    
            return res.status(200).json({ data });
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    delete: async(req, res, next) =>{
        try {
            const data = await Program.findByIdAndDelete(req.params.id);
            return res.status(200).json({ data });
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}