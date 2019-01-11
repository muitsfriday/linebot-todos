package main

import (
	"fmt"
	"testing"
)

// TestMessageTranslate test pass
func TestMessageTranslate(t *testing.T) {
	message := "todolist task : 02/01/19 : 12:22"
	listitem, err := MessageTranslate(message)
	if err != nil {
		t.Error("Expect not error")
	}

	if listitem.Task != "todolist task" {
		t.Error("Expect task to be" + "todolist task" + ", got " + listitem.Task)
	}

	fmt.Print(listitem.DueDate)
	if listitem.DueDate.Month() != 1 {
		t.Errorf("Expect task to be 1 got %d", listitem.DueDate.Month())
	}

	if listitem.DueDate.Year() != 2019 {
		t.Errorf("Expect task to be 19 got %d", listitem.DueDate.Year())
	}

	if listitem.DueDate.Day() != 2 {
		t.Errorf("Expect task to be 2 got %d", listitem.DueDate.Day())
	}
}
