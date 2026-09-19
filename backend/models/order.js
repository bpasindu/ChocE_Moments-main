import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    orderId : { 
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true 
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true 
    },
    status : {
        type : String,
        default : "Pending"
    },
    date : {
        type : Date,
        default : Date.now
    },
    items : [
        {
            productId : {
                type : String,
                required : true
            },
            name : {
                type : String,
                required : true
            },
            image : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            },
            pieces : {
                type : Number,
                default : 0
            },
            basePrice : {
                type : Number,
                default : 0
            },
            totalPrice : {
                type : Number,
                required : true
            },
            addOns : {
                giftCard : {
                    type : Boolean,
                    default : false
                },
                customName : {
                    type : String,
                    default : null
                }
            }
        }
    ],
    paymentMethod : {
        type : String,
        default : "cash"
    },
     total : {
        type : Number,
        required : true,
        default : 0
    }

});    

const Order = mongoose.model("Order", orderSchema);
   
export default Order;
       