Api documentation
====================

#### GET /domains

Return all domains in json-array

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
