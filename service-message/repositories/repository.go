package repositories

import (
	"fmt"
	"time"
)

// Test1 test
func Test1() {
	fmt.Print("test 1")
}

// TodoListItem structure
type TodoListItem struct {
	ID        int       `bson:"id" json:"id"`
	Task      string    `bson:"task" json:"task"`
	DueDate   time.Time `bson:"dueDate" json:"dueDate"`
	UserID    string    `bson:"userId" json:"userId"`
	Done      bool      `bson:"done" json:"done"`
	Important bool      `bson:"important" json:"important"`
}

// TodoRepository interface
type TodoRepository interface {
	Insert(t TodoListItem) error
	Close()
}
