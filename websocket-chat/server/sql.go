package chat

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
) // Import go-sqlite3 library)

func init() {
	sqliteDatabase, _ := sql.Open("sqlite3", "./sqlite-database.db") // Open the created SQLite File
	defer sqliteDatabase.Close()                                     // Defer Closing the database
	createTable(sqliteDatabase)                                      // Create Database Tables
}

func createTable(db *sql.DB) {
	createStudentTableSQL := `CREATE TABLE IF NOT EXISTS messages (
		"id" integer NOT NULL PRIMARY KEY,	
		"message_type" int,	
		"content_type" TEXT,
		"from" TEXT,
		"to" TEXT,
		"content" TEXT,
		"date" TEXT,
		"user" TEXT,
		"source" TEXT		
	  );` // SQL Statement for Create Table

	log.Println("Create table...")
	statement, err := db.Prepare(createStudentTableSQL) // Prepare SQL Statement
	if err != nil {
		log.Fatal(err.Error())
	}
	statement.Exec() // Execute SQL Statements
	log.Println("student table created")
}

func saveMessage(m *Message) error {
	if m == nil {
		return nil
	}
	sqliteDatabase, _ := sql.Open("sqlite3", "./sqlite-database.db") // Open the created SQLite File
	defer sqliteDatabase.Close()
	return insertMessage(sqliteDatabase, m)
}

// We are passing db reference connection from main to our method with other parameters
func insertMessage(db *sql.DB, m *Message) error {
	log.Println("Inserting student record ...")
	insertStudentSQL := `INSERT INTO messages(id,message_type, content_type, from,to,content,source,user) VALUES (?,?,?,?,?,?,?)`
	statement, err := db.Prepare(insertStudentSQL) // Prepare statement.
	// This is good to avoid SQL injections
	if err != nil {
		return err
	}
	_, err = statement.Exec(m.Id, m.MessageType, m.ContentType, m.From, m.To, m.Content, m.Source, m.User)
	if err != nil {
		return err
	}
	return nil
}
