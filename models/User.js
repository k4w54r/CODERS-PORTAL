const mongoose = require('mongoose');

/*mongoose.Schema is a class and mongoose.model is a function.
https://mongoosejs.com/docs/2.7.x/docs/model-definition.html*/

//Creating an instance of the mongoose.Schema class for the 'User' model using the constructor of the mongoose.Schema class.

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating a model named 'User' by passing the name of the collection the model is for (users) and the Schema (UserSchema) to the mongoose.model function
//The first argument is the singular name of the collection the model is for. ** Mongoose automatically looks for the plural, lowercased version of the model name. ** Thus, for the example above, the model User is for the users collection in the database.
//https://mongoosejs.com/docs/models.html
User = mongoose.model('User', UserSchema);
//Exporting the User model
module.exports = User;

/*In mongoose, a schema represents the structure of a particular document, either completely or just a portion of the document. It's a way to express expected properties and values as well as constraints and indexes. A model defines a programming interface for interacting with the database (read, insert, update, etc). So a schema answers "what will the data in this collection look like?" and a model provides functionality like "Are there any records matching this query?" or "Add a new document to the collection".

In straight RDBMS, the schema is implemented by DDL statements (create table, alter table, etc), whereas there's no direct concept of a model, just SQL statements that can do highly flexible queries (select statements) as well as basic insert, update, delete operations.

Another way to think of it is the nature of SQL allows you to define a "model" for each query by selecting only particular fields as well as joining records from related tables together.
https://stackoverflow.com/questions/22950282/mongoose-schema-vs-model*/
