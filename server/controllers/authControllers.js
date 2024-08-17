const getTest = async(req , res)=>{
    res.status(200).json({
        message: "Sufian API is working",
    })
};


module.exports = {
getTest,
}