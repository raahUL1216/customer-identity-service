# Customer Identify Service

## Development server
> npm run start

## API

Identity
```
POST https://identity-service-y3su.onrender.com/identify
{
	"email"?: string,
	"phoneNumber"?: number
}
```

Get all contacts
```
GET https://identity-service-y3su.onrender.com/all
```

Delete contact
```
DELETE https://identity-service-y3su.onrender.com/contact/1
```