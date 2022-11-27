const Basejoi = require('joi');

const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML':'{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML:{
    validate(value,helpers) {
        const clean = sanitizeHtml( value, {
            allowedTags: [],
            allowedAttributes: {}
        });
        console.log(value)
        if (clean !== value) return helpers.error('string.escapeHTML', {value})
    }
        }
    }
    
    })

 const joi = Basejoi.extend(extension)   

module.exports.productSchema = joi.object({
    product: joi.object({
        name: joi.string().required().escapeHTML(),
        descripcion: joi.string().required().escapeHTML(),
        categorias: joi.string().required().escapeHTML(),
        priceByWT: joi.string(),
        priceByUT: joi.string(),
        pricew: joi.array().items(joi.number().allow(null,'')).optional(),
        priceU: joi.number().allow(null, ''),
        THC: joi.number().allow(null, ''),
        THCMG: joi.number().allow(null, ''),
        CBD: joi.number().allow(null, ''),
        CBDMG: joi.number().allow(null, ''),
        publicar: joi.string().allow(null, ''),
        online: joi.string().allow(null, ''),
        featured: joi.string().allow(null, '')

    })

})


