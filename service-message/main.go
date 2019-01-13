package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/line/line-bot-sdk-go/linebot"
	"github.com/muitsfriday/linebot-todos/service-message/repositories"
)

func main() {

	repo, err := repositories.NewMongo(os.Getenv("MONGODB_URI"), os.Getenv("TODOS_COLL"))
	if err != nil {
		panic("couldn't start server: database connect error " + err.Error())
	}

	defer repo.Close()

	botClient, err := NewBot(os.Getenv("SECRET"), os.Getenv("TOKEN"))
	if err != nil {
		panic("couldn't start server: linebot connect error " + err.Error())
	}

	cache := repositories.ConnectCache()

	http.HandleFunc("/callback", func(w http.ResponseWriter, req *http.Request) {
		events, err := botClient.Client.ParseRequest(req)
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

					if isEditCommand(message.Text) {
						botClient.SendMessage(event.ReplyToken, os.Getenv("EDIT_URI"))
						return
					}

					listitem, err := ParseMessage(message.Text)

					if err != nil {
						botClient.SendMessage(event.ReplyToken, err.Error())
						return
					}

					listitem.UserID = event.Source.UserID
					listitem.Done = false
					listitem.Important = false

					insertionErr := repo.Insert(&listitem)

					if insertionErr != nil {
						botClient.SendMessage(event.ReplyToken, "Error inserting task to database.")
					}
					cache.DeleteUserCache(event.Source.UserID)
					botClient.SendMessage(event.ReplyToken, "New task has added.")
				}
			}
		}
	})

	fmt.Println("server start")

	if err := http.ListenAndServe(":"+os.Getenv("PORT"), nil); err != nil {
		fmt.Println(err.Error())
	}

}

// TODO LIST //

// ParseMessage transform message string to struct
func ParseMessage(message string) (repositories.TodoListItem, error) {
	splited := strings.Split(message, " : ")

	if len(splited) < 2 {
		return repositories.TodoListItem{}, errors.New("the input must be in format task : date/month/year : time")
	}

	task := strings.Trim(splited[0], " ")
	date := strings.ToLower(strings.Trim(splited[1], " "))

	if date == "tomorrow" {
		date = time.Now().AddDate(0, 0, 1).Format("02/01/06")
	}
	if date == "today" {
		date = time.Now().Format("02/01/06")
	}

	if len(splited) > 2 {
		date += " " + strings.Trim(splited[2], " ")
	} else {
		date += " " + "12:00"
	}

	//loc := time.FixedZone("UTC+7", +7*60*60)
	parsedTime, err := time.Parse("02/01/06 15:04", date)

	if err != nil {
		return repositories.TodoListItem{}, errors.New("cannot parse time string")
	}

	return repositories.TodoListItem{
		Task:    task,
		DueDate: parsedTime,
	}, nil
}

func isEditCommand(command string) bool {
	return strings.Trim(strings.ToLower(command), " \n\r") == "edit"
}

// BOT ZONE ====================================================================================================
// =============================================================================================================

// Bot struct holder
type Bot struct {
	Client *linebot.Client
}

// NewBot create new bot holder
func NewBot(secret string, token string) (*Bot, error) {
	bot, err := linebot.New(secret, token)
	if err != nil {
		return &Bot{}, err
	}

	return &Bot{Client: bot}, nil
}

// SendMessage send message to client
func (b *Bot) SendMessage(replyToken string, message string) error {
	msg := linebot.NewTextMessage(message)
	_, err := b.Client.ReplyMessage(replyToken, msg).Do()
	return err
}
