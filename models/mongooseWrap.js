"use strict";
/*
 * wrapper for CRUD functionality of a mongodb with mongoose
 */
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.set('debug', { color: false });

const conparam = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

exports.retrieve = async function(url, dbn, obj, query, sort) {
    const constr = `mongodb://${url}:27017/${dbn}`;
    await mongoose.connect(constr, conparam);
    const db = mongoose.connection;
    let stuff = null;
    try {
        stuff = await obj.find(query, null, sort);
    } catch(err) {
        console.log(error);
    } finally {
        db.close();
        return stuff;
    }
}

exports.upsert = async function(url, dbn, obj, query, chk) {
    const constr = `mongodb://${url}:27017/${dbn}`;
    await mongoose.connect(constr, conparam);
    const db = mongoose.connection;
    let newquery = query.toObject();        // from SO, the necessity
    delete newquery._id;                    // must be a mongooseerror
    let stuff = null;
    try {
        stuff = await obj.findOneAndUpdate(chk, query, {upsert: true});
    } catch(err) {
        console.log(error);
    } finally {
        db.close();
        return stuff;
    }
}