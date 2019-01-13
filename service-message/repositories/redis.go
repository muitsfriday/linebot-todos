package repositories

import (
	"fmt"
	"os"

	"github.com/gomodule/redigo/redis"
)

// Cache structure
type Cache struct {
	Client redis.Conn
}

// ConnectCache get cache structure
func ConnectCache() *Cache {
	client, err := redis.DialURL(os.Getenv("REDIS_URL"))

	if err != nil {
		fmt.Println(err)
	}

	return &Cache{
		Client: client,
	}
}

// DeleteUserCache remove user list todo cache
func (c *Cache) DeleteUserCache(userID string) {
	r, _ := c.Client.Do("HGET", "user:"+userID+":todos", "1")
	s, err := c.Client.Do("DEL", "user:"+userID+":todos")

	fmt.Println("rrrrr", r)
	fmt.Println("sssss", s, err)
}
