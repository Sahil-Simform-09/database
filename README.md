## MongoDB
### 1. create operation
- **Insert a Single Document**      
    - [db.collection.insertOne()](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/) inserts a single document into a collection.
- **Insert Multiple Documents**     
    - [db.collection.insertMany()](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/) can insert multiple documents into a collection. Pass an array of documents to the method.
- **Insert Behavior**
    - Collection Creation
        If the collection does not currently exist, insert operations will create the collection.
    - _id Field     
        In MongoDB, each document stored in a collection requires a unique _id field that acts as a primary key. If an inserted document omits the _id field, the MongoDB driver automatically generates an ObjectId for the _id field.
    - Atomicity
        All write operations in MongoDB are atomic on the level of a single document. For more information on MongoDB and atomicity, see Atomicity and Transactions.
- **Write Concern**
    - Cover at time transaction. [Write concern](https://www.mongodb.com/docs/manual/reference/write-concern/)
### 2. read operation
    - How array reading is done in mongoDb (Time complexity)
    - {
        movie: "df",
        characters: [
            "sdf",
            "cdgf",
            "dfgfd"
        ]
    }
### 3. update operation
- **update a Single Document**
    - [db.collection.updateOne()](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne) Updates at most a single document that match a specified filter even though multiple documents may match the specified filter.
- **update a all Documents**
    - [db.collection.updateMany()](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/) Update all documents that match a specified filter.
- **Update Operators**
    - [Field Operators](https://www.mongodb.com/docs/manual/reference/operator/update-field/)
- **Queries**
    1. Updating matched array element.
        - Update mostFamous property value from true to yes where title is naruto.
        - ` db.movie.updateOne({list: {$elemMatch: {"title": "Naruto"}}}, {$set: {"list.$.mostFamous": "yes"}})`
        - But this query will update only one document within array, the first document matches the condition.
        - [About $(update)](https://www.mongodb.com/docs/manual/reference/operator/update/positional/)
    2. Updating all array elements.
        - Add new field for all movies which besides in Anime category. Field name origin and value Japan.
        - `db.movie.updateOne({"title": "Anime"}, {$set: {"list.$[].origin": "Japan"}})`
        - [About $[]](https://www.mongodb.com/docs/manual/reference/operator/update/positional-all/)
    3. Finding and Updating specific feilds.
        - Add new field for all movies which are released brefore 2000. Field Name `hit` and value `true`.
        - `db.movie.updateMany({"list": {$elemMatch: {"year": {$lt: 2000}}}}, {$set: {"list.$[el].hit": true}}, {arrayFilters: [{"el.year": {$lt: 2000}}]})`
        - [About $[]](https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/)
    4. Adding Elements to array.
        - Add 2 movies into list where title is Hollywood movies and add in sorted according year.          
            {title: 'Transformers', year: 2023, genre: 'Sci-Fi', director: 'Christopher Nolan'}     
            {title: 'Mission Impossible', year: 2023, genre: 'Action', director: 'Joss Whedon'}
        - `db.movie.updateOne({"title": "Hollywood Movies"}, {$push: {"list": {$each: [{title: 'Transformers', year: 2023, genre: 'Sci-Fi', director: 'Christopher Nolan'}, {title: 'Mission Impossible', year: 2023, genre: 'Action', director: 'Joss Whedon'}], $sort: {"year": 1}}}})`
        - [About $push](https://www.mongodb.com/docs/manual/reference/operator/update/push/)
    5. Removing Elements from array.
        - Remove movies where movies title are Transformers & Mission Impossible from list where title is Hollywood Movies
        - `db.movie.updateOne({"title": 'Hollywood Movies'}, {$pull: {"list": {"title": {$in: ["Transformers", "Mission Impossible"]}}}})` 
        - [About $pull](https://www.mongodb.com/docs/manual/reference/operator/update/pull/)
    6. Add only unique element.
        - Add two movies into list where title is Hollywood movies if new movie already exist in list then it should not add again that movie.      
            {title: 'Transformers', year: 2023, genre: 'Sci-Fi', director: 'Christopher Nolan'}         
            {title: 'Tuddum', year: 2023, genre: 'Action', director: 'Joss Whedon'}
        - `db.movie.updateOne({"title": 'Hollywood Movies'}, {$addToSet: {"list": {$each: [{title: 'Transformers', year: 2023, genre: 'Sci-Fi', director: 'Christopher Nolan'}, {title: 'Tuddum', year: 2023, genre: 'Action', director: 'Joss Whedon'}]}}})`
        - [About $addToSet](https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/)
### 4. delete operation
-  **delete a Single Document**
    - [db.collection.deleteOne()](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne) Delete at most a single document that match a specified filter even though multiple documents may match the specified filter.
- **delete all Documents**
    - [db.collection.deleteMany()](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany) Delete all documents that match a specified filter.
### 5. Indexes
- **[Single Field Indexes](https://www.mongodb.com/docs/manual/core/index-single/)**
    - MongoDB provides complete support for indexes on any field in a collection of documents. By default, all collections have an index on the _id field.
- **[Compound Indexes](https://www.mongodb.com/docs/manual/core/index-compound/)**
    - MongoDB supports compound indexes, where a single index structure holds references to multiple fields [1] within a collection's documents. 
    - Compund indexes is created from left to right. 
    > Ex. ``db.<collection>.createdIndex({name: 1, gender: 1, city: 1})``           
        Scenario When this compund index will use  or not.      
        1. search key as name, YES      
        2. search key as name+gender, YES       
        3. search key as gender, NO     
        4. search key as gender+city, NO        
- **Using indexes for sorting**:    
    - If you wan't to search something then sort according some property and if we have index on the property on which we have to sort then index scan happens. Because index store the value in sorted order.
    - MongoDB has threshold of 32 MB for sorting in memory and if you don't have index, mongoDB will essentialy fetch all your documents into memory and do the sort there. If your collection has billions of documents then do sorting in memory is not possible for that ew need to create index which accentialy store in sorted order.