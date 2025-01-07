const adminAccess=async (req,res,next)=>{
        if(req.headers.role === 'admin'){
        next()
    }
    else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
}
module.exports=adminAccess