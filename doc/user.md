# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "syxyz",
    "password" : "secret",
    "name" : "syxtem",
}
```

Response Body : (Success)

```json
{
    data : {
        "username" : "syxyz",
        "name" : "syxtem",
    }
}
```

Response Body : (Failed)

```json
{
    errors : "username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "syxyz",
    "password" : "secret",
}
```

Response Body : (Success)

```json
{
    data : {
        "username" : "syxyz",
        "name" : "syxtem",
        "token" : "session_id_generated",
    }
}
```

Response Body : (Failed)

```json
{
    errors : "username or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body : (Success)

```json
{
    data : {
        "username" : "syxyz",
        "name" : "syxtem"
    }
}
```

Response Body : (Failed)

```json
{
    errors : "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token
  
Request Body :

```json
{
    "password" : "secret", //optional, if want to change password
    "name" : "syxtem", //optional, if want to change name
}
```

Response Body : (Success)

```json
{
    data : {
        "username" : "syxyz",
        "name" : "syxtem",
    }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :

- Authorization : token

Response Body : (Success)

```json
{
    data : true
}
