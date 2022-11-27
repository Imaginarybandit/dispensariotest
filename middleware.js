const Product = require('./model/product');
const { productSchema } = require('./joischema');
const Carrito = require('./model/carrito');
const ExpressError = require('./Utils/ErrorCatcher')

module.exports.isLoggedIn = (req, res, next) => {
    
    if (!req.isAuthenticated()) {
        //Esto chequea si el usuario a sido verificado
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
};


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/menu/${id}`);
    }
    next();
}

module.exports.validateProduct = (req, res, next) => {

    const { error } = productSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }

}

