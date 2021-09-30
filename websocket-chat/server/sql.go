package chat

import (
	"database/sql"
	"errors"
	"log"
	"sync"
	"time"

	_ "github.com/mattn/go-sqlite3"
) // Import go-sqlite3 library)

var lock sync.Mutex

const dbName = "./sqlite-database.db"

func init() {
	sqliteDatabase, _ := sql.Open("sqlite3", dbName) // Open the created SQLite File
	defer sqliteDatabase.Close()                     // Defer Closing the database
	createMessagesTable(sqliteDatabase)
	createSessionsTable(sqliteDatabase) // Create Database Tables
}

func createMessagesTable(db *sql.DB) {
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

func createSessionsTable(db *sql.DB) {
	createStudentTableSQL := `CREATE TABLE IF NOT EXISTS sessions (
		"id" integer NOT NULL PRIMARY KEY,	
		"name" int,	
		"type" TEXT,
		"join_date" TEXT
		"left_date" TEXT	
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
	if true {
		return nil
	}
	if m == nil {
		return nil
	}
	sqliteDatabase, _ := sql.Open("sqlite3", dbName) // Open the created SQLite File
	defer sqliteDatabase.Close()
	return insertMessage(sqliteDatabase, m)
}

func saveNewSession(m *Client) error {
	if true {
		return nil
	}
	if m == nil {
		return nil
	}
	sqliteDatabase, _ := sql.Open("sqlite3", dbName) // Open the created SQLite File
	defer sqliteDatabase.Close()
	isFound, err := isSessionFound(sqliteDatabase, m)
	if err != nil {
		return err
	}
	if isFound {
		return errors.New("session conflict")
	} else {
		return insertSession(sqliteDatabase, m)
	}
}

func saveSessionName(m *Client) error {
	if true {
		return nil
	}
	if m == nil {
		return nil
	}
	sqliteDatabase, _ := sql.Open("sqlite3", dbName) // Open the created SQLite File
	defer sqliteDatabase.Close()
	isFound, err := isSessionFound(sqliteDatabase, m)
	if err != nil {
		return err
	}
	if isFound {
		return updateSessionUserName(sqliteDatabase, m)
	} else {
		return errors.New("session conflict")
	}
}

func saveSessionLeft(m *Client) error {
	if true {
		return nil
	}
	if m == nil {
		return nil
	}
	sqliteDatabase, _ := sql.Open("sqlite3", dbName) // Open the created SQLite File
	defer sqliteDatabase.Close()
	isFound, err := isSessionFound(sqliteDatabase, m)
	if err != nil {
		return err
	}
	if isFound {
		return updateSessionLeftDate(sqliteDatabase, m)
	} else {
		return errors.New("session conflict")
	}
}

// We are passing db reference connection from main to our method with other parameters
func insertMessage(db *sql.DB, m *Message) error {
	if true {
		return nil
	}
	lock.Lock()
	defer lock.Unlock()
	log.Println("Inserting message record ...")
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

// We are passing db reference connection from main to our method with other parameters
func insertSession(db *sql.DB, m *Client) error {
	if true {
		return nil
	}
	lock.Lock()
	defer lock.Unlock()
	log.Println("Inserting student record ...")
	insertStudentSQL := `INSERT INTO sessions(id,name, join_date) VALUES (?,?,?)`
	statement, err := db.Prepare(insertStudentSQL) // Prepare statement.
	// This is good to avoid SQL injections
	if err != nil {
		return err
	}
	_, err = statement.Exec(m.id, m.name, time.Now().String())
	if err != nil {
		return err
	}
	return nil
}

// We are passing db reference connection from main to our method with other parameters
func updateSessionUserName(db *sql.DB, m *Client) error {
	if true {
		return nil
	}
	lock.Lock()
	defer lock.Unlock()
	log.Println("Inserting student record ...")
	insertStudentSQL := `update sessions set name=? where id=?`
	statement, err := db.Prepare(insertStudentSQL) // Prepare statement.
	// This is good to avoid SQL injections
	if err != nil {
		return err
	}
	_, err = statement.Exec(m.name, m.id)
	if err != nil {
		return err
	}
	return nil
}

// We are passing db reference connection from main to our method with other parameters
func updateSessionLeftDate(db *sql.DB, m *Client) error {
	if true {
		return nil
	}
	lock.Lock()
	defer lock.Unlock()
	log.Println("Inserting student record ...")
	insertStudentSQL := `update sessions set left_date=? where id=?`
	statement, err := db.Prepare(insertStudentSQL) // Prepare statement.
	// This is good to avoid SQL injections
	if err != nil {
		return err
	}
	_, err = statement.Exec(time.Now().String(), m.id)
	if err != nil {
		return err
	}
	return nil
}

// We are passing db reference connection from main to our method with other parameters
func isSessionFound(db *sql.DB, m *Client) (bool, error) {
	if true {
		return false, nil
	}
	lock.Lock()
	defer lock.Unlock()
	log.Println("Inserting student record ...")
	insertStudentSQL := `select count(*) count from  sessions where id=?`
	statement, err := db.Prepare(insertStudentSQL) // Prepare statement.
	// This is good to avoid SQL injections
	if err != nil {
		return false, err
	}
	rows, err := statement.Query(m.id)
	if err != nil {
		return false, err
	}
	defer rows.Close()
	rows.Next()
	cnt := 0
	err = rows.Scan(&cnt)
	if err != nil {
		return false, err
	}
	if cnt > 0 {
		return true, nil
	}
	return false, nil
}
