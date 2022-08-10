

module.exports.camera_validate = async (req, res, next) =>{
    try{
        let data = req.body;
  let error = "";

  if(data.stream_id === ""){
    error = error + "Stream Id Required, ";
  }
  if(data.camera_number === ""){
    error = error + "Camera Number Required, ";
  }
  if(data.store_id === ""){
    error = error + "Store Id Required, ";
  }
  if(error && error.toString().length > 0) {
    res.sendServerError(error)
  }else{
    next();
  }

    }catch(error){

    }
}