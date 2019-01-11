package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/line/line-bot-sdk-go/linebot"
	mgo "gopkg.in/mgo.v2"
)

func main() {

	fmt.Println("enter main")
	bot, err := linebot.New(os.Getenv("SECRET"), os.Getenv("TOKEN"))
	if err != nil {
		fmt.Println(err)
	}

	ss := strings.Split(os.Getenv("MONGODB_URI"), "/")
	dbname := ss[len(ss)-1]

	session, errMgo := mgo.Dial(os.Getenv("MONGODB_URI"))
	if errMgo != nil {
		fmt.Print(os.Getenv("MONGODB_URI"))
		panic("end")
	}
	defer session.Close()

	todoColl := session.DB(dbname).C("todos")

	http.HandleFunc("/callback", func(w http.ResponseWriter, req *http.Request) {
		events, err := bot.ParseRequest(req)
		if err != nil {
			if err == linebot.ErrInvalidSignature {
				w.WriteHeader(400)
			} else {
				w.WriteHeader(500)
			}
			return
		}

		for _, event := range events {

			switch event.Type {
			case linebot.EventTypeMessage:

				switch message := event.Message.(type) {
				case *linebot.TextMessage:

					listitem, err := MessageTranslate(message.Text)

					if err != nil {
						if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(err.Error())).Do(); err != nil {
							fmt.Println(err)
						}
						return
					}

					listitem.UserID = event.Source.UserID
					listitem.Done = false
					listitem.Important = false

					insertionErr := todoColl.Insert(&listitem)

					if insertionErr != nil {
						if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage("error inserting task")).Do(); err != nil {
							fmt.Println(err)
						}
					}

					if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage("added new task")).Do(); err != nil {
						fmt.Println(err)
					}
				}
			}
		}
	})

	fmt.Println("server start")

	if err := http.ListenAndServe(":"+os.Getenv("PORT"), nil); err != nil {
		fmt.Println(err.Error())
	}

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

// MessageTranslate transform message string to struct
func MessageTranslate(message string) (TodoListItem, error) {
	splited := strings.Split(message, " : ")

	fmt.Println(len(splited))

	if len(splited) < 2 {
		return TodoListItem{}, errors.New("the input must be in format ")
	}

	task := splited[0]
	date := splited[1]

	if len(splited) > 2 {
		date += " " + splited[2]
	} else {
		date += " " + "12:00"
	}

	//loc := time.FixedZone("UTC+7", +7*60*60)
	parsedTime, err := time.Parse("01/02/06 03:04", date)

	fmt.Println(parsedTime)

	if err != nil {
		return TodoListItem{}, errors.New("cannot parse time string")
	}

	return TodoListItem{
		Task:    task,
		DueDate: parsedTime,
	}, nil
}
