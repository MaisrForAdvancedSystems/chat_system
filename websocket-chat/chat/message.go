package chat

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
) // Import go-sqlite3 library)

type Message struct {
	Id          string     `json:"id"`
	ContentType string     `json:"content_type"`
	From        string     `json:"from"`
	To          string     `json:"to"`
	Content     string     `json:"content"`
	Date        *time.Time `json:"date"`
	User        string     `json:"user"`
	Source      string     `json:"source"`
}

func (self *Message) String() string {
	return self.Id
}

func (self *Message) SaveToDatabase() string {
	return self.Author + " says " + self.Body
}

func init() {

}

func createTable(db *sql.DB) {
	createStudentTableSQL := `CREATE TABLE messages (
		"idStudent" integer NOT NULL PRIMARY KEY AUTOINCREMENT,		
		"code" TEXT,
		"name" TEXT,
		"program" TEXT		
	  );` // SQL Statement for Create Table

	log.Println("Create student table...")
	statement, err := db.Prepare(createStudentTableSQL) // Prepare SQL Statement
	if err != nil {
		log.Fatal(err.Error())
	}
	statement.Exec() // Execute SQL Statements
	log.Println("student table created")
}
