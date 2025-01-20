# Address API Spec

## Create Address

Endpoints : POST /api/contacts/:contactId/addresses

Headers :

- Authorization : token
  
Request Body :

```json
{
    "street" : "jalan apa", //optional
    "city" : "kota apa", //optional
    "province" : "provinsi apa", //optional
    "country" : "negara apa",
    "postalCode" : 12345,
}
```

Response Body :

```json
{
        data : {
        "id" : 1, 
        "street" : "jalan apa", //optional
        "city" : "kota apa", //optional
        "province" : "provinsi apa", //optional
        "country" : "negara apa",
        "postalCode" : 12345,
    }
}
```

## Get Address

Endpoints : GET /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token
  
Response Body :

```json
{
        data : {
        "id" : 1, 
        "street" : "jalan apa", //optional
        "city" : "kota apa", //optional
        "province" : "provinsi apa", //optional
        "country" : "negara apa",
        "postalCode" : 12345,
    }
}
```

## Update Address

Endpoints : PUT /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token
  
Request Body :

```json
{
    "street" : "jalan apa", //optional
    "city" : "kota apa", //optional
    "province" : "provinsi apa", //optional
    "country" : "negara apa",
    "postalCode" : 12345,
}
```

Response Body :

```json
{
        data : {
        "id" : 1, 
        "street" : "jalan apa", //optional
        "city" : "kota apa", //optional
        "province" : "provinsi apa", //optional
        "country" : "negara apa",
        "postalCode" : 12345,
    }
}
```

## Remove Address

Endpoints : DELETE /api/contacts/:contactId/addresses/:addressId

Headers :

- Authorization : token
  
Response Body :

```json
{
        data : true
}
```

## List Addresses

Endpoints : GET /api/contacts/:contactId/addresses

Headers :

- Authorization : token
  
Response Body :

```json
{
    data : [
        {
            "id" : 1, 
            "street" : "jalan apa", //optional
            "city" : "kota apa", //optional
            "province" : "provinsi apa", //optional
            "country" : "negara apa",
            "postalCode" : 12345,
        },
        {
            "id" : 1, 
            "street" : "jalan apa", //optional
            "city" : "kota apa", //optional
            "province" : "provinsi apa", //optional
            "country" : "negara apa",
            "postalCode" : 12345,
        },
        ...
    ]
}
```
