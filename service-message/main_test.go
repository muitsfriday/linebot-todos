package main

import (
	"fmt"
	"testing"
	"time"
)

// TestMessageTranslate test pass
func TestParseMessage(t *testing.T) {
	message := "todolist task : 02/01/19 : 12:22"
	listitem, err := ParseMessage(message)

	if err != nil {
		t.Error("Expect not error")
	}

	if listitem.Task != "todolist task" {
		t.Error("Expect task to be" + "todolist task" + ", got " + listitem.Task)
	}

	fmt.Print(listitem.DueDate)
	if listitem.DueDate.Month() != 1 {
		t.Errorf("Expect month to be 1 got %d", listitem.DueDate.Month())
	}

	if listitem.DueDate.Year() != 2019 {
		t.Errorf("Expect year to be 19 got %d", listitem.DueDate.Year())
	}

	if listitem.DueDate.Day() != 2 {
		t.Errorf("Expect day to be 2 got %d", listitem.DueDate.Day())
	}
}

func TestParseMessageToday(t *testing.T) {
	message := "todolist task : Today : 12:22"
	listitem, err := ParseMessage(message)

	now := time.Now()

	if err != nil {
		t.Error("Expect not error")
	}

	if listitem.Task != "todolist task" {
		t.Error("Expect task to be" + "todolist task" + ", got " + listitem.Task)
	}

	if listitem.DueDate.Month() != now.Month() {
		t.Errorf("Expect month to be %d got %d", now.Month(), listitem.DueDate.Month())
	}

	if listitem.DueDate.Year() != now.Year() {
		t.Errorf("Expect year to be %d got %d", now.Year(), listitem.DueDate.Year())
	}

	if listitem.DueDate.Day() != now.Day() {
		t.Errorf("Expect day to be %d got %d", now.Day(), listitem.DueDate.Day())
	}

	if listitem.DueDate.Hour() != 12 {
		t.Errorf("Expect hour to be %d got %d", 12, listitem.DueDate.Hour())
	}

}

func TestParseMessageNoTime(t *testing.T) {
	message := "todolist task : Today "
	listitem, err := ParseMessage(message)

	now := time.Now()

	if err != nil {
		t.Error("Expect not error")
	}

	if listitem.Task != "todolist task" {
		t.Error("Expect task to be" + "todolist task" + ", got " + listitem.Task)
	}

	if listitem.DueDate.Month() != now.Month() {
		t.Errorf("Expect month to be %d got %d", now.Month(), listitem.DueDate.Month())
	}

	if listitem.DueDate.Year() != now.Year() {
		t.Errorf("Expect year to be %d got %d", now.Year(), listitem.DueDate.Year())
	}

	if listitem.DueDate.Day() != now.Day() {
		t.Errorf("Expect day to be %d got %d", now.Day(), listitem.DueDate.Day())
	}

	if listitem.DueDate.Hour() != 12 {
		t.Errorf("Expect hour to be %d got %d", 12, listitem.DueDate.Hour())
	}

	if listitem.DueDate.Minute() != 0 {
		t.Errorf("Expect minute to be %d got %d", 0, listitem.DueDate.Minute())
	}
}

func TestParseMessageInComplete(t *testing.T) {
	_, err := ParseMessage("Today : 12:22")

	if err == nil {
		t.Error("Expect error")
	}

}

func TestIsEditCommand(t *testing.T) {
	if !isEditCommand("edit") {
		t.Error("Expect isEditCommand with edit as argument to return true")
	}

	if !isEditCommand("eDit") {
		t.Error("Expect isEditCommand with eDit as argument to return true")
	}

	if !isEditCommand("  eDit ") {
		t.Error("Expect isEditCommand with space to return true")
	}
}
