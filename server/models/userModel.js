const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastname:{
         type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
         type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
   firebaseUid: {
    type: String,
    unique: true,
    sparse: true,    // only for users who login with Firebase
},
    authMethod: {
        type: String,
        enum: ['manual', 'firebase', 'google'],
        default: 'manual'
    },
    age:{
        type:Number,
        min:10,
        max:60,
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default: 'user'
    }, 
    problemSolved: {
        type:[{
    type: Schema.Types.ObjectId,
    ref: "Problem"
  }],
 
        default: [],
       sparse: true  // Allows multiple documents without this field
}
,
    password:{
        type: String,
     required: function () {
      return this.authMethod === "manual"; // password only required for manual signup
    }
    }
}, 
{
    timestamps:true
}
)

module.exports = mongoose.model("User", userSchema);
