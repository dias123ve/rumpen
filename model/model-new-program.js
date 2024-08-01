const mongoose = require("mongoose");
const modelNewProgram = new mongoose.Schema({
  nama_program: {
    type: String,
    required: true,
  },
  template_design: {
    type: String,
  },
  peserta: [
    {
      nama: {
        type: String,
      },
      intansi: {
        type: String,
      },
    },
  ],
});

const NewProgram = mongoose.model("NewProgram", modelNewProgram);
module.exports = NewProgram;
