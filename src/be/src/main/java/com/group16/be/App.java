package com.group16.be;

import java.util.UUID;

import org.bson.Document;

/**
 * Hello world!
 */
public class App {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }

    public void addAssignment(UUID id, String title, String description) {
        Document data = new Document()
            .append("id", id.toString())
            .append("title", title)
            .append("description", description);
        Connection.insertNewData("assignments", data);
    }
}