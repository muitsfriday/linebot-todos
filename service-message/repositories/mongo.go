package repositories

import (
	"strings"

	mgo "gopkg.in/mgo.v2"
)

// MongoTodoListRepository implement repository
type MongoTodoListRepository struct {
	c *mgo.Collection
	s *mgo.Session
}

// NewMongo create new mongo repository for todo list
func NewMongo(uri string, collection string) (*MongoTodoListRepository, error) {
	ss := strings.Split(uri, "/")
	dbname := ss[len(ss)-1]
	session, errM := mgo.Dial(uri)
	if errM != nil {
		panic("couldn't connect mongo: " + uri)
	}

	coll := session.DB(dbname).C(collection)
	return &MongoTodoListRepository{c: coll, s: session}, nil
}

// Insert insert TodoListItem to mongo
func (r *MongoTodoListRepository) Insert(t *TodoListItem) error {
	return r.c.Insert(t)
}

// Close session
func (r *MongoTodoListRepository) Close() {
	r.s.Close()
}
