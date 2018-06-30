也许应该按页分离状态

```json
  "entities":{
    "usersById": {},
    "booksById": {},
    "articlesById": {}
  },
  "userPage": {
    "userProfile": {},
    "books": [],
    "ui": {"component1": {}},
    "onEditing": {
      "user": {},
      "book": {} 
    }
  },
  "articlePage": {
    ...
  },
  ...
  ,
  "subDomain": {
    ...
  }
```