# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Headers :

- Authorization : token
  
Request Body :

```json
{
    "first_name" : "gilang",
    "last_name" : "murdiyanto",
    "email" : "gilang@example.com",
    "phone" : "02199944300",
}
```

Response Body :

```json
{
    data : {
        "id" : 1,
        "first_name" : "gilang",
        "last_name" : "murdiyanto",
        "email" : "gilang@example.com",
        "phone" : "02199944300",
    }
}
```

## Get Contact

Endpoint : GET /api/contacts/:contactID

Headers :

- Authorization : token
  
Response Body :

```json
{
    data : {
        "id" : 1,
        "first_name" : "gilang",
        "last_name" : "murdiyanto",
        "email" : "gilang@example.com",
        "phone" : "02199944300",
    }
}
```

## Update Contact

Endpoint : PUT /api/contacts/:contactID

Headers :

- Authorization : token
  
Request Body :

```json
{
    "first_name" : "gilang",
    "last_name" : "murdiyanto",
    "email" : "gilang@example.com",
    "phone" : "02199944300",
}
```

Response Body :

```json
{
    data : {
        "id" : 1,
        "first_name" : "gilang",
        "last_name" : "murdiyanto",
        "email" : "gilang@example.com",
        "phone" : "02199944300",
    }
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:contactId

Headers :

- Authorization : token
  
Response Body :

```json
{
    data : true
}
```

## Search Contact

Endpoint : GET /api/contacts

Headers :

- Authorization : token

Query Parameters :

- name : string, contact first_name or last_name, **optional**
- phone : string, contact phone, **optional**
- email : string, contact email, **optional**
- page : number, **default** **1**
- size : number, **default** **10**
  
Response Body :

```json
{
    data : [
        {
            "id" : 1,
            "first_name" : "gilang",
            "last_name" : "murdiyanto",
            "email" : "gilang@example.com",
            "phone" : "02199944300",
        },
        {
            "id" : 2,
            "first_name" : "gilang",
            "last_name" : "murdiyanto",
            "email" : "gilang@example.com",
            "phone" : "02199944300",
        },
        ...
    ],
    paging : {
        "current_page" : 1,
        "total_page" : 10,
        "size" : 10
    }
    
}
```
