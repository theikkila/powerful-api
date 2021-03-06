Api documentation
====================

#### GET /domains

Read all domains in json-array

```json
[
  {
    "id":1,
    "name":"example.com",
    "master":null,
    "last_check":null,
    "type":"NATIVE",
    "notified_serial":null,
    "account":null,
    "ttl":84600,
    "created_at":"2014-07-11T23:46:25.000Z",
    "updated_at":"2014-07-11T23:46:25.000Z",
    "user_id":null,
    "notes":null
  }
]
```


#### POST /domain
Create a new domain

**REQUEST WITH PAYLOAD**
```json
{
  "domain":"example.com", // (required)
  "soa":{
    "primaryns":"ns1.example.com", // Primary nameserver for zone (required)
    "hostmaster":"master@example.com", // zone admin email (required)
    "refresh":"10800", // Optional (default: 10800)
    "retry":"7200", // Optional (default: 7200)
    "expire":"604800", // Optional (default: 604800)
    "ttl":"10800" // Optional (default: 10800)
  },
  "ns":[ // optional but you can add NS-records for zone in same time with SOA-record
  	"ns1.example.com", 
    "ns2.example.com",
    "ns3.example.com",
    "ns4.example.com"    
  ]
}
```
**RESPONSE**
As how many records/domains created
```json
{
    "domain": 1,
    "ns": 4
}
```

#### DELETE /domains/(domainname)

Delete domain

`DELETE /domains/example.com/records`

```json
{
    "domain": 1
}
```


#### GET /domains/(domainname)/records

Read all records of domain in json-array  
`GET /domains/example.com/records`


```json
[
  {
    "id": 1,
    "domain_id": 1,
    "name": "example.com",
    "type": "SOA",
    "content": "ns1.example.com master@example.com 2014071203 10800 7200 604800 10800",
    "ttl": 84600,
    "prio": null,
    "change_date": 1405122386,
    "created_at": "2014-07-11T23:46:26.000Z",
    "updated_at": "2014-07-11T23:46:26.000Z"
  },
  {
    "id": 2,
    "domain_id": 1,
    "name": "example.com",
    "type": "NS",
    "content": "ns1.example.com",
    "ttl": 84600,
    "prio": null,
    "change_date": 1405122387,
    "created_at": "2014-07-11T23:46:27.000Z",
    "updated_at": "2014-07-11T23:46:27.000Z"
  },
  {
    "id": 3,
    "domain_id": 1,
    "name": "example.com",
    "type": "NS",
    "content": "ns2.example.com",
    "ttl": 84600,
    "prio": null,
    "change_date": 1405122387,
    "created_at": "2014-07-11T23:46:27.000Z",
    "updated_at": "2014-07-11T23:46:27.000Z"
  }
]
```

#### POST /domains/(domainname)/records
Create a new record
`GET /domains/example.com/records`

**REQUEST WITH PAYLOAD**
```json
{
  "name":"server1",
  "type":"A", // Supports all PowerDNS record types
  "content":"192.168.1.2",
  "ttl": "10800" // default: 10800
}
```

**RESPONSE**
```json
{
    "A": 1
}
```

#### POST /domains/(domainname)/records/(recordid)
Update record
`POST /domains/example.com/records/15`

**REQUEST WITH PAYLOAD**
```json
{
  "name":"server1", // required
  "content":"192.168.1.2", // required
  "ttl": "10800" // optional default: 10800
}
```

**RESPONSE**
```json
{
    "A": 1
}
```

#### DELETE /domains/(domainname)/records/(recordid)

Delete record

`DELETE /domains/example.com/records/15`

```json
{
    "record": 1
}
```
