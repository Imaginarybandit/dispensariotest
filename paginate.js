const paginate = function paginatedResults(model) {
    return async (req,res,next) => {
        const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page-1) * limit;
    const endIndex = page * limit

   const results = {}
if(endIndex < model.length){
    results.next = {
    page: page +1 ,
    limit:limit
    }}

if(startIndex > 0){
    results.previous = {
        page:page - 1,
        limit: limit
    }}

    try{
    results.results= await model.find().limit(limit).skip(startIndex).exec()
    res.paginatedResults = results
    
    next();
    } catch (e){
        res.status(500).json({message: e.message})
    }
    
   

    }
}

const paginateSearch = function paginatedResults(model) {
    return async (req,res,next) => {
        const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const search = req.query.search
    const startIndex = (page-1) * limit;
    const endIndex = page * limit

   const results = {}
if(endIndex < model.length){
    results.next = {
    page: page +1 ,
    limit:limit
    }}

if(startIndex > 0){
    results.previous = {
        page:page - 1,
        limit: limit
    }}

    try{
    results.results= await model.find(({ name: { $regex: '.*' + search + '.*', $options: 'i' } })).limit(limit).skip(startIndex).exec()
    res.paginatedResults = results
    
    next();
    } catch (e){
        res.status(500).json({message: e.message})
    }
    
   

    }
}

const paginateCat = function paginatedResults(model) {
    return async (req,res,next) => {
        const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const catg = req.query.category
    const startIndex = (page-1) * limit;
    const endIndex = page * limit

   const results = {}
if(endIndex < model.length){
    results.next = {
    page: page +1 ,
    limit:limit
    }}

if(startIndex > 0){
    results.previous = {
        page:page - 1,
        limit: limit
    }}

    try{
    results.results= await model.find({ category: catg }).limit(limit).skip(startIndex).exec()
    res.paginatedResults = results
    
    next();
    } catch (e){
        res.status(500).json({message: e.message})
    }
    
   

    }
}

module.exports = {paginate,paginateSearch,paginateCat}
