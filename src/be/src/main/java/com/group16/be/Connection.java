package com.group16.be;

import org.bson.Document;

import com.mongodb.MongoClientSettings;
import com.mongodb.MongoException;
import com.mongodb.ServerApi;
import com.mongodb.ServerApiVersion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class Connection {

    private static MongoClient mongoClient;
    private static MongoDatabase database;

    static {
        String uri = Environment.MONGO_URL;

        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(new com.mongodb.ConnectionString(uri))
            .serverApi(ServerApi.builder()
                .version(ServerApiVersion.V1)
                .strict(true)
                .deprecationErrors(true)
                .build())
            .build();

        try {
            mongoClient = MongoClients.create(settings);
            database = mongoClient.getDatabase(Environment.MONGO_DATABASE);

            // Ping the database to confirm the connection
            Document ping = new Document("ping", 1);
            database.runCommand(ping);
            System.out.println("Pinged your deployment. You successfully connected to MongoDB!");
        } catch (MongoException e) {
            e.printStackTrace();
        }
    }

    /**
     * Inserts a new document into the specified collection.
     *
     * @param collectionName The name of the collection to insert the document into.
     * @param data           The JSON string to insert.
     */
    public static void insertNewData(String collectionName, Document data) {
        try {
            if (database == null) {
                throw new IllegalStateException("Database connection is not initialized.");
            }

            // Specify the collection
            MongoCollection<Document> collection = database.getCollection(collectionName);

            // Insert the document into the collection
            collection.insertOne(data);
            System.out.println("New document inserted successfully into collection: " + collectionName);
        } catch (MongoException e) {
            System.err.println("Failed to insert document: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid JSON data: " + e.getMessage());
        }
    }
}
