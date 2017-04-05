import * as mongo from 'mongodb'
import {AppProperties} from "ts-mean-models/app-properties.model";
import {AppConfig} from "../AppConfig";
import {MongoClient} from "mongodb";
import {MongoCallback} from "mongodb";
import {Mongos} from "mongodb";
import {Db} from "mongodb";

export class Connect {
  private appConfig = new AppConfig();

  constructor() {
    this._mongoClient = mongo.MongoClient;
  }

  private _database;
  private _mongoClient;

  private mongoUri = (appParams: AppProperties) => {
    const params = appParams.db;
    return `mongodb://${params.dbuser}:${params.dbpassword}@${params.host}:${params.port}/${params.dbname}`
  };


  public get database() {
    return this._database;
  }

  public connectToDatabase (callback?: (database: Db) => any) {

    // Connect to the db
    this._mongoClient.connect(this.mongoUri(this.appConfig.appConfig), (err, db) => {
      if(!err) {
        this._database = db;
        if (callback) {
          callback(db);
        }
      } else {
        console.log('Error on connecting to MongoDB', err)
      }
    });

  };


}




/*
import {Note} from "../../models/notes.model";


var server = new mongodb.Server('localhost', 27017);
var db = new mongodb.Db('mydb', server, {w: 1});


var MongoClient = mongodb.MongoClient;
var config = require('../../secret.js');

console.log(config);

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});


export function addNote(note: Note, callback:(err, note?: Note) => void) {
  db.collection('note', (err, notesCollection) => {
    if (err) return callback(err);
    notesCollection.insertOne(note, (err, result) => {
      if (err) return callback(err);
      const note = result.ops[0];
      callback(null, note);
    })
  })
}*/