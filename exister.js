const fs = require("fs");

const exister = (path) => {
    let exist = true;
    try { fs.statSync(path); } 
    catch(err) { exist = false; }
    return exist;
};

module.exports = exister;